import { createRouter, createWebHistory } from 'vue-router'
import ListSelectionView from '@/views/ListSelectionView.vue'
import ListView from '@/views/ListView.vue'
import SharedListsView from '@/views/SharedListsView.vue'

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
    {
      path: '/shared-lists',
      name: 'shared-lists',
      component: SharedListsView,
    },
  ],
})

export default router
