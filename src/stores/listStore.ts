import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, type DocumentData, addDoc } from 'firebase/firestore'
import {
  onSnapshot as firestoreOnSnapshot,
  collection as firestoreCollection,
} from 'firebase/firestore'
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
  const previousListIds = ref<Set<string>>(new Set())

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
      sharedWith: [],
    }

    lists.value.push(newList)
    activeListId.value = newList.id

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('List created', {
        body: `Created list: ${name}`,
      })
    }
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

      // Detect new lists for notifications
      const currentIds = new Set(lists.value.map((l) => l.id))
      lists.value.forEach((list) => {
        if (!previousListIds.value.has(list.id)) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New list added', {
              body: `List: ${list.name}`,
            })
          }
        }
      })
      previousListIds.value = currentIds

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

    // --- Begin: Listen for new items in the currently active list and notify user ---
    const itemIdSets = new Map<string, Set<string>>()

    watch(activeListId, (id) => {
      if (!id) return

      const itemsRef = firestoreCollection(db, 'lists', id, 'items')
      firestoreOnSnapshot(itemsRef, (snapshot) => {
        const seen = itemIdSets.get(id) ?? new Set<string>()
        const newItems = snapshot.docs.filter((doc) => !seen.has(doc.id))

        if (newItems.length && Notification.permission === 'granted') {
          newItems.forEach((doc) => {
            const name = doc.data().name
            if (typeof name === 'string') {
              new Notification('New item added', {
                body: name,
              })
            }
          })
        }

        const updated = new Set(snapshot.docs.map((d) => d.id))
        itemIdSets.set(id, updated)
      })
    })
    // --- End: Listen for new items in the currently active list and notify user ---
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
