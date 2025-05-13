<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li>
        <router-link to="/"> <span class="icon">📝</span> Lists </router-link>
      </li>
      <li>
        <router-link to="/shared-lists"> <span class="icon">🔗</span> Shared Lists </router-link>
      </li>
    </ul>
    <div class="user-controls" v-if="authStore.user">
      <span class="user-name">{{ authStore.user.displayName || authStore.user.email }}</span>
      <button @click="authStore.logOut"><span class="icon">🚪</span> Sign out</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authentication'

const authStore = useAuthStore()
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  color: #333;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 16px;
  padding: 0;
  margin: 0;
}

.nav-links a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

button {
  padding: 4px 8px;
  cursor: pointer;
}
</style>
