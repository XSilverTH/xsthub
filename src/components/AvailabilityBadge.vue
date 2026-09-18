<script setup lang="ts">
import { computed } from 'vue'
import type { Availability } from '../lib/catalog-schema'

const props = defineProps<{
  availability?: Availability | null
}>()

const state = computed(() => props.availability?.state ?? 'unknown')
const label = computed(() => props.availability?.label ?? state.value.toUpperCase())
const stateClass = computed(() => ({
  online: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  offline: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
  maintenance: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  planned: 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  unknown: 'border-slate-500/25 bg-slate-500/10 text-slate-600 dark:text-slate-300',
}[state.value]))
const dotClass = computed(() => ({
  online: 'bg-emerald-500',
  offline: 'bg-red-500',
  maintenance: 'bg-amber-500',
  planned: 'bg-blue-500',
  unknown: 'bg-slate-400',
}[state.value]))
</script>

<template>
  <span
    class="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wider"
    :class="stateClass"
    :title="availability?.note"
    :aria-label="availability?.note ? `${label}: ${availability.note}` : label"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass" aria-hidden="true" />
    <span>{{ label }}</span>
  </span>
</template>
