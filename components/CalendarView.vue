<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { LAO_HOLIDAYS } from "~/composables/useLaoHolidays";
import { useTodos } from "../composables/useTodos";

const { todos } = useTodos();

const today = dayjs().startOf("day");

const viewYear = ref(today.year());
const viewMonth = ref(today.month());

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthLabel = computed(
  () => `${MONTHS[viewMonth.value]} ${viewYear.value}`,
);

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else viewMonth.value--;
}
function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else viewMonth.value++;
}
function goToday() {
  viewYear.value = today.year();
  viewMonth.value = today.month();
}

// Build calendar grid — 6 rows x 7 cols
const calDays = computed(() => {
  const y = viewYear.value;
  const m = viewMonth.value;
  const firstDay = dayjs(`${y}-${String(m + 1).padStart(2, "0")}-01`).day();
  const daysInMonth = dayjs(
    `${y}-${String(m + 1).padStart(2, "0")}`,
  ).daysInMonth();
  const daysInPrev = dayjs(`${y}-${String(m).padStart(2, "0")}`).daysInMonth();
  const cells: Array<{
    date: dayjs.Dayjs;
    dateStr: string;
    day: number;
    inMonth: boolean;
    isToday: boolean;
    holidays: typeof LAO_HOLIDAYS;
    todos: typeof todos.value;
    hasDone: boolean;
    hasActive: boolean;
    hasHoliday: boolean;
  }> = [];

  // Prev month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = dayjs(
      `${y}-${String(m).padStart(2, "0")}-${String(daysInPrev - i).padStart(2, "0")}`,
    );
    cells.push(buildCell(d, false));
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = dayjs(
      `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
    cells.push(buildCell(date, true));
  }
  // Next month leading days
  let next = 1;
  while (cells.length < 42) {
    const date = dayjs(
      `${y}-${String(m + 2).padStart(2, "0")}-${String(next).padStart(2, "0")}`,
    );
    cells.push(buildCell(date, false));
    next++;
  }
  return cells;
});

function toStr(d: dayjs.Dayjs) {
  return d.format("YYYY-MM-DD");
}

function buildCell(d: dayjs.Dayjs, inMonth: boolean) {
  const dateStr = toStr(d);
  const dayTodos = todos.value.filter((t: any) => t.date === dateStr);
  const dayHols = LAO_HOLIDAYS.filter((h: any) => h.date === dateStr);
  return {
    date: d,
    dateStr,
    day: d.date(),
    inMonth,
    isToday: d.isSame(today, "day"),
    holidays: dayHols,
    todos: dayTodos,
    hasDone: dayTodos.some((t: any) => t.done),
    hasActive: dayTodos.some((t: any) => !t.done),
    hasHoliday: dayHols.length > 0,
  };
}

// Selected day detail
const selected = ref<string | null>(null);
const selectedCell = computed(
  () => calDays.value.find((c) => c.dateStr === selected.value) ?? null,
);

function select(dateStr: string) {
  selected.value = selected.value === dateStr ? null : dateStr;
}

// Holiday type colors
const typeColor: Record<string, string> = {
  national: "#5ca8e8",
  cultural: "#e8b96b",
  religious: "#5cb87a",
  international: "#d17bdb",
};
</script>

<template>
  <div class="cal-wrap">
    <!-- Nav -->
    <div class="cal-nav">
      <button class="nav-btn" aria-label="Previous month" @click="prevMonth">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div class="cal-title">
        <span class="cal-month">{{ monthLabel }}</span>
        <button class="today-btn" @click="goToday">Today</button>
      </div>
      <button class="nav-btn" aria-label="Next month" @click="nextMonth">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Day headers -->
    <div class="cal-grid cal-header">
      <div v-for="d in DAYS" :key="d" class="cal-head-cell">{{ d }}</div>
    </div>

    <!-- Day cells -->
    <div class="cal-grid cal-body">
      <button
        v-for="cell in calDays"
        :key="cell.dateStr"
        class="cal-cell"
        :class="{
          'cal-cell--out': !cell.inMonth,
          'cal-cell--today': cell.isToday,
          'cal-cell--holiday': cell.hasHoliday && cell.inMonth,
          'cal-cell--selected': selected === cell.dateStr,
        }"
        :aria-label="`${cell.dateStr}${cell.hasHoliday ? ' – holiday' : ''}`"
        :aria-pressed="selected === cell.dateStr"
        @click="select(cell.dateStr)"
      >
        <span class="cal-day-num">{{ cell.day }}</span>

        <!-- Holiday name (short) -->
        <span
          v-for="h in cell.holidays.slice(0, 1)"
          :key="h.date + h.name"
          class="cal-hol-label"
          :style="{ color: typeColor[h.type] }"
          >{{ h.name }}</span
        >
        <span
          v-if="cell.holidays.length > 1"
          class="cal-hol-label"
          style="color: var(--text-muted)"
          >+{{ cell.holidays.length - 1 }} more</span
        >

        <!-- Todo dots -->
        <div v-if="cell.todos.length" class="cal-dots">
          <span v-if="cell.hasActive" class="dot dot--active"></span>
          <span v-if="cell.hasDone" class="dot dot--done"></span>
        </div>
      </button>
    </div>

    <!-- Detail panel -->
    <Transition name="detail">
      <div v-if="selectedCell" class="detail-panel">
        <div class="detail-header">
          <span class="detail-date">
            {{ selectedCell.date.format("dddd, D MMMM YYYY") }}
          </span>
          <button
            class="detail-close"
            aria-label="Close"
            @click="selected = null"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <!-- Holidays on this day -->
        <div v-if="selectedCell.holidays.length" class="detail-section">
          <p class="detail-section-title">🏮 Lao Holidays</p>
          <div
            v-for="h in selectedCell.holidays"
            :key="h.name"
            class="detail-hol-row"
          >
            <span
              class="detail-hol-dot"
              :style="{ background: typeColor[h.type] }"
            ></span>
            <div>
              <p class="detail-hol-name">{{ h.name }}</p>
              <p class="detail-hol-lao">{{ h.nameLao }}</p>
            </div>
            <span
              class="detail-hol-type"
              :style="{ color: typeColor[h.type] }"
              >{{ h.type }}</span
            >
          </div>
        </div>

        <!-- Todos on this day -->
        <div v-if="selectedCell.todos.length" class="detail-section">
          <p class="detail-section-title">📋 Tasks</p>
          <div
            v-for="t in selectedCell.todos"
            :key="t.id"
            class="detail-todo-row"
            :class="{ 'detail-todo--done': t.done }"
          >
            <span
              class="detail-todo-priority"
              :class="`priority--${t.priority}`"
            ></span>
            <span class="detail-todo-title">{{ t.title }}</span>
            <span class="detail-todo-status">{{
              t.done ? "Done" : "Active"
            }}</span>
          </div>
        </div>

        <p
          v-if="!selectedCell.holidays.length && !selectedCell.todos.length"
          class="detail-empty"
        >
          No events on this day
        </p>
      </div>
    </Transition>

    <!-- Legend -->
    <div class="cal-legend">
      <span class="legend-item"
        ><span class="legend-dot" style="background: #5ca8e8"></span>
        National</span
      >
      <span class="legend-item"
        ><span class="legend-dot" style="background: #e8b96b"></span>
        Cultural</span
      >
      <span class="legend-item"
        ><span class="legend-dot" style="background: #5cb87a"></span>
        Religious</span
      >
      <span class="legend-item"
        ><span class="legend-dot" style="background: #d17bdb"></span>
        International</span
      >
      <span class="legend-item"
        ><span class="dot dot--active" style="display: inline-block"></span>
        Active task</span
      >
      <span class="legend-item"
        ><span class="dot dot--done" style="display: inline-block"></span> Done
        task</span
      >
    </div>
  </div>
</template>

<style scoped>
.cal-wrap {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

/* Nav */
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.cal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cal-month {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 160px;
  text-align: center;
}
.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.nav-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.15);
}
.today-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid var(--accent-border);
  background: var(--accent-dim);
  color: var(--accent);
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.15s;
}
.today-btn:hover {
  opacity: 0.8;
}

/* Grid */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.cal-header {
  margin-bottom: 6px;
}
.cal-head-cell {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 4px 0;
}

/* Cells */
.cal-cell {
  position: relative;
  min-height: 72px;
  padding: 7px 8px 6px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition:
    background 0.12s,
    border-color 0.12s;
  color: var(--text-primary);
}
.cal-cell:hover {
  background: var(--bg-card-hover);
  border-color: var(--border);
}
.cal-cell--out {
  opacity: 0.28;
  pointer-events: none;
}
.cal-cell--today {
  background: var(--accent-dim);
  border-color: var(--accent-border) !important;
}
.cal-cell--today .cal-day-num {
  color: var(--accent);
  font-weight: 700;
}
.cal-cell--holiday {
  background: rgba(232, 185, 107, 0.04);
  border-color: rgba(232, 185, 107, 0.18);
}
.cal-cell--selected {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.22) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.cal-day-num {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1;
}
.cal-hol-label {
  font-size: 9.5px;
  font-weight: 500;
  line-height: 1.25;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.cal-dots {
  display: flex;
  gap: 3px;
  margin-top: auto;
  padding-top: 3px;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.dot--active {
  background: var(--blue);
}
.dot--done {
  background: var(--green);
}

/* Detail panel */
.detail-panel {
  margin-top: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
}
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.detail-date {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.detail-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.detail-close:hover {
  color: var(--text-primary);
}

.detail-section {
  margin-bottom: 12px;
}
.detail-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.detail-hol-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  margin-bottom: 5px;
}
.detail-hol-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.detail-hol-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.detail-hol-lao {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-lao, sans-serif);
  margin-top: 1px;
}
.detail-hol-type {
  font-size: 11px;
  margin-left: auto;
  text-transform: capitalize;
  font-weight: 500;
}

.detail-todo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  margin-bottom: 5px;
}
.detail-todo--done {
  opacity: 0.5;
}
.detail-todo--done .detail-todo-title {
  text-decoration: line-through;
}
.detail-todo-priority {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.priority--high {
  background: var(--red);
}
.priority--med {
  background: var(--accent);
}
.priority--low {
  background: var(--green);
}
.detail-todo-title {
  font-size: 13px;
  color: var(--text-primary);
  flex: 1;
}
.detail-todo-status {
  font-size: 11px;
  color: var(--text-muted);
}
.detail-empty {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  padding: 8px 0;
}

/* Legend */
.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}
.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

/* Transition */
.detail-enter-active,
.detail-leave-active {
  transition: all 0.2s ease;
}
.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
