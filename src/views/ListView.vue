<template>
  <div class="list-container">
    <div class="header">
      <div class="header-row">
        <h1 class="list-title">{{ listStore.activeList?.name }}</h1>
        <div class="header-actions">
          <button class="icon-button" @click="openShareModal" aria-label="Share list">
            <span class="material-icons">share</span>
          </button>
          <button class="icon-button" @click="openDeleteModal" aria-label="Delete list">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
    </div>
    <div class="add-bar">
      <input v-model="newItem" placeholder="Add an item" @keyup.enter="addItem" />
      <button @click="addItem">+</button>
    </div>
    <TransitionGroup name="fade" tag="ul" class="todo-list">
      <li v-for="item in activeItems" :key="item.id">
        <label>
          <input type="checkbox" :checked="item.done" @change="toggleItem(item)" />
          {{ item.name }}
        </label>
        <button @click="deleteItem(item.id)">✖</button>
      </li>
    </TransitionGroup>

    <details class="done-section">
      <summary>Done ({{ doneItems.length }})</summary>
      <TransitionGroup name="fade" tag="ul" class="todo-list done">
        <li v-for="item in doneItems" :key="item.id">
          <label>
            <input type="checkbox" :checked="item.done" @change="toggleItem(item)" />
            {{ item.name }}
          </label>
          <button @click="deleteItem(item.id)">✖</button>
        </li>
      </TransitionGroup>
    </details>

    <ShareListModal
      v-if="isShareModalOpen"
      :sharedWith="listStore.activeList?.sharedWith || []"
      @close="isShareModalOpen = false"
      @submit="addSharedEmails"
    />
    <DeleteListModal
      v-if="isDeleteModalOpen"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDeleteList"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { db } from '../firebase'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { useListStore } from '../stores/listStore'
import { getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'
import ShareListModal from '@/components/ShareListModal.vue'
import DeleteListModal from '@/components/DeleteListModal.vue'

const auth = getAuth()
const router = useRouter()
const listStore = useListStore()

const isShareModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const openShareModal = () => {
  isShareModalOpen.value = true
}

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const confirmDeleteList = async () => {
  if (!listStore.activeListId) return
  await deleteDoc(doc(db, 'lists', listStore.activeListId))
  listStore.activeListId = null
  isDeleteModalOpen.value = false
  router.push('/')
}

interface GroceryItem {
  id: string
  name: string
  done: boolean
}

const newItem = ref('')
const groceryList = ref<GroceryItem[]>([])

const fetchItems = () => {
  if (!listStore.activeListId) return

  const itemsRef = collection(db, 'lists', listStore.activeListId, 'items')
  const q = query(itemsRef, orderBy('name'))

  onSnapshot(q, (snapshot) => {
    groceryList.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<GroceryItem, 'id'>),
    }))
  })
}

const addItem = async () => {
  const name = newItem.value.trim()
  if (!name || !listStore.activeListId) return

  const existing = groceryList.value.find((item) => item.name.toLowerCase() === name.toLowerCase())

  if (existing) {
    if (existing.done) {
      await updateDoc(doc(db, 'lists', listStore.activeListId, 'items', existing.id), {
        done: false,
      })
    }
    // If exists and not done, do nothing (don't add duplicate)
  } else {
    await addDoc(collection(db, 'lists', listStore.activeListId, 'items'), {
      name,
      done: false,
    })
  }

  newItem.value = ''
}

const deleteItem = async (id: string) => {
  if (!listStore.activeListId) return
  await deleteDoc(doc(db, 'lists', listStore.activeListId, 'items', id))
}

const toggleItem = async (item: GroceryItem) => {
  if (!listStore.activeListId) return
  await updateDoc(doc(db, 'lists', listStore.activeListId, 'items', item.id), {
    done: !item.done,
  })
}

const addSharedEmails = async (rawEmails: string) => {
  const listId = listStore.activeListId
  const userEmail = auth.currentUser?.email
  if (!listId || !rawEmails || !userEmail) return

  const emails = rawEmails
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e)

  const listRef = doc(db, 'lists', listId)
  await updateDoc(listRef, {
    sharedWith: arrayUnion(...emails),
  })

  isShareModalOpen.value = false
}

const activeItems = computed(() => groceryList.value.filter((item) => !item.done))
const doneItems = computed(() => groceryList.value.filter((item) => item.done))

onMounted(fetchItems)
watch(() => listStore.activeListId, fetchItems)
</script>
<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 70px;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin: 8px 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.todo-list.done li {
  background-color: #f0f0f0;
  opacity: 0.6;
  text-decoration: line-through;
}

label {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

button {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
}

.add-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background-color: #ffffff;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
}

.add-bar input {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 16px;
}

.add-bar button {
  background-color: #6200ee;
  color: #fff;
  border-radius: 24px;
  padding: 0 16px;
  font-size: 20px;
  border: none;
  cursor: pointer;
}

.done-section summary {
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  color: #444;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.header {
  padding: 16px 16px 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.list-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.material-icons {
  font-size: 24px;
  color: #333;
}
</style>
