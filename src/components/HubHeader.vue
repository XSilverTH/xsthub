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
  <header class="relative mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-5 md:block">
        <h1 class="font-sans text-[3.25rem] font-bold leading-[0.92] tracking-[-0.06em] text-slate-950 dark:text-white md:text-[4.75rem]">
          {{ title }}<span class="ml-0.5" :style="{ color: headerDot }" aria-hidden="true">.</span>
        </h1>
        <div class="shrink-0 md:hidden">
          <ThemeControl />
        </div>
      </div>
      <p class="mt-4 max-w-xl text-base font-light leading-relaxed text-slate-600 dark:text-slate-400 md:mt-5 md:text-lg">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex shrink-0 flex-col items-end gap-4">
      <div class="hidden md:block absolute -top-6 right-0 md:-top-10">
        <ThemeControl />
      </div>
      <ContactList
        :contacts="contacts"
        :accent="palette.slots.primary[isDark ? 'dark' : 'light'].iconFg"
        :feedback="feedback"
      />
    </div>
  </header>
</template>
