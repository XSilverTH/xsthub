<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Laptop, Moon, Sun } from 'lucide-vue-next'
import { useTheme, type ThemeMode } from '../composables/useTheme'

const { mode, isDark, setMode } = useTheme()
const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const optionRefs = ref<Array<HTMLButtonElement | null>>([])
const options: Array<{ value: ThemeMode; label: string; description: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', description: 'Use the light appearance', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Use the dark appearance', icon: Moon },
  { value: 'system', label: 'System', description: 'Follow your device setting', icon: Laptop },
]

const currentLabel = computed(() => options.find((option) => option.value === mode.value)?.label ?? 'System')

function focusOption(index: number): void {
  const option = optionRefs.value[index]
  if (option) option.focus()
}

async function toggleMenu(): Promise<void> {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    focusOption(Math.max(options.findIndex((option) => option.value === mode.value), 0))
  }
}

function chooseMode(nextMode: ThemeMode): void {
  setMode(nextMode)
  open.value = false
  nextTick(() => trigger.value?.focus())
}

function handleMenuKeydown(event: KeyboardEvent): void {
  const current = optionRefs.value.indexOf(document.activeElement as HTMLButtonElement)
  if (event.key === 'Escape') {
    event.preventDefault()
    open.value = false
    trigger.value?.focus()
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault()
    focusOption((current + 1 + options.length) % options.length)
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault()
    focusOption((current - 1 + options.length) % options.length)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusOption(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusOption(options.length - 1)
  }
}

function handleDocumentPointer(event: PointerEvent): void {
  if (!open.value) return
  const target = event.target as Node
  if (!menu.value?.contains(target) && !trigger.value?.contains(target)) open.value = false
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget as Node | null
  if (open.value && !menu.value?.contains(nextTarget) && !trigger.value?.contains(nextTarget)) open.value = false
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    open.value = false
  }
}

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointer))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleDocumentPointer))
</script>

<template>
  <div class="relative z-30" @focusout="handleFocusOut">
    <button
      ref="trigger"
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/40 text-slate-700 shadow-sm transition hover:bg-white/70 dark:border-white/10 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-black/40"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-label="`Theme: ${currentLabel}`"
      title="Change theme"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <Moon v-if="isDark" :size="19" aria-hidden="true" />
      <Sun v-else :size="19" aria-hidden="true" />
    </button>

    <div
      v-if="open"
      ref="menu"
      role="menu"
      aria-label="Theme preference"
      class="absolute right-0 top-[calc(100%+0.6rem)] min-w-44 rounded-2xl border border-black/10 bg-white/90 p-1.5 text-slate-800 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100"
      @keydown="handleMenuKeydown"
    >
      <button
        v-for="(option, index) in options"
        :key="option.value"
        :ref="(element) => { optionRefs[index] = element as HTMLButtonElement | null }"
        type="button"
        role="menuitemradio"
        :aria-checked="mode === option.value"
        class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-white/10"
        :class="mode === option.value ? 'text-primary' : 'text-slate-600 dark:text-slate-300'"
        @click="chooseMode(option.value)"
      >
        <component :is="option.icon" :size="16" aria-hidden="true" />
        <span class="flex-1">
          <span class="block font-medium">{{ option.label }}</span>
          <span class="sr-only">{{ option.description }}</span>
        </span>
        <span v-if="mode === option.value" class="text-xs" aria-hidden="true">●</span>
      </button>
    </div>
  </div>
</template>
