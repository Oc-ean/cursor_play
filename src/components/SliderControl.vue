<template>
  <div class="slider-control">
    <div class="flex items-center justify-between mb-2">
      <label
        class="text-xs font-display font-medium text-ink-muted uppercase tracking-wider"
      >
        {{ label }}
      </label>
      <span class="text-xs font-mono text-accent px-2 py-0.5 rounded bg-surface-600/60">
        {{ displayValue }}
      </span>
    </div>

    <div class="relative">
      <div
        class="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2 transition-all duration-75 pointer-events-none"
        :style="{ width: fillWidth, backgroundColor: `rgba(var(--accent-rgb), 0.4)` }"
      />
      <input
        type="range"
        class="slider-input relative z-10"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:modelValue', parseFloat($event.target.value))"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  modelValue: Number,
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  unit: { type: String, default: "" },
  decimals: { type: Number, default: 0 },
});
defineEmits(["update:modelValue"]);

const displayValue = computed(
  () => `${props.modelValue.toFixed(props.decimals)}${props.unit}`
);

const fillWidth = computed(() => {
  const pct = ((props.modelValue - props.min) / (props.max - props.min)) * 100;
  return `${pct}%`;
});
</script>

<style scoped>
.text-accent {
  color: rgb(var(--accent-rgb));
}
</style>
