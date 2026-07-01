# CursorPlay

An interactive cursor trail playground — ten canvas-rendered particle effects you can customize in real time and trail behind your mouse (or finger, on mobile).

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State-ffd859?logo=pinia&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **10 cursor effects** — particles, fire, stars, hearts, emoji, rainbow, neon, confetti, snow, and sakura petals
- **Live customization** — size, density, speed, opacity, fade duration, gravity, and glow, all updating in real time
- **Click bursts** — optional particle bursts on click (or tap, on mobile)
- **Touch support** — works on mobile and tablet, not just desktop
- **Custom cursor** — a smooth, lerped dot + ring replaces the native pointer
- **Performance-minded rendering** — object pooling and offscreen-canvas caching keep effects smooth even at high density

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Pinia](https://pinia.vuejs.org/) for effect/settings state
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Vue](https://lucide.dev/) for icons
- Canvas 2D for all particle rendering — no external animation libraries

## 🚀 Getting Started

```bash
# clone the repo
git clone https://github.com/your-username/cursor_play.git
cd cursor_play

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Build for production

```bash
npm run build
```

## 🎨 How It Works

Each effect is a small spawn function that pushes particles into a pooled array on mouse/touch movement. A single `requestAnimationFrame` loop updates physics (velocity, gravity, fade) and draws every particle each frame, recycling dead particles back into the pool to avoid garbage collection pauses.

Expensive draw calls (emoji glyphs, snowflake strokes) are pre-rendered once to an offscreen canvas and reused via `drawImage`, keeping frame times low even with hundreds of particles on screen.

## 🤝 Contributing

Contributions are welcome. Feel free to open an issue or submit a PR for new effects, performance improvements, or bug fixes.

## 📄 License

MIT
