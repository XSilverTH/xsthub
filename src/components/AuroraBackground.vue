<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PaletteTokens } from '../lib/palettes'

const props = defineProps<{
  palette: PaletteTokens
  isDark: boolean
}>()

const reducedMotion = ref(false)
const paused = ref(false)
const mouse = ref({ x: 0, y: 0 })
const offset = ref({ x: 0, y: 0 })
let frame: number | undefined
let mediaQuery: MediaQueryList | null = null

const colors = computed(() => props.palette.aurora[props.isDark ? 'dark' : 'light'])

function updateFrame(): void {
  frame = undefined
  if (paused.value || reducedMotion.value) return
  const easing = 0.06
  offset.value = {
    x: offset.value.x + (mouse.value.x - offset.value.x) * easing,
    y: offset.value.y + (mouse.value.y - offset.value.y) * easing,
  }
  if (Math.abs(mouse.value.x - offset.value.x) > 0.1 || Math.abs(mouse.value.y - offset.value.y) > 0.1) {
    frame = window.requestAnimationFrame(updateFrame)
  }
}

function scheduleFrame(): void {
  if (!frame && !paused.value && !reducedMotion.value) {
    frame = window.requestAnimationFrame(updateFrame)
  }
}

function handlePointerMove(event: MouseEvent): void {
  mouse.value = {
    x: event.clientX,
    y: event.clientY,
  }
  scheduleFrame()
}

function handleVisibilityChange(): void {
  paused.value = document.visibilityState !== 'visible'
  if (!paused.value) scheduleFrame()
}

function handleMotionChange(event: MediaQueryListEvent): void {
  reducedMotion.value = event.matches
  if (reducedMotion.value && frame) {
    window.cancelAnimationFrame(frame)
    frame = undefined
  }
}

const layer1Style = computed(() => ({
  backgroundColor: colors.value[0],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * -0.05}px, ${offset.value.y * -0.05}px, 0)`,
}))

const layer2Style = computed(() => ({
  backgroundColor: colors.value[1],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * 0.05}px, ${offset.value.y * 0.05}px, 0)`,
}))

const layer3Style = computed(() => ({
  backgroundColor: colors.value[2],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * 0.02}px, ${offset.value.y * -0.02}px, 0)`,
}))

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mediaQuery.matches
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleMotionChange)
  } else {
    mediaQuery.addListener(handleMotionChange)
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  if (!coarsePointer && !reducedMotion.value) {
    window.addEventListener('mousemove', handlePointerMove, { passive: true })
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (frame) window.cancelAnimationFrame(frame)
  if (mediaQuery) {
    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', handleMotionChange)
    } else {
      mediaQuery.removeListener(handleMotionChange)
    }
  }
  window.removeEventListener('mousemove', handlePointerMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <!-- Aurora Blob 1: Top-Left -->
    <div
      class="aurora-blob aurora-blob-1 absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] transition-colors duration-1000"
      :class="isDark ? 'mix-blend-screen opacity-35' : 'mix-blend-multiply opacity-25'"
      :style="layer1Style"
    />

    <!-- Aurora Blob 2: Top-Right -->
    <div
      class="aurora-blob aurora-blob-2 absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-1000"
      :class="isDark ? 'mix-blend-screen opacity-35' : 'mix-blend-multiply opacity-25'"
      :style="layer2Style"
    />

    <!-- Aurora Blob 3: Bottom-Center -->
    <div
      class="aurora-blob aurora-blob-3 absolute -bottom-[20%] left-[20%] w-[80vw] h-[50vw] rounded-full blur-[120px] transition-colors duration-1000"
      :class="isDark ? 'mix-blend-screen opacity-30' : 'mix-blend-multiply opacity-20'"
      :style="layer3Style"
    />
  </div>
</template>

<style scoped>
@keyframes aurora-drift-1 {
  0%, 100% {
    margin-left: 0;
    margin-top: 0;
  }
  50% {
    margin-left: 4vw;
    margin-top: 3vh;
  }
}

@keyframes aurora-drift-2 {
  0%, 100% {
    margin-right: 0;
    margin-top: 0;
  }
  50% {
    margin-right: 3vw;
    margin-top: -3vh;
  }
}

@keyframes aurora-drift-3 {
  0%, 100% {
    margin-left: 0;
    margin-bottom: 0;
  }
  50% {
    margin-left: -4vw;
    margin-bottom: 4vh;
  }
}

.aurora-blob-1 {
  animation: aurora-drift-1 18s ease-in-out infinite;
}

.aurora-blob-2 {
  animation: aurora-drift-2 22s ease-in-out infinite;
}

.aurora-blob-3 {
  animation: aurora-drift-3 20s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob {
    animation: none !important;
  }
}
</style>
