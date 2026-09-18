<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'
import type { ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Card } from '../lib/catalog-schema'
import type { PaletteTokens } from '../lib/palettes'

defineProps<{
  cards: Card[]
  palette: PaletteTokens
  isDark: boolean
  feedback?: ClipboardFeedback
}>()
</script>

<template>
  <section aria-label="Services" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <ServiceCard
      v-for="(card, index) in cards"
      :key="card.id"
      :card="card"
      :palette="palette"
      :is-dark="isDark"
      :index="index"
      :feedback="feedback"
    />
  </section>
</template>
