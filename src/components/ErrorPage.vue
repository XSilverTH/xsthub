<script setup lang="ts">
import { computed } from 'vue'
import { House, RotateCcw } from 'lucide-vue-next'
import ThemeControl from './ThemeControl.vue'
import AuroraBackground from './AuroraBackground.vue'
import { useTheme } from '../composables/useTheme'
import { getActivePalette } from '../lib/palettes'

const props = defineProps<{
  code: number
  phrase: string
  title: string
  message: string
}>()

const { isDark } = useTheme()
const palette = getActivePalette()
const headerDot = computed(() => palette.headerDot[isDark.value ? 'dark' : 'light'])
const accent = computed(() => {
  const slot = props.code >= 500 && props.code < 600 ? 'tertiary' : 'primary'
  return palette.slots[slot][isDark.value ? 'dark' : 'light']
})

function retry(): void {
  window.location.reload()
}
</script>

<template>
  <div
    class="app-shell relative min-h-screen overflow-x-clip"
    :style="{ backgroundColor: palette.canvas[isDark ? 'dark' : 'light'] }"
  >
    <AuroraBackground :palette="palette" :is-dark="isDark" />
    <div class="absolute right-6 top-6 z-20 md:right-12 md:top-12">
      <ThemeControl />
    </div>
    <main class="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col items-center justify-center px-6 py-12 text-center">
      <h1
        class="font-sans font-bold leading-[0.92] tracking-[-0.06em] text-slate-950 dark:text-white text-[clamp(3.5rem,14vw,8.5rem)]"
      >
        {{ code }}<span class="ml-0.5" :style="{ color: accent.accent }" aria-hidden="true">.</span>
      </h1>
      <h2 class="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50">
        {{ title }}
      </h2>
      <p class="mt-4 max-w-xl text-base font-light leading-relaxed text-slate-600 md:text-lg dark:text-slate-400">
        {{ message }}
      </p>
      <div class="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="/"
          class="hub-action flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-center text-sm font-medium"
          :style="{
            '--action-bg': accent.actionBg,
            '--action-fg': accent.actionFg,
            '--action-hover-bg': accent.actionHoverBg,
          }"
        >
          <House :size="16" aria-hidden="true" />
          <span>Back home</span>
        </a>
        <button
          type="button"
          class="hub-action flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-center text-sm font-medium"
          :style="{
            '--action-bg': accent.actionBg,
            '--action-fg': accent.actionFg,
            '--action-hover-bg': accent.actionHoverBg,
          }"
          @click="retry"
        >
          <RotateCcw :size="16" aria-hidden="true" />
          <span>Try again</span>
        </button>
      </div>
      <p class="mt-9 font-mono text-xs lowercase tracking-wide text-slate-400 dark:text-slate-600">
        {{ phrase }}
      </p>
    </main>
    <footer class="absolute inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-6 md:pb-8">
      <a href="/" class="font-sans text-sm font-bold leading-none tracking-[-0.06em] text-slate-500 dark:text-slate-400">XSilverTH<span class="ml-px" :style="{ color: headerDot }" aria-hidden="true">.</span></a>
    </footer>
  </div>
</template>

<style scoped>
.hub-action {
  background-color: var(--action-bg);
  border-color: transparent;
  color: var(--action-fg);
  transition: background-color 200ms ease, border-color 200ms ease;
}

.hub-action:hover {
  background-color: var(--action-hover-bg);
  border-color: var(--action-fg);
}

@media (prefers-reduced-motion: reduce) {
  .hub-action {
    transition: none;
  }
}
</style>
