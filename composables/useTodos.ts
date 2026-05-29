import dayjs from "dayjs";
import { computed } from "vue";
import { useLaoHolidays } from "./useLaoHolidays";

export type Priority = "high" | "med" | "low";
export type FilterType = "all" | "active" | "done" | "holiday" | "overdue";

export interface Todo {
  id: number;
  title: string;
  date: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
}

const STORAGE_KEY = "lao_todos_v2";

const DEFAULT_TODOS: Todo[] = [
  {
    id: 1,
    title: "Prepare Pi Mai celebration plan",
    date: "2026-04-10",
    priority: "high",
    done: false,
    createdAt: Date.now(),
  },
  {
    id: 2,
    title: "Submit Q2 report before Labour Day",
    date: "2026-04-29",
    priority: "med",
    done: false,
    createdAt: Date.now(),
  },
  {
    id: 3,
    title: "Book That Luang Festival tickets",
    date: "2026-11-01",
    priority: "med",
    done: false,
    createdAt: Date.now(),
  },
  {
    id: 4,
    title: "Send National Day greetings email",
    date: "2026-11-30",
    priority: "low",
    done: false,
    createdAt: Date.now(),
  },
  {
    id: 5,
    title: "Plan Boat Racing Festival outing",
    date: "2026-10-06",
    priority: "low",
    done: false,
    createdAt: Date.now(),
  },
];

export function useTodos() {
  const { nearestHoliday } = useLaoHolidays();

  const todos = useState<Todo[]>("todos", () => {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Todo[];
      } catch {}
    }
    return DEFAULT_TODOS;
  });

  let nextId = computed(() => Math.max(...todos.value.map((t) => t.id), 0) + 1);

  function save() {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
      } catch {}
    }
  }

  function addTodo(title: string, date: string, priority: Priority) {
    todos.value.unshift({
      id: nextId.value,
      title,
      date,
      priority,
      done: false,
      createdAt: Date.now(),
    });
    save();
  }

  function toggleTodo(id: number) {
    const t = todos.value.find((t) => t.id === id);
    if (t) {
      t.done = !t.done;
      save();
    }
  }

  function deleteTodo(id: number) {
    todos.value = todos.value.filter((t) => t.id !== id);
    save();
  }

  function isOverdue(t: Todo): boolean {
    const today = dayjs().startOf("day");
    const taskDate = dayjs(t.date).startOf("day");
    return !t.done && taskDate.isBefore(today);
  }

  const filter = useState<FilterType>("filter", () => "all");

  const filteredTodos = computed(() => {
    let list = [...todos.value];
    if (filter.value === "active") list = list.filter((t) => !t.done);
    else if (filter.value === "done") list = list.filter((t) => t.done);
    else if (filter.value === "holiday")
      list = list.filter((t) => !!nearestHoliday(t.date));
    else if (filter.value === "overdue")
      list = list.filter((t) => isOverdue(t));
    return list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return dayjs(a.date).diff(dayjs(b.date), "day");
    });
  });

  const stats = computed(() => ({
    total: todos.value.length,
    done: todos.value.filter((t) => t.done).length,
    holiday: todos.value.filter((t) => !t.done && !!nearestHoliday(t.date))
      .length,
    overdue: todos.value.filter((t) => isOverdue(t)).length,
  }));

  return {
    todos,
    filteredTodos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    isOverdue,
  };
}
