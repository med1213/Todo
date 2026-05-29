<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

const props = defineProps<{ todo: Todo }>()
const { toggleTodo, deleteTodo, isOverdue } = useTodos()
const { nearestHoliday, daysUntil } = useLaoHolidays()

const overdue = computed(() => isOverdue(props.todo))
const holiday = computed(() => nearestHoliday(props.todo.date))
const daysLeft = computed(() => daysUntil(props.todo.date))

const priorityLabel: Record<string, string> = { high: 'High', med: 'Med', low: 'Low' }

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="item" :class="{ 'item--done': todo.done, 'item--overdue': overdue && !todo.done }">
    <button
      class="check"
      :class="{ 'check--done': todo.done }"
      :aria-label="todo.done ? 'Mark incomplete' : 'Mark complete'"
      @click="toggleTodo(todo.id)"
    >
      <svg v-if="todo.done" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="item__body">
      <p class="item__title">{{ todo.title }}</p>
      <div class="item__meta">
        <!-- Date badge -->
        <span v-if="overdue" class="badge badge--red">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M5 1v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="1.2"/></svg>
          Overdue {{ Math.abs(daysLeft) }}d
        </span>
        <span v-else-if="daysLeft === 0" class="badge badge--red">Due today</span>
        <span v-else-if="daysLeft <= 3" class="badge badge--red">{{ daysLeft }}d left</span>
        <span v-else class="badge badge--muted">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><rect x="1" y="2" width="8" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M3 1v2M7 1v2M1 5h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          {{ fmtDate(todo.date) }}
        </span>

        <!-- Priority badge -->
        <span class="badge" :class="`badge--priority-${todo.priority}`">{{ priorityLabel[todo.priority] }}</span>

        <!-- Holiday alert badge -->
        <span v-if="holiday" class="badge badge--holiday">
          🏮 Near {{ holiday.name }}
        </span>
      </div>
    </div>

    <button class="btn-delete" aria-label="Delete task" @click="deleteTodo(todo.id)">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 012 0v1M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s, background 0.15s, opacity 0.2s;
  animation: slideIn 0.2s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.item:hover { background: var(--bg-card-hover); }
.item--done { opacity: 0.45; }
.item--overdue { border-color: var(--red-border); }

.check {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex; align-items: center; justify-content: center;
  color: var(--green);
  transition: border-color 0.15s, background 0.15s;
}
.check:hover { border-color: var(--green); }
.check--done {
  background: var(--green-dim);
  border-color: var(--green-border);
}

.item__body { flex: 1; min-width: 0; }
.item__title {
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 400;
}
.item--done .item__title { text-decoration: line-through; }

.item__meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 500;
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid transparent;
}
.badge--muted { background: rgba(255,255,255,0.04); color: var(--text-secondary); border-color: var(--border); }
.badge--red { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }
.badge--holiday { background: var(--accent-dim); color: var(--accent); border-color: var(--accent-border); }
.badge--priority-high { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }
.badge--priority-med { background: var(--accent-dim); color: var(--accent); border-color: var(--accent-border); }
.badge--priority-low { background: var(--green-dim); color: var(--green); border-color: var(--green-border); }

.btn-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.btn-delete:hover { color: var(--red); background: var(--red-dim); }
</style>
