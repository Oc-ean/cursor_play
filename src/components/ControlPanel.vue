<template>
  <div class="space-y-6">
    <section class="panel-section">
      <ColorPicker />
    </section>

    <div class="h-px bg-surface-600/40" />

    <section class="space-y-4">
      <h3
        class="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted"
      >
        Physics
      </h3>

      <SliderControl
        label="Particle Size"
        v-model="store.size"
        :min="1"
        :max="24"
        :step="0.5"
        unit="px"
        :decimals="1"
      />
      <SliderControl
        label="Density"
        v-model="store.density"
        :min="1"
        :max="20"
        :step="1"
      />
      <SliderControl
        label="Speed"
        v-model="store.speed"
        :min="1"
        :max="10"
        :step="0.5"
        :decimals="1"
      />
      <SliderControl
        label="Fade Duration"
        v-model="store.fadeDuration"
        :min="100"
        :max="3000"
        :step="50"
        unit="ms"
      />
      <SliderControl
        label="Opacity"
        v-model="store.opacity"
        :min="0.1"
        :max="1"
        :step="0.05"
        :decimals="2"
      />
    </section>

    <div class="h-px bg-surface-600/40" />

    <section class="space-y-3">
      <h3
        class="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted mb-3"
      >
        Modifiers
      </h3>
      <ToggleControl
        label="Gravity"
        desc="Particles fall downward"
        v-model="store.gravity"
      />
      <ToggleControl label="Glow" desc="Canvas shadow bloom" v-model="store.glow" />
      <ToggleControl
        label="Click Burst"
        desc="Burst on mouse click"
        v-model="store.clickBurst"
      />
    </section>

    <div class="h-px bg-surface-600/40" />

    <button
      class="w-full py-2 rounded-lg border border-surface-500/40 text-xs font-display font-medium text-ink-muted hover:text-ink hover:border-surface-400/60 transition-all duration-200 hover:bg-surface-600/30"
      @click="store.resetAll()"
    >
      Reset to Defaults
    </button>
  </div>
</template>

<script setup>
import { useCursorStore } from "../stores/cursor";
import SliderControl from "./SliderControl.vue";
import ToggleControl from "./ToggleControl.vue";
import ColorPicker from "./ColorPicker.vue";

const store = useCursorStore();
</script>
