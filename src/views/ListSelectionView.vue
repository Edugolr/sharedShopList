<template>
  <div class="list-selection">
    <h2>Select a List</h2>
    <ul class="list-container">
      <li
        v-for="list in listStore.lists"
        :key="list.id"
        :class="{ active: list.id === listStore.activeListId }"
        class="list-card"
      >
        <div
          class="card-content"
          @click="
            () => {
              listStore.setActiveList(list.id)
              router.push({ name: 'list', params: { id: list.id } })
            }
          "
        >
          {{ list.name }}
        </div>
        <div class="card-actions">
          <button @click.stop="() => shareList(list)" aria-label="Share list" class="icon-button">
            <span class="material-icons">share</span>
          </button>
          <button @click.stop="() => deleteList(list)" aria-label="Delete list" class="icon-button">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
  <ShareListModal v-if="showModal" @close="showModal = false" @submit="addSharedEmails" />
  <DeleteListModal
    v-if="isDeleteModalOpen"
    @confirm="confirmDeleteList"
    @close="isDeleteModalOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ShareListModal from '@/components/ShareListModal.vue'
import DeleteListModal from '@/components/DeleteListModal.vue'
import { useListStore } from '../stores/listStore'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const listStore = useListStore()
const router = useRouter()

const showModal = ref(false)
const selectedListId = ref<string | null>(null)

const isDeleteModalOpen = ref(false)
const listToDelete = ref<{ id: string; name: string } | null>(null)

const shareList = (list: { id: string }) => {
  selectedListId.value = list.id
  showModal.value = true
}

const addSharedEmails = async (rawEmails: string) => {
  if (!selectedListId.value || !rawEmails) return

  const emails = rawEmails
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e)

  const listRef = doc(db, 'lists', selectedListId.value)
  await updateDoc(listRef, {
    sharedWith: arrayUnion(...emails),
  })

  showModal.value = false
}

const deleteList = (list: { id: string; name: string }) => {
  listToDelete.value = list
  isDeleteModalOpen.value = true
}

const confirmDeleteList = async () => {
  if (!listToDelete.value) return
  await deleteDoc(doc(db, 'lists', listToDelete.value.id))
  if (listStore.activeListId === listToDelete.value.id) {
    listStore.activeListId = null
  }
  isDeleteModalOpen.value = false
  listToDelete.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.list-selection {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  padding: 0 8px;
}

.list-container {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.list-card.active {
  background-color: #f0f0f0;
  font-weight: 500;
}

.card-content {
  flex: 1;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.card-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.material-icons {
  font-size: 24px;
  color: #333;
}

@media (max-width: 480px) {
  .list-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .card-content {
    width: 100%;
    margin-bottom: 8px;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
