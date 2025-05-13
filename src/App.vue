<template>
  <SignIn v-if="!authStore.user" />
  <Navbar />
  <main>
    <RouterView />
    <NewList />
  </main>
</template>

<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import SignIn from '@/components/SignIn.vue'
import NewList from '@/components/NewList.vue'
import { RouterLink, RouterView } from 'vue-router'
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
</style>
