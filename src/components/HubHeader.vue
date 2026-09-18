<script setup lang="ts">
import { computed } from 'vue'
import ContactList from './ContactList.vue'
import ThemeControl from './ThemeControl.vue'
import type { ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Contact } from '../lib/catalog-schema'
import type { PaletteTokens } from '../lib/palettes'

const props = defineProps<{
  title: string
  subtitle: string
  contacts: Contact[]
  palette: PaletteTokens
  isDark: boolean
  feedback?: ClipboardFeedback
}>()

const headerDot = computed(() => props.palette.headerDot[props.isDark ? 'dark' : 'light'])
</script>

<template>
  <header class="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-5 md:block">
        <h1 class="font-sans text-[3rem] font-bold leading-[0.95] tracking-[-0.07em] text-slate-950 dark:text-slate-50 md:text-[4.5rem]">
          {{ title }}<span class="ml-1" :style="{ color: headerDot }" aria-hidden="true">.</span>
        </h1>
        <div class="shrink-0 md:hidden">
          <ThemeControl />
        </div>
      </div>
      <p class="mt-4 max-w-xl text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300 md:mt-5 md:text-xl">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex shrink-0 items-center justify-between gap-3 md:max-w-[52%] md:justify-end">
      <ContactList :contacts="contacts" :feedback="feedback" />
      <div class="hidden md:block">
        <ThemeControl />
      </div>
    </div>
  </header>
</template>
