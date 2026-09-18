import { computed, ref, watch, type Ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
export type EffectiveTheme = 'light' | 'dark'

function readInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem('xsthub-theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage can be unavailable in privacy mode or sandboxed documents.
  }
  return 'system'
}

const mode = ref<ThemeMode>(readInitialMode())
const mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null
const systemIsDark = ref(mediaQuery?.matches ?? false)
const effectiveTheme = computed<EffectiveTheme>(() => {
  if (mode.value === 'system') return systemIsDark.value ? 'dark' : 'light'
  return mode.value
})
const isDark = computed(() => effectiveTheme.value === 'dark')

function applyTheme(theme: EffectiveTheme): void {
  if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', theme === 'dark')
}

function persistMode(value: ThemeMode): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem('xsthub-theme', value)
  } catch {
    // A storage failure should not prevent the visual preference from applying.
  }
}

watch(effectiveTheme, (theme) => {
  applyTheme(theme)
}, { immediate: true })

if (mediaQuery) {
  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    systemIsDark.value = event.matches
    if (mode.value === 'system') applyTheme(effectiveTheme.value)
  }
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleSystemThemeChange)
  }
}

function setMode(nextMode: ThemeMode): void {
  mode.value = nextMode
  persistMode(nextMode)
  applyTheme(effectiveTheme.value)
}

export function useTheme(): {
  mode: Ref<ThemeMode>
  effectiveTheme: Readonly<Ref<EffectiveTheme>>
  isDark: Readonly<Ref<boolean>>
  setMode: (nextMode: ThemeMode) => void
} {
  return { mode, effectiveTheme, isDark, setMode }
}
