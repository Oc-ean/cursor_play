
import { ref, watch, onUnmounted } from 'vue'


function createParticle() {
  return {
    x: 0, y: 0, vx: 0, vy: 0,
    life: 0, maxLife: 0,
    size: 0, color: '', alpha: 1,
    rotation: 0, rotationSpeed: 0,
    type: 'circle',
    emoji: '',
    hue: 0,
  }
}

const POOL_SIZE = 2000
const pool = Array.from({ length: POOL_SIZE }, createParticle)
let poolHead = 0

function acquire() {
  const p = pool[poolHead % POOL_SIZE]
  poolHead++
  return p
}

const EMOJIS = ['😂', '🥹', '🤩', '😎', '🥳', '😍', '🤯', '💀', '🔥', '⭐']

function rand(min, max) { return Math.random() * (max - min) + min }
function randInt(min, max) { return Math.floor(rand(min, max)) }
function parseRgb(rgb) {
  const [r, g, b] = rgb.split(',').map(Number)
  return { r, g, b }
}

function drawStar(ctx, x, y, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const b = a + (2 * Math.PI) / 5
    if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
    else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
    ctx.lineTo(x + (r * 0.4) * Math.cos(b), y + (r * 0.4) * Math.sin(b))
  }
  ctx.closePath()
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath()
  ctx.moveTo(x, y + size / 4)
  ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y + size / 4)
  ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.3, x, y + size * 1.6)
  ctx.bezierCurveTo(x, y + size * 1.3, x + size, y + size, x + size, y + size / 4)
  ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y + size / 4)
  ctx.closePath()
}

function drawSnowflake(ctx, x, y, r) {
  const arms = 6
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
    ctx.stroke()
    const bx = x + Math.cos(angle) * r * 0.5
    const by = y + Math.sin(angle) * r * 0.5
    for (const ba of [angle + 1, angle - 1]) {
      ctx.beginPath()
      ctx.moveTo(bx, by)
      ctx.lineTo(bx + Math.cos(ba) * r * 0.3, by + Math.sin(ba) * r * 0.3)
      ctx.stroke()
    }
  }
}

function drawPetal(ctx, x, y, size) {
  ctx.beginPath()
  ctx.ellipse(x, y, size * 0.5, size, 0, 0, Math.PI * 2)
  ctx.closePath()
}



