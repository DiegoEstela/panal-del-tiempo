import { MONTH_NAMES } from '../constants/config';

export function formatMonthYear(month: number, year: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function sortEventsChronologically<T extends { year: number; month: number; createdAt: number }>(
  events: T[],
): T[] {
  return [...events].sort((a, b) => a.year - b.year || a.month - b.month || a.createdAt - b.createdAt);
}

export function groupEventsByYear<T extends { year: number }>(events: T[]): [number, T[]][] {
  const map = new Map<number, T[]>();
  for (const event of events) {
    const list = map.get(event.year) ?? [];
    list.push(event);
    map.set(event.year, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a - b);
}
