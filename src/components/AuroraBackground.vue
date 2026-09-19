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
    x: event.clientX - window.innerWidth / 2,
    y: event.clientY - window.innerHeight / 2,
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
  '--aurora-color': colors.value[0],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * -0.3}px, ${offset.value.y * -0.3}px, 0)`,
}))

const layer2Style = computed(() => ({
  '--aurora-color': colors.value[1],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * 0.3}px, ${offset.value.y * 0.3}px, 0)`,
}))

const layer3Style = computed(() => ({
  '--aurora-color': colors.value[2],
  transform: reducedMotion.value
    ? 'none'
    : `translate3d(${offset.value.x * 0.12}px, ${offset.value.y * -0.12}px, 0)`,
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
    <!-- Oversized radial fields share one continuous falloff behind all surfaces. -->
    <div
      class="aurora-blob aurora-blob-1 absolute"
      :class="isDark ? 'mix-blend-screen opacity-[0.32]' : 'mix-blend-multiply opacity-25'"
      :style="layer1Style"
    />

    <div
      class="aurora-blob aurora-blob-2 absolute"
      :class="isDark ? 'mix-blend-screen opacity-[0.28]' : 'mix-blend-multiply opacity-25'"
      :style="layer2Style"
    />

    <div
      class="aurora-blob aurora-blob-3 absolute"
      :class="isDark ? 'mix-blend-screen opacity-30' : 'mix-blend-multiply opacity-20'"
      :style="layer3Style"
    />
  </div>
</template>

<style scoped>
@property --aurora-color {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

.aurora-blob {
  inset: -30%;
  background-image: radial-gradient(
    ellipse 45% 50% at var(--field-position),
    var(--aurora-color) 0%,
    color-mix(in srgb, var(--aurora-color) 65%, transparent) 30%,
    color-mix(in srgb, var(--aurora-color) 30%, transparent) 60%,
    transparent 100%
  );
  filter: blur(clamp(80px, 10vw, 160px));
  transition: --aurora-color 600ms ease;
}

@keyframes aurora-drift-1 {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 17vw 13vh;
  }
}

@keyframes aurora-drift-2 {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: -17vw -11vh;
  }
}

@keyframes aurora-drift-3 {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: -13vw 13vh;
  }
}

.aurora-blob-1 {
  --field-position: 30% 30%;
  animation: aurora-drift-1 18s ease-in-out infinite;
}

.aurora-blob-2 {
  --field-position: 80% 60%;
  animation: aurora-drift-2 22s ease-in-out infinite;
}

.aurora-blob-3 {
  --field-position: 55% 75%;
  animation: aurora-drift-3 20s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob {
    animation: none !important;
    transition: none !important;
  }
}
</style>
