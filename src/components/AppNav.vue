<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
    :style="{
      background: '#0e0e11',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }"
  >
    <RouterLink to="/" class="flex items-center gap-2.5 group">
      <div
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300"
        :style="{
          background: `rgba(var(--accent-rgb), 0.15)`,
          border: `1px solid rgba(var(--accent-rgb), 0.3)`,
          boxShadow: `0 0 10px rgba(var(--accent-rgb), 0.2)`,
        }"
      >
        <Mouse class="w-4 h-4" />
      </div>
      <span class="font-display font-semibold text-sm text-ink tracking-tight">
        Cursor<span class="text-accent">Studio</span>
      </span>
    </RouterLink>

    <div class="flex items-center gap-1">
      <RouterLink
        to="/"
        class="nav-link px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all duration-200"
        :class="
          $route.name === 'landing'
            ? 'text-ink bg-surface-600/60'
            : 'text-ink-muted hover:text-ink hover:bg-surface-700/60'
        "
      >
        Home
      </RouterLink>
      <RouterLink
        to="/playground"
        class="nav-link px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all duration-200"
        :class="
          $route.name === 'playground'
            ? 'text-ink bg-surface-600/60'
            : 'text-ink-muted hover:text-ink hover:bg-surface-700/60'
        "
      >
        Playground
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { Mouse } from "@lucide/vue";
</script>

<style scoped>
.text-accent {
  color: rgb(var(--accent-rgb));
}
</style>