const spawnFns = {
  particles(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.6)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-1.5, 1.5) * (s.speed / 5)
      p.vy = rand(-2, 0.5) * (s.speed / 5)
      p.life = s.fadeDuration
      p.maxLife = s.fadeDuration
      p.size = rand(s.size * 0.5, s.size * 1.2)
      p.color = `${r},${g},${b}`
      p.type = 'circle'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  fire(particles, x, y, s) {
    const count = Math.floor(s.density * 0.7)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x + rand(-8, 8)
      p.y = y
      p.vx = rand(-0.8, 0.8) * (s.speed / 5)
      p.vy = rand(-3, -1) * (s.speed / 4)
      p.life = s.fadeDuration * 0.6
      p.maxLife = p.life
      p.size = rand(s.size * 0.8, s.size * 1.8)
      p.hue = rand(0, 40)       // orange → yellow
      p.type = 'fire'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  stars(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.5)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-2, 2) * (s.speed / 5)
      p.vy = rand(-2, 1) * (s.speed / 5)
      p.life = s.fadeDuration * 1.2
      p.maxLife = p.life
      p.size = rand(s.size * 0.6, s.size * 1.5)
      p.color = `${r},${g},${b}`
      p.rotation = rand(0, Math.PI * 2)
      p.rotationSpeed = rand(-0.1, 0.1)
      p.type = 'star'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  hearts(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.3)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-1, 1) * (s.speed / 5)
      p.vy = rand(-2.5, -0.5) * (s.speed / 4)
      p.life = s.fadeDuration * 1.4
      p.maxLife = p.life
      p.size = rand(s.size * 0.4, s.size * 0.9)
      p.color = `${r},${g},${b}`
      p.rotation = rand(-0.4, 0.4)
      p.type = 'heart'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  emoji(particles, x, y, s) {
    const count = Math.floor(s.density * 0.25)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-1.5, 1.5) * (s.speed / 5)
      p.vy = rand(-3, 0) * (s.speed / 4)
      p.life = s.fadeDuration * 1.2
      p.maxLife = p.life
      p.size = rand(s.size * 1.2, s.size * 2)
      p.type = 'emoji'
      p.emoji = EMOJIS[randInt(0, EMOJIS.length)]
      p.rotation = rand(-0.3, 0.3)
      p.rotationSpeed = rand(-0.02, 0.02)
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  rainbow(particles, x, y, s) {
    const count = Math.floor(s.density * 0.6)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-2, 2) * (s.speed / 5)
      p.vy = rand(-2, 1) * (s.speed / 5)
      p.life = s.fadeDuration
      p.maxLife = p.life
      p.size = rand(s.size * 0.6, s.size * 1.3)
      p.hue = rand(0, 360)
      p.type = 'rainbow'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  neon(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.5)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-1.5, 1.5) * (s.speed / 5)
      p.vy = rand(-1.5, 1.5) * (s.speed / 5)
      p.life = s.fadeDuration * 0.7
      p.maxLife = p.life
      p.size = rand(s.size * 0.3, s.size * 0.7)
      p.color = `${r},${g},${b}`
      p.type = 'neon'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  confetti(particles, x, y, s) {
    const count = Math.floor(s.density * 0.5)
    const colors = ['255,87,87', '255,214,87', '87,255,160', '87,160,255', '214,87,255', '255,87,214']
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-3, 3) * (s.speed / 4)
      p.vy = rand(-4, 1) * (s.speed / 4)
      p.life = s.fadeDuration * 1.2
      p.maxLife = p.life
      p.size = rand(s.size * 0.5, s.size * 1.2)
      p.color = colors[randInt(0, colors.length)]
      p.rotation = rand(0, Math.PI * 2)
      p.rotationSpeed = rand(-0.15, 0.15)
      p.type = 'rect'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  snow(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.4)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x + rand(-15, 15)
      p.y = y
      p.vx = rand(-0.5, 0.5) * (s.speed / 5)
      p.vy = rand(-1, 0.5) * (s.speed / 5)
      p.life = s.fadeDuration * 1.5
      p.maxLife = p.life
      p.size = rand(s.size * 0.5, s.size * 1.3)
      p.color = `${r},${g},${b}`
      p.rotation = rand(0, Math.PI * 2)
      p.rotationSpeed = rand(-0.05, 0.05)
      p.type = 'flake'
      p.alpha = s.opacity
      particles.push(p)
    }
  },

  sakura(particles, x, y, s) {
    const { r, g, b } = parseRgb(s.accentRgb)
    const count = Math.floor(s.density * 0.35)
    for (let i = 0; i < count; i++) {
      const p = acquire()
      p.x = x; p.y = y
      p.vx = rand(-1.5, 1.5) * (s.speed / 5)
      p.vy = rand(-2, 0.5) * (s.speed / 4)
      p.life = s.fadeDuration * 1.6
      p.maxLife = p.life
      p.size = rand(s.size * 0.7, s.size * 1.5)
      p.color = `${r},${g},${b}`
      p.rotation = rand(0, Math.PI * 2)
      p.rotationSpeed = rand(-0.08, 0.08)
      p.type = 'petal'
      p.alpha = s.opacity
      particles.push(p)
    }
  },
}

function updateParticle(p, dt, settings) {
  p.life -= dt

  if (settings.gravity) p.vy += 0.08

  if (p.type === 'fire') {
    p.vy -= 0.03
    p.vx += rand(-0.1, 0.1)
    p.hue = (p.life / p.maxLife) * 50
  }

  if (p.type === 'rainbow') {
    p.hue = (p.hue + 2) % 360
  }

  p.x += p.vx
  p.y += p.vy
  p.vx *= 0.97
  p.vy *= 0.97
  if (p.rotationSpeed) p.rotation += p.rotationSpeed
}

function drawParticle(ctx, p, settings) {
  const ratio = Math.max(0, p.life / p.maxLife)
  const alpha = ratio * p.alpha
  if (alpha <= 0) return

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(p.x, p.y)
  if (p.rotation) ctx.rotate(p.rotation)

  if (settings.glow) {
    const glowColor = p.color
      ? `rgba(${p.color}, ${alpha})`
      : p.type === 'fire' ? `rgba(255,${p.hue * 5},0, ${alpha})`
        : p.type === 'rainbow' ? `hsla(${p.hue},100%,60%, ${alpha})`
          : `rgba(255,255,255,${alpha})`

    ctx.shadowBlur = p.size * 2
    ctx.shadowColor = glowColor
  }

  switch (p.type) {
    case 'circle':
    case 'neon': {
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
     if (p.type === 'neon') {
        ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }

    case 'fire': {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
      gradient.addColorStop(0, `hsla(${p.hue + 50}, 100%, 90%, ${alpha})`)
      gradient.addColorStop(0.4, `hsla(${p.hue + 20}, 100%, 60%, ${alpha})`)
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fill()
      break
    }

    case 'star': {
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      drawStar(ctx, 0, 0, p.size / 2)
      ctx.fill()
      break
    }

    case 'heart': {
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      ctx.scale(p.size / 10, p.size / 10)
      drawHeart(ctx, 0, 0, p.size / 2)
      ctx.fill()
      break
    }

    case 'emoji': {
      const cached = getEmojiCanvas(p.emoji, p.size)
      ctx.drawImage(cached, -p.size, -p.size)
      break
    }

    case 'rainbow': {
      ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha})`
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
      break
    }

    case 'rect': {
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      break
    }

    case 'flake': {
  const s = p.size + 4
  const cached = getSnowCanvas(p.size)
  ctx.globalAlpha = alpha
  ctx.drawImage(cached, -s / 2, -s / 2)
      break
    }

    case 'petal': {
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`
      drawPetal(ctx, 0, 0, p.size)
      ctx.fill()
      break
    }
  }

  ctx.restore()
}

