<template>
  <div>
    <h3 class="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted mb-3">
      Effects
    </h3>
    <div class="grid grid-cols-5 gap-2">
      <EffectCard
        v-for="effect in effects"
        :key="effect.id"
        :effect="effect"
        :isActive="store.effectId === effect.id"
        @select="store.setEffect"
      />
    </div>
  </div>
</template>

<script setup>
import { useCursorStore } from '../stores/cursor'
import { EFFECTS } from '../stores/cursor'
import EffectCard from './EffectCard.vue'

const store = useCursorStore()
const effects = EFFECTS
</script>
