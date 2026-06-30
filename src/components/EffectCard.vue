<template>
  <button
    class="effect-card group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 select-none"
    :class="[
      isActive
        ? 'border-accent bg-accent/10 shadow-[0_0_16px_rgba(var(--accent-rgb),0.2)]'
        : 'border-surface-500/40 bg-surface-700/40 hover:border-surface-400/60 hover:bg-surface-600/40',
    ]"
    @click="$emit('select', effect.id)"
  >
    <span
      class="text-2xl transition-transform duration-200"
      :class="isActive ? 'scale-110' : 'group-hover:scale-105'"
      >{{ effect.emoji }}</span
    >

    <span
      class="text-xs font-display font-medium transition-colors duration-200"
      :class="isActive ? 'text-accent' : 'text-ink-muted group-hover:text-ink'"
      >{{ effect.label }}</span
    >

    <div
      v-if="isActive"
      class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"
    />
  </button>
</template>

<script setup>
defineProps({
  effect: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
});
defineEmits(["select"]);
</script>

<style scoped>
.border-accent {
  border-color: rgba(var(--accent-rgb), 0.5);
}
.bg-accent\/10 {
  background-color: rgba(var(--accent-rgb), 0.1);
}
.bg-accent {
  background-color: rgb(var(--accent-rgb));
}
.text-accent {
  color: rgb(var(--accent-rgb));
}
.shadow-\[0_0_16px_rgba\(var\(--accent-rgb\)\,0\.2\)\] {
  box-shadow: 0 0 16px rgba(var(--accent-rgb), 0.2);
}
</style>
