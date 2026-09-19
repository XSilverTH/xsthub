<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AuroraBackground from './components/AuroraBackground.vue'
import CatalogEmpty from './components/CatalogEmpty.vue'
import CatalogError from './components/CatalogError.vue'
import CatalogSkeleton from './components/CatalogSkeleton.vue'
import HubHeader from './components/HubHeader.vue'
import ServiceGrid from './components/ServiceGrid.vue'
import { useCatalog } from './composables/useCatalog'
import { useClipboardFeedback } from './composables/useClipboardFeedback'
import { useTheme } from './composables/useTheme'
import { getActivePalette } from './lib/palettes'

const { isDark } = useTheme()
const { status, catalog, errorMessage, errorDetails, loadCatalog, retry } = useCatalog()
const clipboard = useClipboardFeedback()
const palette = getActivePalette()

const liveAnnouncement = computed(() => {
  if (clipboard.statusAnnouncement.value) return clipboard.statusAnnouncement.value
  if (status.value === 'error') return errorMessage.value || 'Unable to load the catalog.'
  return ''
})

onMounted(() => {
  void loadCatalog()
})
</script>

<template>
  <div class="app-shell relative min-h-screen overflow-x-clip" :style="{ backgroundColor: palette.canvas[isDark ? 'dark' : 'light'] }">
    <AuroraBackground :palette="palette" :is-dark="isDark" />
    <main class="relative mx-auto min-h-screen max-w-[1280px] px-6 py-12 md:py-24">
      <HubHeader
        :title="catalog?.site.title ?? 'XSilverTH'"
        :subtitle="catalog?.site.subtitle ?? (status === 'loading' ? 'Loading services...' : 'Service Hub')"
        :contacts="catalog?.contacts ?? []"
        :palette="palette"
        :is-dark="isDark"
        :feedback="clipboard"
      />
      <CatalogSkeleton v-if="status === 'loading'" />
      <CatalogError v-else-if="status === 'error'" :message="errorMessage" :details="errorDetails" @retry="retry" />
      <CatalogEmpty v-else-if="catalog && catalog.cards.length === 0" />
      <ServiceGrid
        v-else-if="catalog"
        :cards="catalog.cards"
        :palette="palette"
        :is-dark="isDark"
        :feedback="clipboard"
      />
    </main>

    <div aria-live="polite" class="sr-only">{{ liveAnnouncement }}</div>
  </div>
</template>
