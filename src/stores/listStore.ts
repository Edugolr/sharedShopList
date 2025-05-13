import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import { collection, query, where, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
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

    const ownedLists: typeof lists = ref([])
    const sharedLists: typeof lists = ref([])

    const updateMergedLists = () => {
      const seen = new Set<string>()
      const merged = [...ownedLists.value, ...sharedLists.value].filter((list) => {
        if (seen.has(list.id)) return false
        seen.add(list.id)
        return true
      })
      lists.value = merged
      if (!activeListId.value && merged.length) {
        activeListId.value = merged[0].id
      }
    }

    onSnapshot(ownedQuery, (snapshot) => {
      ownedLists.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ListMeta, 'id'>),
      }))
      updateMergedLists()
    })

    onSnapshot(sharedQuery, (snapshot) => {
      sharedLists.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ListMeta, 'id'>),
      }))
      updateMergedLists()
    })
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
