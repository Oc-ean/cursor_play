<template>
  <div class="noise min-h-screen" :style="{ '--accent-rgb': store.accentRgb }">
    <div id="cursor-dot" :style="cursorDotStyle" />
    <div id="cursor-ring" :style="cursorRingStyle" />

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useCursorStore } from "./stores/cursor";

const store = useCursorStore();

const mouse = ref({ x: -100, y: -100 });
const ring = ref({ x: -100, y: -100 });
let animFrame = null;

function onMouseMove(e) {
  mouse.value = { x: e.clientX, y: e.clientY };
}

function animateRing() {
  ring.value.x += (mouse.value.x - ring.value.x) * 0.12;
  ring.value.y += (mouse.value.y - ring.value.y) * 0.12;
  animFrame = requestAnimationFrame(animateRing);
}

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  animateRing();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  cancelAnimationFrame(animFrame);
});

const cursorDotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
}));

const cursorRingStyle = computed(() => ({
  left: `${ring.value.x}px`,
  top: `${ring.value.y}px`,
}));
</script>
