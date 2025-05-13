<template>
  <div>
    <h2>Select a List</h2>
    <ul>
      <li
        v-for="list in listStore.lists"
        :key="list.id"
        :class="{ active: list.id === listStore.activeListId }"
        @click="
          () => {
            listStore.setActiveList(list.id)
            router.push({ name: 'list', params: { id: list.id } })
          }
        "
      >
        {{ list.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useListStore } from '../stores/listStore'
import { useRouter } from 'vue-router'

const listStore = useListStore()
const router = useRouter()
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 4px 8px;
  margin: 4px 0;
  border-radius: 4px;
}

li.active {
  background-color: #e0e0e0;
  font-weight: bold;
}
</style>
