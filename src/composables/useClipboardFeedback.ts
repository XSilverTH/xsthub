import { onUnmounted, ref, type Ref } from 'vue'

export interface ClipboardFeedback {
  copiedActionId: Ref<string | null>
  hasCopied: (id: string) => boolean
  failedActionId: Ref<string | null>
  fallbackValue: Ref<string | null>
  statusAnnouncement: Ref<string>
  copy: (id: string, value: string, successLabel?: string) => Promise<boolean>
  clearFallback: () => void
}

export function useClipboardFeedback(): ClipboardFeedback {
  const copiedActionId = ref<string | null>(null)
  const failedActionId = ref<string | null>(null)
  const fallbackValue = ref<string | null>(null)
  const statusAnnouncement = ref('')
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  function clearResetTimer(): void {
    if (resetTimer !== undefined) {
      clearTimeout(resetTimer)
      resetTimer = undefined
    }
  }

  function hasCopied(id: string): boolean {
    return copiedActionId.value === id
  }

  function clearFallback(): void {
    failedActionId.value = null
    fallbackValue.value = null
    if (statusAnnouncement.value.startsWith('Unable to copy')) statusAnnouncement.value = ''
  }

  async function copy(id: string, value: string, successLabel = 'Copied'): Promise<boolean> {
    clearResetTimer()
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(value)
      copiedActionId.value = id
      failedActionId.value = null
      fallbackValue.value = null
      statusAnnouncement.value = successLabel
      resetTimer = setTimeout(() => {
        copiedActionId.value = null
        if (statusAnnouncement.value === successLabel) statusAnnouncement.value = ''
        resetTimer = undefined
      }, 2000)
      return true
    } catch {
      copiedActionId.value = null
      failedActionId.value = id
      fallbackValue.value = value
      statusAnnouncement.value = 'Unable to copy. Select the text below and copy it manually.'
      return false
    }
  }

  onUnmounted(() => {
    clearResetTimer()
  })

  return {
    copiedActionId,
    hasCopied,
    failedActionId,
    fallbackValue,
    statusAnnouncement,
    copy,
    clearFallback,
  }
}
