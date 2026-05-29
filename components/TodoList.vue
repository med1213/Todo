<script setup lang="ts">
const { filteredTodos } = useTodos()
</script>

<template>
  <div>
    <TransitionGroup name="list" tag="div" class="list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </TransitionGroup>

    <Transition name="empty">
      <div v-if="filteredTodos.length === 0" class="empty">
        <span class="empty__icon">📋</span>
        <p class="empty__text">No tasks here</p>
        <p class="empty__sub">Add a task above to get started</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.list { display: flex; flex-direction: column; gap: 8px; }

.list-enter-active { transition: all 0.25s ease; }
.list-leave-active { transition: all 0.2s ease; position: absolute; width: 100%; }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }
.list-move { transition: transform 0.25s ease; }

.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}
.empty__icon { font-size: 36px; display: block; margin-bottom: 10px; opacity: 0.5; }
.empty__text { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
.empty__sub { font-size: 13px; color: var(--text-muted); }

.empty-enter-active, .empty-leave-active { transition: all 0.25s; }
.empty-enter-from, .empty-leave-to { opacity: 0; }
</style>
