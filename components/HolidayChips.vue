<script setup lang="ts">
import dayjs from "dayjs";

const { upcomingHolidays, daysUntil } = useLaoHolidays();

const typeColor: Record<string, string> = {
  national: "chip--blue",
  cultural: "chip--amber",
  religious: "chip--green",
  international: "chip--purple",
};

function formatDate(s: string) {
  return dayjs(s).format("D MMM");
}
</script>

<template>
  <div class="chips-wrap">
    <div
      v-for="h in upcomingHolidays"
      :key="h.date + h.name"
      class="chip"
      :class="[typeColor[h.type], daysUntil(h.date) <= 30 ? 'chip--soon' : '']"
    >
      <span class="chip__dot"></span>
      <div class="chip__body">
        <span class="chip__name">{{ h.name }}</span>
        <span class="chip__date">
          {{ formatDate(h.date) }}
          <span v-if="daysUntil(h.date) === 0" class="chip__tag">Today</span>
          <span v-else-if="daysUntil(h.date) <= 7" class="chip__tag"
            >{{ daysUntil(h.date) }}d</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chips-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.chip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s;
  min-width: 0;
}
.chip--soon {
  border-color: var(--accent-border);
}
.chip__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--text-muted);
}
.chip--blue .chip__dot {
  background: var(--blue);
}
.chip--amber .chip__dot {
  background: var(--accent);
}
.chip--green .chip__dot {
  background: var(--green);
}
.chip--purple .chip__dot {
  background: #d17bdb;
}
.chip__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.chip__name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}
.chip__date {
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}
.chip__tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--accent-dim);
  color: var(--accent);
}
</style>
