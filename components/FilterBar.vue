<script setup lang="ts">
import type { FilterType } from '~/composables/useTodos'
const { filter, stats } = useTodos()

const tabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
  { key: 'holiday', label: '🏮 Near holiday' },
  { key: 'overdue', label: 'Overdue' },
]
</script>

<template>
  <div class="filter-bar" role="tablist" aria-label="Filter tasks">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      role="tab"
      class="tab"
      :class="{ 'tab--active': filter === tab.key }"
      :aria-selected="filter === tab.key"
      @click="filter = tab.key"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.tab {
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.tab:hover { border-color: rgba(255,255,255,0.15); color: var(--text-primary); }
.tab--active {
  background: var(--accent-dim);
  border-color: var(--accent-border);
  color: var(--accent);
  font-weight: 500;
}
</style>
