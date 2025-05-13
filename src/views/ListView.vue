<template>
  <div class="list-container">
    <div class="header">
      <h1>{{ listStore.activeList?.name }}</h1>
      <div style="display: flex; gap: 8px">
        <button class="icon-button" @click="isShareModalOpen = true">📤</button>
        <button class="icon-button" @click="deleteList">🗑️</button>
      </div>
    </div>
    <div class="add-bar">
      <input v-model="newItem" placeholder="Add an item" @keyup.enter="addItem" />
      <button @click="addItem">➕</button>
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

    <div v-if="isShareModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>Share List</h2>
        <input v-model="shareInput" placeholder="Enter email(s), comma-separated" />
        <div class="modal-actions">
          <button @click="addSharedEmails">Share</button>
          <button @click="isShareModalOpen = false">Cancel</button>
        </div>
      </div>
    </div>
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
const auth = getAuth()
const router = useRouter()
const deleteList = async () => {
  if (!listStore.activeListId) return
  const confirmed = confirm('Are you sure you want to delete this list?')
  if (!confirmed) return

  await deleteDoc(doc(db, 'lists', listStore.activeListId))
  listStore.activeListId = null
  router.push('/')
}

interface GroceryItem {
  id: string
  name: string
  done: boolean
}

const newItem = ref('')
const groceryList = ref<GroceryItem[]>([])
const listStore = useListStore()

const isShareModalOpen = ref(false)
const shareInput = ref('')

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

  await addDoc(collection(db, 'lists', listStore.activeListId, 'items'), {
    name,
    done: false,
  })

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

const addSharedEmails = async () => {
  const listId = listStore.activeListId
  const rawEmails = shareInput.value
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

  shareInput.value = ''
  isShareModalOpen.value = false
}

const activeItems = computed(() => groceryList.value.filter((item) => !item.done))
const doneItems = computed(() => groceryList.value.filter((item) => item.done))

onMounted(fetchItems)
watch(() => listStore.activeListId, fetchItems)
</script>
<style scoped>
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
</style>
