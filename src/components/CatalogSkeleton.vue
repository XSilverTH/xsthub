<template>
  <section aria-label="Loading services" aria-busy="true" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="index in 5" :key="index" class="animate-pulse rounded-3xl border border-black/10 bg-white/45 p-8 shadow-xl shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/30 dark:shadow-none" :class="index === 1 ? 'md:col-span-2 lg:col-span-2' : ''">
      <div class="flex items-start gap-4">
        <div class="h-12 w-12 rounded-2xl bg-slate-300/60 dark:bg-white/10" />
        <div class="flex-1 space-y-2 pt-1">
          <div class="h-5 w-2/3 rounded bg-slate-300/60 dark:bg-white/10" />
          <div class="h-3 w-1/3 rounded bg-slate-300/50 dark:bg-white/10" />
        </div>
      </div>
      <div class="mt-7 space-y-3">
        <div class="h-3 w-full rounded bg-slate-300/50 dark:bg-white/10" />
        <div class="h-3 w-5/6 rounded bg-slate-300/50 dark:bg-white/10" />
        <div class="mt-6 h-11 w-32 rounded-xl bg-slate-300/50 dark:bg-white/10" />
      </div>
    </div>
  </section>
</template>
