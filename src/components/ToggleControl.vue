<template>
  <button
    class="toggle-control flex items-center justify-between w-full group"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="flex flex-col items-start">
      <span class="text-xs font-display font-medium uppercase tracking-wider text-ink-muted group-hover:text-ink transition-colors">
        {{ label }}
      </span>
      <span v-if="desc" class="text-[10px] text-ink-faint mt-0.5">{{ desc }}</span>
    </div>

    <!-- Toggle pill -->
    <div
      class="relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200"
      :class="modelValue ? 'bg-accent/20' : 'bg-surface-500'"
      :style="modelValue ? { boxShadow: `0 0 10px rgba(var(--accent-rgb), 0.3)` } : {}"
    >
      <div
        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all duration-200 shadow-sm"
        :class="modelValue ? 'translate-x-5 bg-accent' : 'translate-x-0 bg-ink-faint'"
      />
    </div>
  </button>
</template>

<script setup>
defineProps({
  label: String,
  desc: String,
  modelValue: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.bg-accent { background-color: rgb(var(--accent-rgb)); }
.bg-accent\/20 { background-color: rgba(var(--accent-rgb), 0.2); }
</style>
