import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Setup listener once on app init
  const init = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  const signIn = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logOut = async () => {
    await signOut(auth)
  }

  return {
    user,
    loading,
    init,
    signIn,
    logOut,
    isLoggedIn: computed(() => !!user.value),
  }
})
