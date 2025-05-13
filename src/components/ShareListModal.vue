<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Share List</h2>
      <input v-model="input" placeholder="Enter email(s), comma-separated" />
      <div class="modal-actions">
        <button @click="submit">Share</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
const emit = defineEmits(['submit', 'close'])

const submit = () => {
  emit('submit', input.value)
  input.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.modal input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 16px;
  margin-bottom: 16px;
  transition: border 0.2s ease;
}

.modal input:focus {
  border-color: #6200ee;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-actions button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background-color: #6200ee;
  color: white;
  transition: background-color 0.2s ease;
}

.modal-actions button:last-child {
  background-color: #e0e0e0;
  color: #333;
}

.modal-actions button:hover {
  opacity: 0.9;
}
</style>
