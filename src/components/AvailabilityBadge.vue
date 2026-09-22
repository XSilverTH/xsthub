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
    class="availability-badge group inline-flex h-6 max-w-[1.5rem] items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border px-2 font-mono text-xs font-medium uppercase tracking-wider hover:max-w-[11rem] focus:max-w-[11rem]"
    :class="stateClass"
    :title="availability?.note"
    :aria-label="availability?.note ? `${label}: ${availability.note}` : label"
    tabindex="0"
  >
    <span class="availability-dot h-1.5 w-1.5 shrink-0 rounded-full group-hover:scale-125 group-focus:scale-125" :class="dotClass" aria-hidden="true" />
    <span class="availability-label -translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100">{{ label }}</span>
  </span>
</template>

<style scoped>
.availability-badge {
  transition:
    max-width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 600ms ease,
    border-color 600ms ease,
    color 600ms ease;
}

.availability-dot {
  transition:
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 600ms ease;
}

.availability-label {
  transition:
    opacity 300ms ease,
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-reduced-motion: reduce) {
  .availability-badge,
  .availability-dot,
  .availability-label {
    transition: none;
  }
}
</style>
