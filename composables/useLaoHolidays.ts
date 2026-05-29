import dayjs from "dayjs";
import { computed } from "vue";

export interface LaoHoliday {
  name: string;
  nameLao: string;
  date: string;
  type: "national" | "cultural" | "religious" | "international";
}

export const LAO_HOLIDAYS: LaoHoliday[] = [
  {
    name: "International New Year",
    nameLao: "ປີໃໝ່ສາກົນ",
    date: "2026-01-01",
    type: "international",
  },
  {
    name: "Pathet Lao Day",
    nameLao: "ວັນສ້າງຕັ້ງລາວ",
    date: "2026-01-06",
    type: "national",
  },
  {
    name: "Army Day",
    nameLao: "ວັນກອງທັບປະຊາຊົນ",
    date: "2026-01-20",
    type: "national",
  },
  {
    name: "Makha Bucha Day",
    nameLao: "ວັນມາຄະບູຊາ",
    date: "2026-02-17",
    type: "religious",
  },
  {
    name: "International Women's Day",
    nameLao: "ວັນແມ່ຍິງສາກົນ",
    date: "2026-03-08",
    type: "international",
  },
  {
    name: "People's Party Day",
    nameLao: "ວັນສ້າງຕັ້ງພັກ",
    date: "2026-03-22",
    type: "national",
  },
  {
    name: "Lao New Year – Pi Mai Day 1",
    nameLao: "ບຸນປີໃໝ່ລາວ (ວັນທີ 1)",
    date: "2026-04-13",
    type: "cultural",
  },
  {
    name: "Lao New Year – Pi Mai Day 2",
    nameLao: "ບຸນປີໃໝ່ລາວ (ວັນທີ 2)",
    date: "2026-04-14",
    type: "cultural",
  },
  {
    name: "Lao New Year – Pi Mai Day 3",
    nameLao: "ບຸນປີໃໝ່ລາວ (ວັນທີ 3)",
    date: "2026-04-15",
    type: "cultural",
  },
  {
    name: "International Labour Day",
    nameLao: "ວັນກຳມະກອນສາກົນ",
    date: "2026-05-01",
    type: "international",
  },
  {
    name: "Visakha Bucha",
    nameLao: "ວັນວິສາຂະບູຊາ",
    date: "2026-05-06",
    type: "religious",
  },
  {
    name: "International Children's Day",
    nameLao: "ວັນເດັກສາກົນ",
    date: "2026-06-01",
    type: "international",
  },
  {
    name: "Women's Union Day",
    nameLao: "ວັນສ້າງຕັ້ງສະຫະພັນແມ່ຍິງ",
    date: "2026-07-20",
    type: "national",
  },
  {
    name: "End of Buddhist Lent",
    nameLao: "ບຸນອອກວັນສາ",
    date: "2026-10-07",
    type: "religious",
  },
  {
    name: "Boat Racing Festival",
    nameLao: "ບຸນໄຫຼເຮືອ",
    date: "2026-10-08",
    type: "cultural",
  },
  {
    name: "That Luang Festival",
    nameLao: "ງານບຸນທາດຫຼວງ",
    date: "2026-11-05",
    type: "cultural",
  },
  {
    name: "Lao National Day",
    nameLao: "ວັນຊາດລາວ",
    date: "2026-12-02",
    type: "national",
  },
  {
    name: "International New Year",
    nameLao: "ປີໃໝ່ສາກົນ",
    date: "2027-01-01",
    type: "international",
  },
];

export function useLaoHolidays() {
  function daysUntil(dateStr: string): number {
    const today = dayjs().startOf("day");
    const target = dayjs(dateStr).startOf("day");
    return target.diff(today, "day");
  }

  function nearestHoliday(taskDate: string, windowDays = 3): LaoHoliday | null {
    const taskDay = dayjs(taskDate).startOf("day");
    for (const h of LAO_HOLIDAYS) {
      const holidayDay = dayjs(h.date).startOf("day");
      const diff = Math.abs(taskDay.diff(holidayDay, "day", true));
      if (diff <= windowDays) return h;
    }
    return null;
  }

  const upcomingHolidays = computed(() =>
    LAO_HOLIDAYS.filter((h) => daysUntil(h.date) >= 0).slice(0, 7),
  );

  const todayHoliday = computed(
    () => LAO_HOLIDAYS.find((h) => daysUntil(h.date) === 0) ?? null,
  );

  const soonHoliday = computed(
    () =>
      LAO_HOLIDAYS.find((h) => {
        const d = daysUntil(h.date);
        return d > 0 && d <= 7;
      }) ?? null,
  );

  return {
    upcomingHolidays,
    todayHoliday,
    soonHoliday,
    daysUntil,
    nearestHoliday,
  };
}
