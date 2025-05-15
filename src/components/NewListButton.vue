<template>
  <button class="fab" @click="createNewList" aria-label="Create new list">+</button>
  <NewListModal :show="showModal" @close="showModal = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewListModal from '@/components/NewListModal.vue'

const showModal = ref(false)

function createNewList() {
  showModal.value = true
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 32px;
  line-height: 0;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s;
}

.fab:hover {
  background-color: #0056b3;
}
</style>
