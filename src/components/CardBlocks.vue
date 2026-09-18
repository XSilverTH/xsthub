<script setup lang="ts">
import HubAction from './HubAction.vue'
import type { ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Block } from '../lib/catalog-schema'
import type { PaletteSlotTokens } from '../lib/palettes'

withDefaults(defineProps<{
  blocks: Block[]
  tokens: PaletteSlotTokens
  feedback?: ClipboardFeedback
}>(), {
  feedback: undefined,
})

function textParts(text: string): Array<{ value: string; highlighted: boolean }> {
  return text.split(/(xsth\.ir|https?:\/\/[^\s]+)/gi).filter(Boolean).map((value) => ({
    value,
    highlighted: /^(xsth\.ir|https?:\/\/)/i.test(value),
  }))
}
</script>

<template>
  <div v-if="blocks.length" class="space-y-6">
    <section v-for="block in blocks" :key="block.id" class="min-w-0">
      <h3 v-if="block.heading" class="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
        {{ block.heading }}
      </h3>

      <p v-if="block.kind === 'text'" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
        {{ block.text }}
      </p>

      <ol v-else-if="block.kind === 'instructions'" class="space-y-3">
        <li v-for="(item, index) in block.items" :key="`${block.id}-${index}`" class="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 font-mono text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">{{ String(index + 1).padStart(2, '0') }}</span>
          <span>
            <template v-for="(part, partIndex) in textParts(item)" :key="`${block.id}-${index}-${partIndex}`">
              <span v-if="part.highlighted" class="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-white/10 dark:text-slate-100">{{ part.value }}</span>
              <span v-else>{{ part.value }}</span>
            </template>
          </span>
        </li>
      </ol>

      <div v-else-if="block.kind === 'details'" class="space-y-2 rounded-xl border border-black/5 bg-slate-100/50 p-3 dark:border-white/5 dark:bg-black/20">
        <div v-for="item in block.items" :key="item.id" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
          <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ item.label }}</span>
          <span class="break-all text-right font-mono text-xs text-slate-800 dark:text-slate-200">{{ item.value }}</span>
        </div>
      </div>

      <div v-else-if="block.kind === 'actions'" class="flex flex-wrap gap-3">
        <HubAction v-for="action in block.actions" :key="action.id" :action="action" :tokens="tokens" :feedback="feedback" />
      </div>
    </section>
  </div>
</template>
