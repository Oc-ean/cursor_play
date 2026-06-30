import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const EFFECTS = [
  { id: 'particles', label: 'Particles', emoji: '✨', accent: '168, 85, 247', desc: 'Sparkling dust trail' },
  { id: 'fire',      label: 'Fire',      emoji: '🔥', accent: '251, 146, 60',  desc: 'Blazing flame trail' },
  { id: 'stars',     label: 'Stars',     emoji: '⭐', accent: '250, 204, 21',  desc: 'Twinkling star field' },
  { id: 'hearts',    label: 'Hearts',    emoji: '💖', accent: '244, 114, 182', desc: 'Floating love hearts' },
  { id: 'emoji',     label: 'Emoji',     emoji: '😂', accent: '74, 222, 128',  desc: 'Scattered emojis' },
  { id: 'rainbow',   label: 'Rainbow',   emoji: '🌈', accent: '99, 102, 241',  desc: 'Full spectrum wave' },
  { id: 'neon',      label: 'Neon',      emoji: '⚡', accent: '34, 211, 238',  desc: 'Electric glow lines' },
  { id: 'confetti',  label: 'Confetti',  emoji: '🎉', accent: '251, 191, 36',  desc: 'Festive paper burst' },
  { id: 'snow',      label: 'Snow',      emoji: '❄',  accent: '147, 197, 253', desc: 'Gentle snowflakes' },
  { id: 'sakura',    label: 'Sakura',    emoji: '🌸', accent: '249, 168, 212', desc: 'Cherry blossom petals' },
]

export const useCursorStore = defineStore('cursor', () => {
  const effectId = ref('particles')
  const currentEffect = computed(() => EFFECTS.find(e => e.id === effectId.value) || EFFECTS[0])

  const colorOverride = ref<string | null>(null)
  const accentRgb = computed(() => colorOverride.value || currentEffect.value!.accent)

  const size = ref(6)        
  const density = ref(8)       
  const speed = ref(5)         
  const opacity = ref(0.9)     
  const fadeDuration = ref(800) 

  const gravity = ref(false)
  const glow = ref(true)
  const clickBurst = ref(true)

  function setEffect(id: string) {
    effectId.value = id
    colorOverride.value = null 
  }

  function setColor(rgbString: string) {
    colorOverride.value = rgbString
  }

  function resetColor() {
    colorOverride.value = null
  }

  function resetAll() {
    effectId.value = 'particles'
    colorOverride.value = null
    size.value = 6
    density.value = 8
    speed.value = 5
    opacity.value = 0.9
    fadeDuration.value = 800
    gravity.value = false
    glow.value = true
    clickBurst.value = true
  }

  return {
    effectId, currentEffect, colorOverride, accentRgb,
    size, density, speed, opacity, fadeDuration,
    gravity, glow, clickBurst,
    setEffect, setColor, resetColor, resetAll,
  }
})
