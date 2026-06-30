import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingView.vue'
import PlaygroundPage from '@/views/PlaygroundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layouts/AppLayout.vue'), 
      children: [
        { path: '',          name: 'landing',    component: LandingPage },
        { path: 'playground', name: 'playground', component: PlaygroundPage },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router