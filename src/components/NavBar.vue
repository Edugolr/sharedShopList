<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li>
        <router-link to="/" class="icon-button" aria-label="Home">
          <span class="material-icons">edit</span>
        </router-link>
      </li>
      <li>
        <router-link to="/shared-lists" class="icon-button" aria-label="Shared Lists">
          <span class="material-icons">link</span>
        </router-link>
      </li>
      <div class="user-controls" v-if="authStore.user">
        <img :src="authStore.user.photoURL ?? undefined" alt="User avatar" class="avatar" />
        <button @click="authStore.logOut" class="icon-button" aria-label="Sign out">
          <span class="material-icons">logout</span>
        </button>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authentication'

const authStore = useAuthStore()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
}

.nav-links {
  display: flex;
  list-style: none;
  width: 100%;

  gap: 12px;
  padding: 0;
  margin: 0;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  font-size: 24px;
  color: inherit;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.material-icons {
  font-size: 24px;
}

.user-controls {
  display: flex;

  gap: 12px;
  justify-content: flex-end;
  width: 100%;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 12px;
  }
  .nav-links {
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>
