<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Delete List</h2>
      <p>Are you sure you want to delete this list?</p>
      <div class="modal-actions">
        <button @click="$emit('confirm')">Delete</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'close'])
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
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.modal p {
  margin-bottom: 16px;
  font-size: 15px;
  color: #444;
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
  background-color: #b00020;
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
