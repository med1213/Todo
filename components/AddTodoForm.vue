<script setup lang="ts">
import type { Priority } from '~/composables/useTodos'

const { addTodo } = useTodos()

const title = ref('')
const date = ref('')
const priority = ref<Priority>('med')
const error = ref('')

const todayMin = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

function submit() {
  if (!title.value.trim()) { error.value = 'Please enter a task name'; return }
  if (!date.value) { error.value = 'Please pick a due date'; return }
  error.value = ''
  addTodo(title.value.trim(), date.value, priority.value)
  title.value = ''
  date.value = ''
  priority.value = 'med'
}
</script>

<template>
  <div class="form-wrap">
    <div class="form-row">
      <input
        v-model="title"
        type="text"
        class="input input--grow"
        placeholder="New task name…"
        @keydown.enter="submit"
      />
      <input
        v-model="date"
        type="date"
        class="input input--date"
        :min="todayMin"
      />
      <select v-model="priority" class="input input--select">
        <option value="high">🔴 High</option>
        <option value="med">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>
      <button class="btn-add" @click="submit">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add
      </button>
    </div>
    <Transition name="err">
      <p v-if="error" class="form-error">{{ error }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.form-wrap { margin-bottom: 1.5rem; }
.form-row { display: flex; gap: 8px; flex-wrap: wrap; }

.input {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.15s;
  outline: none;
}
.input:focus { border-color: var(--border-focus); }
.input--grow { flex: 1; min-width: 200px; }
.input--date { width: 155px; }
.input--select { width: 135px; cursor: pointer; }

input::placeholder { color: var(--text-muted); }
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
option { background: #1c1e28; }

.btn-add {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px;
  background: var(--accent);
  color: #1a1200;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
}
.btn-add:hover { opacity: 0.9; }
.btn-add:active { transform: scale(0.97); }

.form-error { font-size: 12px; color: var(--red); margin-top: 6px; }
.err-enter-active, .err-leave-active { transition: all 0.2s; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
