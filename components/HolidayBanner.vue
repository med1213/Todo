<script setup lang="ts">
const { todayHoliday, soonHoliday, daysUntil } = useLaoHolidays()

const visible = computed(() => todayHoliday.value || soonHoliday.value)
const isToday = computed(() => !!todayHoliday.value)
const holiday = computed(() => todayHoliday.value || soonHoliday.value)
</script>

<template>
  <Transition name="banner">
    <div v-if="visible && holiday" class="banner" :class="{ 'banner--today': isToday }">
      <div class="banner__icon">
        <span v-if="isToday">🎉</span>
        <span v-else>🔔</span>
      </div>
      <div class="banner__body">
        <p class="banner__title">
          <template v-if="isToday">Today is {{ holiday.name }}!</template>
          <template v-else>
            {{ holiday.name }} in {{ daysUntil(holiday.date) }} day{{ daysUntil(holiday.date) !== 1 ? 's' : '' }}
          </template>
        </p>
        <p class="banner__sub">{{ holiday.nameLao }}</p>
      </div>
      <div class="banner__date">{{ holiday.date }}</div>
    </div>
  </Transition>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(232,185,107,0.08) 0%, rgba(232,185,107,0.04) 100%);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
}
.banner--today {
  background: linear-gradient(135deg, rgba(232,185,107,0.15) 0%, rgba(232,185,107,0.06) 100%);
  border-color: rgba(232,185,107,0.55);
}
.banner__icon { font-size: 22px; flex-shrink: 0; }
.banner__body { flex: 1 }
.banner__title { font-size: 14px; font-weight: 600; color: var(--accent); }
.banner__sub { font-size: 13px; color: var(--text-secondary); font-family: var(--font-lao); margin-top: 1px; }
.banner__date { font-size: 12px; color: var(--text-muted); font-variant-numeric: tabular-nums; }

.banner-enter-active, .banner-leave-active { transition: all 0.3s ease; }
.banner-enter-from, .banner-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
