<script setup lang="ts">
import { computed } from 'vue'
import HubAction from './HubAction.vue'
import AvailabilityBadge from './AvailabilityBadge.vue'
import CardBlocks from './CardBlocks.vue'
import type { ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Card, Block } from '../lib/catalog-schema'
import { iconRegistry } from '../lib/icons'
import { resolveCardTokens } from '../lib/card-colors'
import type { PaletteTokens } from '../lib/palettes'

const props = defineProps<{
  card: Card
  palette: PaletteTokens
  isDark: boolean
  index?: number
  feedback?: ClipboardFeedback
}>()

const tokens = computed(() => resolveCardTokens(props.card, props.palette, props.isDark))
const icon = computed(() => iconRegistry[props.card.icon])
const blocks = computed(() => props.card.blocks ?? [])
const blockColumns = computed<Block[][]>(() => {
  if (props.card.layout !== 'wide' || blocks.value.length < 2) return [blocks.value]
  const firstInstructions = blocks.value[0]?.kind === 'instructions'
  if (firstInstructions) return [blocks.value.slice(0, 1), blocks.value.slice(1)]
  const midpoint = Math.ceil(blocks.value.length / 2)
  return [blocks.value.slice(0, midpoint), blocks.value.slice(midpoint)]
})
const cardStyle = computed(() => ({
  '--card-border': tokens.value.cardBorder,
  '--card-hover-border': tokens.value.cardHoverBorder,
  '--card-delay': `${(props.index ?? 0) * 80}ms`,
}))
const iconStyle = computed(() => ({
  backgroundColor: tokens.value.iconBg,
  borderColor: tokens.value.iconBorder,
  color: tokens.value.iconFg,
  borderWidth: '1px',
}))
const accentStyle = computed(() => ({ color: tokens.value.textFg }))
</script>

<template>
  <article
    class="hub-card relative col-span-1 flex flex-col justify-between rounded-3xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-1"
    :class="[
      card.layout === 'wide' ? 'col-span-1 md:col-span-2 lg:col-span-2' : '',
      isDark
        ? 'bg-[#030712]/75 border border-white/[0.08] hover:border-white/[0.2] shadow-2xl shadow-black/50'
        : 'bg-white/70 border border-black/[0.08] hover:border-black/[0.18] shadow-xl shadow-slate-200/50'
    ]"
    :style="cardStyle"
    :data-card-id="card.id"
  >
    <div class="flex flex-1 flex-col justify-between">
      <div>
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" :style="iconStyle">
            <component :is="icon" :size="22" stroke-width="1.8" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 :class="card.layout === 'wide' ? 'text-2xl font-semibold' : 'text-xl font-medium'" class="tracking-tight text-slate-900 dark:text-slate-50">{{ card.title }}</h2>
              <AvailabilityBadge v-if="card.availability" :availability="card.availability" />
            </div>
            <p v-if="card.subtitle" class="mt-1 break-all font-mono text-xs" :style="accentStyle">{{ card.subtitle }}</p>
          </div>
        </div>

        <p v-if="card.description" class="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ card.description }}</p>
      </div>

      <div
        v-if="blocks.length"
        class="mt-7"
        :class="[
          card.layout === 'wide' && blocks.length > 1 ? 'md:grid md:grid-cols-2 md:gap-8' : '',
          !card.actions?.length && card.layout !== 'wide' ? 'mt-auto pt-6 border-t border-black/5 dark:border-white/10' : ''
        ]"
      >
        <CardBlocks v-for="(column, columnIndex) in blockColumns" :key="`${card.id}-column-${columnIndex}`" :blocks="column" :tokens="tokens" :feedback="feedback" />
      </div>
    </div>
    <div v-if="card.actions?.length" class="mt-8 flex flex-col gap-3 border-t border-black/5 pt-6 sm:flex-row dark:border-white/10">
      <HubAction v-for="action in card.actions" :key="action.id" :action="action" :tokens="tokens" :feedback="feedback" class="w-full flex-1" />
    </div>
  </article>
</template>
<style scoped>
.hub-card {
  animation: hub-card-in 800ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: var(--card-delay);
  transition: border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
}

@keyframes hub-card-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hub-card {
    animation: none;
  }
}
</style>
