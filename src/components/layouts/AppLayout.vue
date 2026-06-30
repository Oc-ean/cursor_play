<template>
  <div class="min-h-screen bg-surface-900">
    <AppNavbar />
    <main class="pt-16">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from "@/components/AppNav.vue";
</script>
