<script setup lang="ts">
const { stats } = useTodos()
const { filter } = useTodos()

const items = computed(() => [
  { key: 'total', label: 'Total', value: stats.value.total, color: '' },
  { key: 'done', label: 'Done', value: stats.value.done, color: 'green' },
  { key: 'holiday', label: 'Near holiday', value: stats.value.holiday, color: 'amber' },
  { key: 'overdue', label: 'Overdue', value: stats.value.overdue, color: 'red' },
])

function filterMap(key: string) {
  const map: Record<string, string> = { total: 'all', done: 'done', holiday: 'holiday', overdue: 'overdue' }
  return map[key] as any
}
</script>

<template>
  <div class="stats">
    <button
      v-for="item in items"
      :key="item.key"
      class="stat"
      :class="[`stat--${item.color}`, filter === filterMap(item.key) ? 'stat--active' : '']"
      @click="filter = filterMap(item.key)"
    >
      <span class="stat__val">{{ item.value }}</span>
      <span class="stat__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 1.5rem;
}
.stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.12); }
.stat--active { border-color: var(--accent-border); background: var(--accent-dim); }
.stat__val { font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1; }
.stat__label { font-size: 12px; color: var(--text-secondary); }

.stat--green .stat__val { color: var(--green); }
.stat--amber .stat__val { color: var(--accent); }
.stat--red .stat__val { color: var(--red); }
</style>
