<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { Check, Copy, ExternalLink } from 'lucide-vue-next'
import { useClipboardFeedback, type ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Action } from '../lib/catalog-schema'
import type { PaletteSlotTokens } from '../lib/palettes'

const props = defineProps<{
  action: Action
  tokens: PaletteSlotTokens
  feedback?: ClipboardFeedback
}>()

const ownFeedback = useClipboardFeedback()
const feedback = props.feedback ?? ownFeedback
const isExternal = computed(() => {
  if (props.action.kind !== 'link') return false
  return props.action.target === 'new-tab' || /^https?:/i.test(props.action.href)
})
const linkTarget = computed(() => {
  if (props.action.kind !== 'link' || props.action.target === 'same-tab') return undefined
  return isExternal.value ? '_blank' : props.action.target === 'new-tab' ? '_blank' : undefined
})
const linkRel = computed(() => linkTarget.value ? 'noopener noreferrer' : undefined)
const actionStyle = computed(() => ({
  backgroundColor: props.tokens.actionBg,
  borderColor: props.tokens.actionBorder,
  color: props.tokens.actionFg,
}))

async function handleCopy(): Promise<void> {
  if (props.action.kind !== 'copy') return
  await feedback.copy(props.action.id, props.action.value, props.action.successLabel || 'Copied!')
  if (feedback.failedActionId.value === props.action.id) {
    await nextTick()
    const fallback = document.getElementById(`copy-fallback-${props.action.id}`) as HTMLInputElement | null
    fallback?.focus()
  }
}

function selectFallback(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) target.select()
}
</script>

<template>
  <a
    v-if="action.kind === 'link'"
    :href="action.href"
    :target="linkTarget"
    :rel="linkRel"
    class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-center text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    :style="actionStyle"
  >
    <span>{{ action.label }}</span>
    <ExternalLink v-if="isExternal" :size="15" aria-hidden="true" />
  </a>
  <button
    v-else
    type="button"
    class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-center text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    :style="actionStyle"
    @click="handleCopy"
  >
    <Check v-if="feedback.hasCopied(action.id)" :size="15" aria-hidden="true" />
    <Copy v-else :size="15" aria-hidden="true" />
    <span>{{ feedback.hasCopied(action.id) ? (action.successLabel || 'Copied!') : action.label }}</span>
    <span class="sr-only" aria-live="polite">{{ feedback.hasCopied(action.id) ? (action.successLabel || 'Copied!') : '' }}</span>
  </button>

  <div
    v-if="action.kind === 'copy' && feedback.failedActionId.value === action.id && feedback.fallbackValue.value"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-6"
    role="presentation"
    @click.self="feedback.clearFallback"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-amber-500/30 bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`copy-fallback-title-${action.id}`"
    >
      <h2 :id="`copy-fallback-title-${action.id}`" class="font-medium">Copy manually</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Clipboard access is unavailable. Select the value below and copy it.</p>
      <input
        :id="`copy-fallback-${action.id}`"
        class="mt-4 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-white/15 dark:bg-black/20"
        :value="feedback.fallbackValue.value"
        readonly
        aria-label="Text to copy manually"
        @focus="selectFallback"
      />
      <button type="button" class="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-primary underline-offset-2 hover:underline" @click="feedback.clearFallback">Close</button>
    </div>
  </div>
</template>
