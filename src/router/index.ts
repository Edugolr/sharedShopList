import { createRouter, createWebHistory } from 'vue-router'
import ListSelectionView from '@/views/ListSelectionView.vue'
import ListView from '@/views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Lists',
      component: ListSelectionView,
    },
    {
      path: '/list/:id',
      name: 'list',
      component: ListView,
    },
  ],
})

export default router
