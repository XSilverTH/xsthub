<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PaletteTokens } from '../lib/palettes'

const props = defineProps<{
  palette: PaletteTokens
  isDark: boolean
}>()

const reducedMotion = ref(false)
const paused = ref(false)
const pointer = ref({ x: 0, y: 0 })
const offset = ref({ x: 0, y: 0 })
let frame: number | undefined
let mediaQuery: MediaQueryList | null = null

const colors = computed(() => props.palette.aurora[props.isDark ? 'dark' : 'light'])
const layers = computed(() => [
  {
    class: 'left-[-22vw] top-[-28vw] h-[70vw] w-[70vw] max-h-[900px] max-w-[900px]',
    color: colors.value[0],
    depth: 0.55,
  },
  {
    class: 'right-[-25vw] top-[10vh] h-[60vw] w-[60vw] max-h-[780px] max-w-[780px]',
    color: colors.value[1],
    depth: 0.8,
  },
  {
    class: 'bottom-[-24vw] left-[16vw] h-[50vw] w-[80vw] max-h-[640px] max-w-[1200px]',
    color: colors.value[2],
    depth: 0.38,
  },
])

function updateFrame(): void {
  frame = undefined
  if (paused.value || reducedMotion.value) return
  const easing = 0.075
  offset.value = {
    x: offset.value.x + (pointer.value.x - offset.value.x) * easing,
    y: offset.value.y + (pointer.value.y - offset.value.y) * easing,
  }
  if (Math.abs(pointer.value.x - offset.value.x) > 0.01 || Math.abs(pointer.value.y - offset.value.y) > 0.01) {
    frame = window.requestAnimationFrame(updateFrame)
  }
}

function scheduleFrame(): void {
  if (!frame && !paused.value && !reducedMotion.value) frame = window.requestAnimationFrame(updateFrame)
}

function handlePointerMove(event: PointerEvent): void {
  pointer.value = {
    x: ((event.clientX / Math.max(window.innerWidth, 1)) - 0.5) * 2,
    y: ((event.clientY / Math.max(window.innerHeight, 1)) - 0.5) * 2,
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

function layerStyle(layer: { color: string; depth: number }): Record<string, string> {
  const x = offset.value.x * layer.depth * 18
  const y = offset.value.y * layer.depth * 14
  return {
    background: `radial-gradient(circle at center, ${layer.color} 0%, ${layer.color}cc 28%, transparent 70%)`,
    transform: `translate3d(${x}px, ${y}px, 0)`,
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mediaQuery.matches
  if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', handleMotionChange)
  else mediaQuery.addListener(handleMotionChange)

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  if (!coarsePointer && !reducedMotion.value) window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (frame) window.cancelAnimationFrame(frame)
  if (mediaQuery) {
    if (typeof mediaQuery.removeEventListener === 'function') mediaQuery.removeEventListener('change', handleMotionChange)
    else mediaQuery.removeListener(handleMotionChange)
  }
  window.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div
      v-for="layer in layers"
      :key="layer.color"
      class="absolute rounded-full opacity-60 blur-[100px] transition-colors duration-700 dark:opacity-55"
      :class="layer.class"
      :style="layerStyle(layer)"
    />
  </div>
</template>
