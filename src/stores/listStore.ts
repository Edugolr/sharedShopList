import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, type DocumentData, addDoc } from 'firebase/firestore'
import { useAuthStore } from './authentication'
import { serverTimestamp } from 'firebase/firestore'

export interface ListMeta {
  id: string
  name: string
  owner: string
  sharedWith?: string[]
  permissions?: {
    read?: string[]
    write?: string[]
  }
}

export const useListStore = defineStore('listStore', () => {
  const lists = ref<ListMeta[]>([])
  const activeListId = ref<string | null>(null)

  const authStore = useAuthStore()

  const ownedLists = computed(() =>
    lists.value.filter((list) => list.owner === authStore.user?.email),
  )

  const sharedLists = computed(() =>
    lists.value.filter((list) => list.owner !== authStore.user?.email),
  )

  const activeList = computed(() => lists.value.find((l) => l.id === activeListId.value) || null)

  const setActiveList = (id: string) => {
    activeListId.value = id
  }

  const createList = async (name: string) => {
    const email = authStore.user?.email

    if (!email) {
      console.error('User not authenticated')
      return
    }

    const docRef = await addDoc(collection(db, 'lists'), {
      name,
      owner: email,
      sharedWith: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const newList: ListMeta = {
      id: docRef.id,
      name,
      owner: email,
    }

    lists.value.push(newList)
    activeListId.value = newList.id
  }

  const init = async () => {
    const email = authStore.user?.email
    if (!email) return

    const listsRef = collection(db, 'lists')
    const ownedQuery = query(listsRef, where('owner', '==', email))
    const sharedQuery = query(listsRef, where('sharedWith', 'array-contains', email))

    const owned = ref<ListMeta[]>([])
    const shared = ref<ListMeta[]>([])

    const updateMergedLists = () => {
      const seen = new Set<string>()
      lists.value = [...owned.value, ...shared.value].filter((list) => {
        if (seen.has(list.id)) return false
        seen.add(list.id)
        return true
      })

      if (!activeListId.value && lists.value.length > 0) {
        activeListId.value = lists.value[0].id
      }
    }

    onSnapshot(ownedQuery, (snapshot) => {
      owned.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ListMeta, 'id'>),
      }))
      updateMergedLists()
    })

    onSnapshot(sharedQuery, (snapshot) => {
      shared.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ListMeta, 'id'>),
      }))
      updateMergedLists()
    })
  }

  return {
    lists,
    ownedLists,
    sharedLists,
    activeListId,
    activeList,
    init,
    setActiveList,
    createList,
  }
})
