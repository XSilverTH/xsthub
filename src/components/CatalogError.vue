<script setup lang="ts">
defineProps<{
  message?: string | null
  details?: string | null
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-red-50/70 p-8 text-center shadow-xl shadow-red-900/5 dark:bg-red-950/20" role="alert">
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-300" aria-hidden="true">!</div>
    <h2 class="mt-5 text-xl font-medium text-slate-900 dark:text-slate-50">Unable to load services</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ message || 'Something went wrong while loading the catalog.' }}</p>
    <p v-if="details && details !== message" class="mt-2 break-words font-mono text-xs text-slate-500 dark:text-slate-400">{{ details }}</p>
    <button type="button" class="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-5 text-sm font-medium text-red-700 transition hover:bg-red-500/20 dark:text-red-200" @click="$emit('retry')">Retry</button>
  </section>
</template>
