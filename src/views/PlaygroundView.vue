<template>
  <div class="playground min-h-screen flex flex-col pt-8">
    <main
      class="flex-1 flex flex-col px-4 md:px-6 pb-6 gap-4 max-w-[1600px] mx-auto w-full"
    >
      <section class="flex-1 min-h-[400px]">
        <LivePreview />
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div
          class="bg-surface-800/60 backdrop-blur-sm border border-surface-600/40 rounded-xl p-5 space-y-5"
        >
          <EffectGrid />

          <div
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500"
            :style="{
              background: `rgba(var(--accent-rgb), 0.06)`,
              border: `1px solid rgba(var(--accent-rgb), 0.15)`,
            }"
          >
            <span class="text-2xl">{{ store.currentEffect.emoji }}</span>
            <div>
              <div class="font-display font-semibold text-sm text-ink">
                {{ store.currentEffect.label }}
              </div>
              <div class="text-xs text-ink-muted">{{ store.currentEffect.desc }}</div>
            </div>
            <div
              class="ml-auto flex items-center gap-3 text-[10px] font-mono text-ink-faint"
            >
              <span>rgb({{ store.accentRgb }})</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="tip in tips"
              :key="tip.label"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700/40 border border-surface-600/30"
            >
              <component :is="tip.icon" class="text-1xl" />
              <div>
                <div class="text-[10px] font-display font-medium text-ink">
                  {{ tip.label }}
                </div>
                <div class="text-[9px] text-ink-faint">{{ tip.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-surface-800/60 backdrop-blur-sm border border-surface-600/40 rounded-xl p-5 overflow-y-auto custom-scroll max-h-[600px]"
        >
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display font-semibold text-sm text-ink">Customize</h2>
            <div
              class="w-2 h-2 rounded-full animate-pulse"
              :style="{
                backgroundColor: `rgb(var(--accent-rgb))`,
                boxShadow: `0 0 6px rgba(var(--accent-rgb), 0.8)`,
              }"
            />
          </div>
          <ControlPanel />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import LivePreview from "../components/LivePreview.vue";
import EffectGrid from "../components/EffectGrid.vue";
import ControlPanel from "../components/ControlPanel.vue";
import { useCursorStore } from "../stores/cursor";
import { Mouse, List } from "@lucide/vue";

const store = useCursorStore();

const tips = [
  { icon: Mouse, label: "Move mouse", desc: "in the preview" },
  { icon: Mouse, label: "Click to burst", desc: "if enabled" },
  { icon: List, label: "Tweak sliders", desc: "instant update" },
];
</script>
