<template>
  <div class="page">
    <h1>Shared Lists</h1>
    <ul v-if="sharedLists.length">
      <li v-for="list in sharedLists" :key="list.id" @click="selectList(list.id)">
        <span>{{ list.name }}</span>
        <small>Shared by {{ list.owner }}</small>
      </li>
    </ul>
    <p v-else class="empty">You don’t have any shared lists yet.</p>
  </div>
</template>

<script setup lang="ts">
import { useListStore } from '@/stores/listStore'
import { useAuthStore } from '@/stores/authentication'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const listStore = useListStore()
const authStore = useAuthStore()
const router = useRouter()

const sharedLists = computed(() =>
  listStore.lists.filter((list) => list.owner !== authStore.user?.email),
)

const selectList = (id: string) => {
  listStore.setActiveList(id)
  router.push(`/list/${id}`)
}
</script>

<style scoped>
.page {
  padding: 16px;
}

h1 {
  font-size: 20px;
  margin-bottom: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

li span {
  font-size: 16px;
  font-weight: 500;
}

li small {
  font-size: 12px;
  color: #666;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 40px;
}
</style>
