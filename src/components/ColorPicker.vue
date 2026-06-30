<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <label
        class="text-xs font-display font-medium uppercase tracking-wider text-ink-muted"
      >
        Color Override
      </label>
      <button
        v-if="store.colorOverride"
        class="text-[10px] font-mono text-ink-faint hover:text-accent transition-colors px-2 py-0.5 rounded border border-surface-500/50 hover:border-accent/40"
        @click="store.resetColor()"
      >
        reset
      </button>
    </div>

    <div class="grid grid-cols-8 gap-1.5 mb-3">
      <button
        v-for="swatch in swatches"
        :key="swatch.rgb"
        class="swatch w-7 h-7 rounded-lg border-2 transition-all duration-150 hover:scale-110"
        :style="{
          backgroundColor: `rgb(${swatch.rgb})`,
          borderColor: isActive(swatch.rgb) ? 'white' : 'transparent',
          boxShadow: isActive(swatch.rgb) ? `0 0 8px rgb(${swatch.rgb})` : 'none',
        }"
        @click="pickColor(swatch.rgb)"
      />
    </div>

    <div class="flex items-center gap-2">
      <div class="relative">
        <input
          type="color"
          class="sr-only"
          ref="colorInputRef"
          :value="hexValue"
          @input="onNativeColorInput"
        />
        <button
          class="w-8 h-8 rounded-lg border border-surface-500/50 overflow-hidden hover:scale-105 transition-transform"
          :style="{ backgroundColor: `rgb(${store.accentRgb})` }"
          @click="colorInputRef?.click()"
        />
      </div>
      <div class="flex-1 relative">
        <input
          type="text"
          :value="hexValue"
          placeholder="#rrggbb"
          class="w-full bg-surface-600/60 border border-surface-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-accent/60 transition-colors"
          @change="onHexChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCursorStore } from "../stores/cursor";

const store = useCursorStore();
const colorInputRef = ref(null);

const swatches = [
  { rgb: "168,85,247" }, // purple
  { rgb: "251,146,60" }, // orange
  { rgb: "250,204,21" }, // yellow
  { rgb: "74,222,128" }, // green
  { rgb: "34,211,238" }, // cyan
  { rgb: "99,102,241" }, // indigo
  { rgb: "244,114,182" }, // pink
  { rgb: "248,113,113" }, // red
  { rgb: "255,255,255" }, // white
  { rgb: "147,197,253" }, // ice blue
  { rgb: "249,168,212" }, // sakura
  { rgb: "167,243,208" }, // mint
  { rgb: "253,186,116" }, // peach
  { rgb: "196,181,253" }, // lavender
  { rgb: "252,211,77" }, // amber
  { rgb: "94,234,212" }, // teal
];

function isActive(rgb) {
  return store.accentRgb.replace(/\s/g, "") === rgb.replace(/\s/g, "");
}

function pickColor(rgb) {
  store.setColor(rgb);
}

const hexValue = computed(() => {
  const [r, g, b] = store.accentRgb.split(",").map((n) => parseInt(n.trim()));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
});

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `${r},${g},${b}`;
}

function onHexChange(e) {
  const rgb = hexToRgb(e.target.value);
  if (rgb) store.setColor(rgb);
}

function onNativeColorInput(e) {
  const rgb = hexToRgb(e.target.value);
  if (rgb) store.setColor(rgb);
}
</script>

<style scoped>
.focus\:border-accent\/60:focus {
  border-color: rgba(var(--accent-rgb), 0.6);
}
</style>
