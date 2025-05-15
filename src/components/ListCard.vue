<template>
  <div class="list-item" @click="$emit('click')">
    <div class="text">
      <div class="title">{{ title }}</div>
      <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
      <div class="meta" v-if="sharedBy">Shared by {{ sharedBy }}</div>
      <div class="meta" v-if="sharedWith?.length">Shared with: {{ sharedWith.join(', ') }}</div>
    </div>
    <div class="actions" v-if="showActions">
      <button class="icon-button" @click.stop="$emit('share')">
        <span class="material-icons">share</span>
      </button>
      <button class="icon-button" @click.stop="$emit('delete')">
        <span class="material-icons">delete</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  sharedBy?: string
  sharedWith?: string[]
}>()

const { sharedWith, sharedBy } = props

defineEmits<{
  (e: 'click'): void
  (e: 'share'): void
  (e: 'delete'): void
}>()

const showActions = computed(() => sharedWith !== undefined && sharedBy === undefined)
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
  cursor: pointer;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.text {
  flex: 1;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.meta {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.material-icons {
  font-size: 20px;
  color: #555;
}
</style>
