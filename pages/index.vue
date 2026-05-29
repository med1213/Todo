<script setup lang="ts">
useHead({ title: 'ລາຍການ TODO – Lao Holiday Reminder' })

const today = new Date()
const todayStr = today.toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const activeView = ref<'list' | 'calendar'>('list')
</script>

<template>
  <main class="page">
    <!-- Header -->
    <header class="page-header">
      <div class="page-header__left">
        <div class="logo">
          <span class="logo__flag">🇱🇦</span>
          <div>
            <h1 class="logo__title">ລາຍການ TODO</h1>
            <p class="logo__sub">Lao Holiday Reminder</p>
          </div>
        </div>
      </div>
      <div class="page-header__right">
        <div class="view-toggle" role="tablist" aria-label="Switch view">
          <button
            role="tab"
            class="view-tab"
            :class="{ 'view-tab--active': activeView === 'list' }"
            :aria-selected="activeView === 'list'"
            @click="activeView = 'list'"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            List
          </button>
          <button
            role="tab"
            class="view-tab"
            :class="{ 'view-tab--active': activeView === 'calendar' }"
            :aria-selected="activeView === 'calendar'"
            @click="activeView = 'calendar'"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M1 6h12M4.5 1v3M9.5 1v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            Calendar
          </button>
        </div>
        <p class="date-pill">{{ todayStr }}</p>
      </div>
    </header>

    <!-- Holiday banner -->
    <HolidayBanner />

    <!-- Stats always visible -->
    <section>
      <StatsBar />
    </section>

    <!-- LIST VIEW -->
    <Transition name="view" mode="out-in">
      <div v-if="activeView === 'list'" key="list">
        <section>
          <p class="section-label">Upcoming Lao holidays</p>
          <HolidayChips />
        </section>
        <section>
          <p class="section-label">Add a task</p>
          <AddTodoForm />
        </section>
        <section>
          <FilterBar />
          <TodoList />
        </section>
      </div>

      <!-- CALENDAR VIEW -->
      <div v-else key="calendar">
        <section>
          <p class="section-label">Add a task</p>
          <AddTodoForm />
        </section>
        <section>
          <p class="section-label">Calendar — click a day to see details</p>
          <CalendarView />
        </section>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.page-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.logo { display: flex; align-items: center; gap: 14px; }
.logo__flag { font-size: 36px; line-height: 1; }
.logo__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-lao);
  letter-spacing: -0.01em;
  line-height: 1.1;
}
.logo__sub {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  margin-top: 2px;
  letter-spacing: 0.04em;
}

.view-toggle {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;
}
.view-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.view-tab:hover { color: var(--text-primary); }
.view-tab--active {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

.date-pill {
  font-size: 13px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 6px 14px;
  white-space: nowrap;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.view-enter-active, .view-leave-active { transition: all 0.2s ease; }
.view-enter-from { opacity: 0; transform: translateX(12px); }
.view-leave-to { opacity: 0; transform: translateX(-12px); }
</style>
