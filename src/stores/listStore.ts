import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from './authentication'

export interface ListMeta {
  id: string
  name: string
  owner: string
  sharedWith?: string[]
}

export const useListStore = defineStore('listStore', () => {
  const authStore = useAuthStore()
  const lists = ref<ListMeta[]>([])
  const activeListId = ref<string | null>(null)

  const activeList = computed(() => {
    return lists.value.find((l) => l.id === activeListId.value) || null
  })

  const init = async () => {
    const email = authStore.user?.email
    if (!email) return

    const listsRef = collection(db, 'lists')

    const ownedQuery = query(listsRef, where('owner', '==', email))
    const sharedQuery = query(listsRef, where('sharedWith', 'array-contains', email))

    const [ownedSnap, sharedSnap] = await Promise.all([getDocs(ownedQuery), getDocs(sharedQuery)])

    const seen = new Set<string>()
    const all = [...ownedSnap.docs, ...sharedSnap.docs]
      .filter((doc) => {
        if (seen.has(doc.id)) return false
        seen.add(doc.id)
        return true
      })
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ListMeta, 'id'>),
      }))

    lists.value = all
    if (!activeListId.value && all.length) {
      activeListId.value = all[0].id
    }
  }

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

  return {
    lists,
    activeListId,
    activeList,
    init,
    setActiveList,
    createList,
  }
})
