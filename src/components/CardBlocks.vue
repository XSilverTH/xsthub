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
      <h3 v-if="block.heading" class="mb-3 border-b border-black/5 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
        {{ block.heading }}
      </h3>

      <p v-if="block.kind === 'text'" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
        {{ block.text }}
      </p>

      <ol v-else-if="block.kind === 'instructions'" class="space-y-3">
        <li v-for="(item, index) in block.items" :key="`${block.id}-${index}`" class="flex items-baseline gap-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <span class="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">{{ index + 1 }}.</span>
          <span>
            <template v-for="(part, partIndex) in textParts(item)" :key="`${block.id}-${index}-${partIndex}`">
              <span
                v-if="part.highlighted"
                class="rounded px-2 py-0.5 font-mono text-xs font-medium"
                :style="{
                  backgroundColor: tokens.tagBg,
                  color: tokens.tagFg,
                }"
              >{{ part.value }}</span>
              <span v-else>{{ part.value }}</span>
            </template>
          </span>
        </li>
      </ol>

      <div v-else-if="block.kind === 'details'" class="space-y-2 rounded-xl border border-black/5 bg-slate-100/50 p-3.5 dark:border-white/[0.08] dark:bg-black/35">
        <div v-for="item in block.items" :key="item.id" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
          <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ item.label }}:</span>
          <span class="break-all font-mono text-xs font-medium" :style="{ color: tokens.textFg }">{{ item.value }}</span>
        </div>
      </div>

      <div v-else-if="block.kind === 'actions'" class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div
          v-for="(action, actionIndex) in block.actions"
          :key="action.id"
          :class="block.actions.length > 2 && actionIndex < 2 ? 'sm:col-span-2' : block.actions.length === 1 ? 'sm:col-span-2' : ''"
        >
          <HubAction :action="action" :tokens="tokens" :feedback="feedback" class="w-full" />
        </div>
      </div>
    </section>
  </div>
</template>