const emojiCache = new Map()

function getEmojiCanvas(emoji, size) {
  const key = `${emoji}-${Math.round(size)}`
  if (emojiCache.has(key)) return emojiCache.get(key)

  const offscreen = document.createElement('canvas')
  offscreen.width = size * 2
  offscreen.height = size * 2
  const ctx = offscreen.getContext('2d')
  ctx.font = `${size}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size, size)
  emojiCache.set(key, offscreen)
  return offscreen
}


const snowCache = new Map()

function getSnowCanvas(size) {
  const key = Math.round(size)
  if (snowCache.has(key)) return snowCache.get(key)
  
  const offscreen = document.createElement('canvas')
  const r = size / 2
  offscreen.width = size + 4
  offscreen.height = size + 4
  const ctx = offscreen.getContext('2d')
  ctx.strokeStyle = 'white'
  ctx.lineWidth = Math.max(1, size / 6)
  drawSnowflake(ctx, (size + 4) / 2, (size + 4) / 2, r)
  snowCache.set(key, offscreen)
  return offscreen
}

function spawnBurst(particles, x, y, effectId, settings) {
  const s = { ...settings, density: settings.density * 3, speed: settings.speed * 1.5 }
  const fn = spawnFns[effectId]
  if (fn) {
    for (let i = 0; i < 5; i++) fn(particles, x, y, s)
  }
}

export function useParticleEngine(canvasRef, storeRef) {
  let particles = []
  let lastTime = 0
  let animHandle = null
  let lastX = 0, lastY = 0

  function getSettings() {
    const s = storeRef.value
    return {
      accentRgb: s.accentRgb,
      size: s.size,
      density: s.density,
      speed: s.speed,
      opacity: s.opacity,
      fadeDuration: s.fadeDuration,
      gravity: s.gravity,
      glow: s.glow,
    }
  }

  function spawnAt(x, y) {
    const s = storeRef.value
    const fn = spawnFns[s.effectId]
    if (fn) fn(particles, x, y, getSettings())
  }

  function burstAt(x, y) {
    const s = storeRef.value
    if (!s.clickBurst) return
    spawnBurst(particles, x, y, s.effectId, getSettings())
  }

  function onMouseMove(e) {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = x - lastX, dy = y - lastY
    if (dx * dx + dy * dy < 4) return
    lastX = x; lastY = y
    spawnAt(x, y)
  }

  function onMouseDown(e) {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    burstAt(e.clientX - rect.left, e.clientY - rect.top)
  }

  function onTouchMove(e) {
    e.preventDefault()
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const dx = x - lastX, dy = y - lastY
    if (dx * dx + dy * dy < 4) return
    lastX = x; lastY = y
    spawnAt(x, y)
  }

  function onTouchStart(e) {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    burstAt(touch.clientX - rect.left, touch.clientY - rect.top)
  }

  function loop(ts) {
    const canvas = canvasRef.value
    if (!canvas) { animHandle = requestAnimationFrame(loop); return }
    const ctx = canvas.getContext('2d')
    const dt = lastTime ? ts - lastTime : 16
    lastTime = ts

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const settings = getSettings()
    const alive = []
    for (const p of particles) {
      updateParticle(p, dt, settings)
      if (p.life > 0) {
        drawParticle(ctx, p, settings)
        alive.push(p)
      }
    }
    particles = alive

    animHandle = requestAnimationFrame(loop)
  }

  function start() {
    if (animHandle) return
    animHandle = requestAnimationFrame(loop)
  }

  function stop() {
    if (animHandle) cancelAnimationFrame(animHandle)
    animHandle = null
  }

  function clear() {
    particles = []
  }

  function getCount() {
    return particles.length
  }

  return { onMouseMove, onMouseDown, onTouchMove, onTouchStart, start, stop, clear, getCount }
}