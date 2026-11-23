export function parseDateValue(value?: string | Date | null) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  const isoDateMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
  }

  const slashDateMatch = trimmedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashDateMatch) {
    const [, first, second, year] = slashDateMatch;
    const firstNumber = Number(first);
    const secondNumber = Number(second);
    const useDayFirst = firstNumber > 12 || secondNumber <= 12;
    const day = useDayFirst ? firstNumber : secondNumber;
    const month = useDayFirst ? secondNumber : firstNumber;
    return new Date(Number(year), month - 1, day, 12, 0, 0, 0);
  }

  const timestamp = Date.parse(trimmedValue);
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp);
}

export function formatDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
