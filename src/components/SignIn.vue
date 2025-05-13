<template>
  <div>
    <button v-if="!auth.isLoggedIn" @click="auth.signIn" :disabled="auth.loading">
      {{ auth.loading ? 'Loading...' : 'Sign in with Google' }}
    </button>
    <div v-else>
      <p>Signed in as {{ auth.user?.displayName }}</p>
      <button @click="auth.logOut">Log out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authentication'

const auth = useAuthStore()
</script>
