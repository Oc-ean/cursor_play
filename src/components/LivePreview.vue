<template>
  <div
    ref="containerRef"
    class="live-preview relative w-full overflow-hidden rounded-xl"
    :style="containerStyle"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @touchmove.prevent="onTouchMove"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <canvas
      ref="canvasRef"
      :width="canvasW"
      :height="canvasH"
      class="block w-full h-full"
    />

    <Transition name="fade">
      <div
        v-if="showHint"
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      >
        <div class="text-center space-y-3">
          <div class="text-5xl animate-float">{{ store.currentEffect.emoji }}</div>
          <p class="text-ink-muted text-sm font-display tracking-widest uppercase">
            {{ isTouchDevice ? "Swipe here" : "Move your mouse here" }}
          </p>
          <div class="flex items-center gap-2 justify-center">
            <span class="h-px w-8 bg-ink-faint" />
            <span class="text-ink-faint text-xs font-mono">{{
              store.currentEffect.label
            }}</span>
            <span class="h-px w-8 bg-ink-faint" />
          </div>
        </div>
      </div>
    </Transition>

    <div
      class="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-700/80 backdrop-blur-sm border border-surface-500/50 pointer-events-none"
    >
      <span class="text-sm">{{ store.currentEffect.emoji }}</span>
      <span class="text-xs font-display font-medium text-ink-muted">{{
        store.currentEffect.label
      }}</span>
    </div>

    <div
      class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-700/80 backdrop-blur-sm border border-surface-500/50 pointer-events-none"
    >
      <span
        class="w-1.5 h-1.5 rounded-full animate-pulse"
        :style="{ backgroundColor: `rgb(var(--accent-rgb))` }"
      />
      <span class="text-xs font-mono text-ink-muted">{{ particleCount }} particles</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useCursorStore } from "../stores/cursor";
import { useParticleEngine } from "../composables/useParticleEngine";

const store = useCursorStore();
const storeRef = computed(() => store);

const containerRef = ref(null);
const canvasRef = ref(null);
const canvasW = ref(800);
const canvasH = ref(350);
const showHint = ref(true);
const particleCount = ref(0);
const isTouchDevice = ref(false);

const engine = useParticleEngine(canvasRef, storeRef);

const containerStyle = computed(() => ({
  background: ` #141417`,
  border: `2px solid rgba(${store.accentRgb}, 0.12)`,
  minHeight: "420px",
  transition: "border-color 0.5s ease, background 0.5s ease",
}));
function onMouseMove(e) {
  showHint.value = false;
  engine.onMouseMove(e);
}

function onMouseDown(e) {
  engine.onMouseDown(e);
}

function onEnter() {
  showHint.value = false;
}

function onLeave() {
  setTimeout(() => {
    if (engine.getCount() === 0) showHint.value = true;
  }, 1500);
}

function onTouchMove(e) {
  isTouchDevice.value = true;
  showHint.value = false;
  engine.onTouchMove(e);
}

function onTouchStart(e) {
  isTouchDevice.value = true;
  showHint.value = false;
  engine.onTouchStart(e);
}

function onTouchEnd() {
  setTimeout(() => {
    if (engine.getCount() === 0) showHint.value = true;
  }, 1500);
}

let ro = null;
function resize() {
  const el = containerRef.value;
  if (!el) return;
  canvasW.value = el.clientWidth;
  canvasH.value = el.clientHeight;
}

let countInterval = null;

onMounted(() => {
  isTouchDevice.value = window.matchMedia("(pointer: coarse)").matches;

  resize();
  engine.start();
  ro = new ResizeObserver(resize);
  ro.observe(containerRef.value);
  countInterval = setInterval(() => {
    particleCount.value = engine.getCount();
  }, 120);
});

onUnmounted(() => {
  engine.stop();
  ro?.disconnect();
  clearInterval(countInterval);
});

watch(
  () => store.effectId,
  () => {
    engine.clear();
    showHint.value = true;
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
