<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink } from 'lucide-vue-next'
import { useClipboardFeedback, type ClipboardFeedback } from '../composables/useClipboardFeedback'
import type { Contact } from '../lib/catalog-schema'
import { iconRegistry } from '../lib/icons'

const props = defineProps<{
  contacts: Contact[]
  accent?: string
  feedback?: ClipboardFeedback
}>()

const ownFeedback = useClipboardFeedback()
const feedback = props.feedback ?? ownFeedback
const root = ref<HTMLElement | null>(null)
const expanded = ref(false)
const isTouch = ref(false)
const activeElement = ref<HTMLElement | null>(null)
const hasMore = computed(() => props.contacts.length > 3)
const visibleContacts = computed(() => props.contacts.slice(0, 3))
const additionalContacts = computed(() => props.contacts.slice(3))
const disclosureId = 'contacts-disclosure'

function detectPointer(): void {
  isTouch.value = window.matchMedia('(pointer: coarse)').matches
}

function rememberFocus(event: FocusEvent): void {
  const target = event.target
  if (target instanceof HTMLElement && target.dataset.contactVisible === 'true') activeElement.value = target
  if (!isTouch.value && hasMore.value) expanded.value = true
}

function handleFocusOut(event: FocusEvent): void {
  if (!isTouch.value && root.value && !root.value.contains(event.relatedTarget as Node | null)) expanded.value = false
}

function handlePointerEnter(): void {
  if (!isTouch.value && hasMore.value) expanded.value = true
}

function handlePointerLeave(): void {
  if (!isTouch.value && !root.value?.contains(document.activeElement)) expanded.value = false
}

function toggleDisclosure(): void {
  expanded.value = !expanded.value
}

function closeFromEscape(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !expanded.value) return
  event.preventDefault()
  expanded.value = false
  nextTick(() => activeElement.value?.focus())
}

function handleGlobalKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && expanded.value) {
    closeFromEscape(event)
  }
}

function linkTarget(contact: Contact): '_blank' | undefined {
  if (contact.action.kind !== 'link') return undefined
  if (contact.action.target === 'same-tab') return undefined
  return /^https?:/i.test(contact.action.href) ? '_blank' : undefined
}

function linkRel(contact: Contact): string | undefined {
  return linkTarget(contact) ? 'noopener noreferrer' : undefined
}

function isExternal(contact: Contact): boolean {
  return linkTarget(contact) === '_blank'
}

async function copyContact(contact: Contact): Promise<void> {
  if (contact.action.kind === 'copy') await feedback.copy(contact.id, contact.action.value)
}

function iconFor(contact: Contact) {
  return iconRegistry[contact.icon]
}
function selectFallback(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) target.select()
}

onMounted(() => {
  detectPointer()
  window.addEventListener('resize', detectPointer, { passive: true })
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', detectPointer)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div
    ref="root"
    class="relative flex flex-col items-end gap-2.5 sm:items-end"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @focusin="rememberFocus"
    @focusout="handleFocusOut"
    @keydown="closeFromEscape"
  >
    <template v-for="contact in visibleContacts" :key="contact.id">
      <a
        v-if="contact.action.kind === 'link'"
        :href="contact.action.href"
        :target="linkTarget(contact)"
        :rel="linkRel(contact)"
        data-contact-visible="true"
        class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-3.5 py-1.5 font-mono text-xs text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
      >
        <component :is="iconFor(contact)" :size="13" :style="{ color: accent }" aria-hidden="true" />
        <span>{{ contact.label }}</span>
        <ExternalLink v-if="isExternal(contact)" :size="11" class="opacity-60" aria-hidden="true" />
      </a>
      <button
        v-else
        type="button"
        data-contact-visible="true"
        class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-3.5 py-1.5 font-mono text-xs text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
        @click="copyContact(contact)"
      >
        <Check v-if="feedback.hasCopied(contact.id)" :size="13" class="text-emerald-500" aria-hidden="true" />
        <Copy v-else :size="13" class="opacity-70" aria-hidden="true" />
        <component :is="iconFor(contact)" :size="13" :style="{ color: accent }" aria-hidden="true" />
        <span>{{ feedback.hasCopied(contact.id) ? 'Copied' : contact.label }}</span>
      </button>
    </template>

    <button
      v-if="hasMore && isTouch"
      type="button"
      class="inline-flex h-8 items-center gap-1 rounded-full border border-black/10 bg-white/35 px-3 font-mono text-xs text-slate-700 transition hover:bg-white/70 dark:border-white/10 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-black/35"
      :aria-expanded="expanded"
      :aria-controls="disclosureId"
      @click="toggleDisclosure"
    >
      <span>{{ expanded ? 'Fewer' : 'More' }}</span>
      <ChevronUp v-if="expanded" :size="13" aria-hidden="true" />
      <ChevronDown v-else :size="13" aria-hidden="true" />
    </button>

    <div
      v-if="hasMore && expanded"
      :id="disclosureId"
      class="basis-full rounded-2xl border border-black/10 bg-white/75 p-2 shadow-lg shadow-slate-900/10 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/20"
      :class="isTouch ? 'mt-1' : 'mt-1'"
    >
      <div class="flex flex-wrap justify-end gap-2">
        <template v-for="contact in additionalContacts" :key="contact.id">
          <a
            v-if="contact.action.kind === 'link'"
            :href="contact.action.href"
            :target="linkTarget(contact)"
            :rel="linkRel(contact)"
            class="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 font-mono text-xs text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-slate-200 dark:hover:border-white/30"
          >
            <component :is="iconFor(contact)" :size="13" aria-hidden="true" />
            <span>{{ contact.label }}</span>
            <ExternalLink v-if="isExternal(contact)" :size="11" aria-hidden="true" />
          </a>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 font-mono text-xs text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-slate-200 dark:hover:border-white/30"
            @click="copyContact(contact)"
          >
            <Check v-if="feedback.hasCopied(contact.id)" :size="13" aria-hidden="true" />
            <Copy v-else :size="13" aria-hidden="true" />
            <component :is="iconFor(contact)" :size="13" aria-hidden="true" />
            <span>{{ feedback.hasCopied(contact.id) ? 'Copied' : contact.label }}</span>
          </button>
        </template>
      </div>
    </div>

    <div v-if="feedback.failedActionId.value && feedback.fallbackValue.value" class="basis-full text-right">
      <div class="mt-1 rounded-xl border border-amber-500/30 bg-amber-50/90 p-3 text-left text-xs text-amber-950 shadow-lg dark:bg-amber-950/80 dark:text-amber-100">
        <p class="mb-2">Copy manually:</p>
        <input class="w-full rounded-lg border border-amber-500/30 bg-white/70 px-2 py-1.5 font-mono text-xs dark:bg-black/20" :value="feedback.fallbackValue.value" readonly aria-label="Text to copy manually" @focus="selectFallback" />
        <button type="button" class="mt-2 text-xs font-medium underline" @click="feedback.clearFallback">Dismiss</button>
      </div>
    </div>
  </div>
</template>
