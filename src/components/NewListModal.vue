<template>
  <div class="overlay" @click.self="emit('close')" v-if="show">
    <div class="modal">
      <h2>Create New List</h2>
      <input v-model="name" type="text" placeholder="List name" />
      <div class="actions">
        <button class="text" @click="emit('close')">Cancel</button>
        <button class="contained" @click="submit" :disabled="!name.trim()">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useListStore } from '@/stores/listStore'

const props = defineProps<{
  show: boolean
}>()

const listStore = useListStore()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', name: string): void
}>()

const name = ref('')

const submit = () => {
  if (name.value.trim()) {
    listStore.createList(name.value.trim())
    emit('close')
  }
}

// Reset input when modal is shown
watch(
  () => props.show,
  (val) => {
    if (val) name.value = ''
  },
)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button {
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.contained {
  background-color: #007bff;
  color: white;
}

button.contained:disabled {
  background-color: #ccc;
}

button.text {
  background: none;
  color: #333;
}
</style>
