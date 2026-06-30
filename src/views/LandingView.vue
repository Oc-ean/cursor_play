<template>
  <div class="landing min-h-screen flex flex-col">
    <canvas
      ref="bgCanvas"
      class="fixed inset-0 pointer-events-none z-0"
      :width="vp.w"
      :height="vp.h"
      @mousemove="onBgMove"
    />
    <div class="fixed inset-0 z-[1]" @mousemove="onBgMove" />

    <main
      class="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-16"
    >
      <div
        class="flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-surface-500/40 bg-surface-700/30 backdrop-blur-sm"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span class="text-xs font-mono text-ink-muted">
          {{ typedText }}
          <span class="typing-cursor">|</span>
        </span>
      </div>

      <h1 class="font-display font-bold text-center mb-4 leading-none tracking-tight">
        <span class="block text-6xl md:text-8xl text-ink">Cursor</span>
        <span class="block text-6xl md:text-8xl gradient-text">Play</span>
      </h1>

      <p
        class="text-ink-muted text-center max-w-md text-base md:text-lg font-body leading-relaxed mb-10"
      >
        Ten cursor effects. Infinite combinations. A playground for those who believe even
        a mouse trail can be art.
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4">
        <RouterLink
          to="/playground"
          class="group relative overflow-hidden rounded-xl px-8 py-3.5 font-display text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          :style="{
            background: `rgb(var(--accent-rgb))`,
            boxShadow: `0 8px 20px rgba(var(--accent-rgb), 0.15)`,
          }"
        >
          <span class="relative z-10 flex items-center gap-2">
            Try the Playground
            <ArrowRight
              class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>

          <div
            class="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </RouterLink>

        <button
          class="px-6 py-3.5 rounded-xl font-display font-medium text-sm text-ink-muted border border-surface-500/50 hover:border-surface-400/70 hover:text-ink hover:bg-surface-700/40 transition-all duration-200"
          @click="scrollToEffects"
        >
          See all effects
        </button>
      </div>

      <div class="flex items-center gap-8 mt-16 mb-16">
        <div class="text-center" v-for="stat in stats" :key="stat.label">
          <div class="font-display font-bold text-2xl text-ink">{{ stat.value }}</div>
          <div class="text-xs text-ink-muted font-body mt-0.5">{{ stat.label }}</div>
        </div>
      </div>
    </main>

    <section
      ref="effectsSection"
      class="relative z-10 px-6 pb-20 max-w-4xl mx-auto w-full"
    >
      <div class="flex items-center gap-3 mb-8">
        <div class="h-px flex-1 bg-surface-600/60" />
        <span
          class="text-xs font-display font-medium uppercase tracking-widest text-ink-faint"
          >Available Effects</span
        >
        <div class="h-px flex-1 bg-surface-600/60" />
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <RouterLink
          v-for="effect in effects"
          :key="effect.id"
          to="/playground"
          class="effect-preview group flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-600/40 bg-surface-700/20 hover:border-surface-500/60 hover:bg-surface-700/40 transition-all duration-200"
          @click="selectAndGo(effect.id)"
        >
          <span class="text-3xl transition-transform duration-200 group-hover:scale-110">
            {{ effect.emoji }}
          </span>
          <span
            class="text-xs font-display text-ink-muted group-hover:text-ink transition-colors"
          >
            {{ effect.label }}
          </span>
          <span class="text-[10px] text-ink-faint text-center leading-snug">
            {{ effect.desc }}
          </span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ArrowRight } from "@lucide/vue";
import { EFFECTS, useCursorStore } from "../stores/cursor";
import { useParticleEngine } from "../composables/useParticleEngine";
import { computed } from "vue";

const store = useCursorStore();
const bgCanvas = ref(null);
const effectsSection = ref(null);
const vp = ref({ w: window.innerWidth, h: window.innerHeight });
const effects = EFFECTS;
const fullText = "Interactive cursor playground";
const typedText = ref("");

let typingInterval;
let index = 0;
let deleting = false;

function startTyping() {
  typingInterval = setInterval(
    () => {
      if (!deleting) {
        // typing forward
        typedText.value = fullText.slice(0, index);
        index++;

        if (index > fullText.length) {
          deleting = true;
          setTimeout(() => {}, 800);
        }
      } else {
        // deleting backward
        typedText.value = fullText.slice(0, index);
        index--;

        if (index < 0) {
          deleting = false;
          index = 0;
        }
      }
    },
    deleting ? 40 : 80
  );
}

const stats = [
  { value: "10", label: "Cursor effects" },
  { value: "9", label: "Customization controls" },
  { value: "60", label: "FPS canvas render" },
];

// Bg particle engine uses store ref
const storeRef = computed(() => store);
const bgEngine = useParticleEngine(bgCanvas, storeRef);

function onBgMove(e) {
  bgEngine.onMouseMove(e);
}

function scrollToEffects() {
  effectsSection.value?.scrollIntoView({ behavior: "smooth" });
}

function selectAndGo(id) {
  store.setEffect(id);
}

function onResize() {
  vp.value = { w: window.innerWidth, h: window.innerHeight };
}

onMounted(() => {
  startTyping();

  bgEngine.start();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  clearInterval(typingInterval);
  bgEngine.stop();
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
.bg-accent {
  background-color: rgb(var(--accent-rgb));
}

.text-accent {
  color: rgb(var(--accent-rgb));
}
</style>
