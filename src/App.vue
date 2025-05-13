<template>
  <div v-if="!authStore.user" class="signin-screen">
    <button class="signin-button" @click="authStore.signIn">
      <span class="material-icons">login</span>
      Sign in with Google
    </button>
  </div>
  <template v-else>
    <Navbar />
    <main>
      <RouterView />
      <NewList />
    </main>
  </template>
</template>

<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import NewList from '@/components/NewList.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authentication'
import { useListStore } from './stores/listStore'
import { watch } from 'vue'

const authStore = useAuthStore()
authStore.init()

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      console.log('User signed in:', user)
      const listStore = useListStore()
      listStore.init()
    } else {
      console.log('User signed out')
    }
  },
  { immediate: true },
)
</script>
<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
/* app.css or main.css */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #222;
  background-color: #fff;
}

main {
  padding: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  height: 100%;
}

img {
  max-width: 100%;
  display: block;
}

.signin-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 16px;
}

.signin-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background-color: #6200ee;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;
}

.signin-button:hover {
  background-color: #4b00cb;
}
</style>
