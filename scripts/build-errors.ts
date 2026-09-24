import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $ } from 'bun'
import { createServer } from 'vite'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { HTTP_ERRORS } from '../src/errors/http-errors'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 1. Build one fully-inlined shell (JS/CSS/fonts) into a temp dir so the main
// dist/ output is never clobbered.
const tmp = await mkdtemp(join(tmpdir(), 'xsthub-errors-'))
await $`bunx vite build --config vite.error.config.ts --outDir ${tmp}`.cwd(root)

// 2. Locate the single inlined error shell.
const tmpFiles = await readdir(tmp)
const shellName = tmpFiles.find((file) => file === 'error.html' || file.endsWith('.html'))
if (!shellName) throw new Error(`no html shell found in ${tmp}: ${tmpFiles.join(', ')}`)
const shell = await readFile(join(tmp, shellName), 'utf8')
if (!shell.includes('{{CODE}}') || !shell.includes('{{TITLE}}') || !shell.includes('{{PHRASE}}')) {
  throw new Error('error shell is missing {{CODE}}/{{TITLE}}/{{PHRASE}} placeholders')
}
const [shellHead, shellRest] = shell.split('<div id="app"></div>')
if (shellRest === undefined) throw new Error('error shell is missing <div id="app"></div>')

// 3. SSR-render each status into the shell (same ErrorPage the client hydrates),
// then write standalone files under dist/errors/xxx.html. The component is
// loaded through vite's SSR pipeline so <template>/<style> compile correctly.
const vite = await createServer({
  configFile: resolve(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
})
try {
  const { default: ErrorPage } = await vite.ssrLoadModule(
    resolve(root, 'src/components/ErrorPage.vue'),
  )
  await mkdir(resolve(root, 'dist/errors'), { recursive: true })
  for (const error of HTTP_ERRORS) {
    const app = createSSRApp({
      render: () =>
        h(ErrorPage, {
          code: error.code,
          phrase: error.phrase,
          title: error.title,
          message: error.message,
        }),
    })
    const body = await renderToString(app)
    const title = `${error.code} — ${error.phrase}`
    const html = (
      shellHead
        .replaceAll('{{CODE}}', String(error.code))
        .replaceAll('{{TITLE}}', title)
        .replaceAll('{{PHRASE}}', title) +
      `<div id="app" data-server-rendered="true">${body}</div>` +
      shellRest
        .replaceAll('{{CODE}}', String(error.code))
        .replaceAll('{{TITLE}}', title)
        .replaceAll('{{PHRASE}}', title)
    )
    await writeFile(resolve(root, 'dist/errors', `${error.code}.html`), html, 'utf8')
    console.log(`error page built: dist/errors/${error.code}.html`)
  }
} finally {
  await vite.close()
}

// 4. Copy hashed singlefile assets (fonts are already inlined, but keep any
// emitted files) next to the error pages, then clean up.
const leftovers = (await readdir(tmp)).filter((file) => file !== shellName)
for (const file of leftovers) {
  await cp(join(tmp, file), resolve(root, 'dist/errors', file), { recursive: true })
}
await rm(tmp, { recursive: true, force: true })

console.log(`done: ${HTTP_ERRORS.length} pages`)
