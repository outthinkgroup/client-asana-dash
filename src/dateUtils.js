export function getMonthStart(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStartDate = new Date();
  monthStartDate.setFullYear(year, month, 1);
  monthStartDate.setHours(0, 0, 0, 0);
  return monthStartDate;
}

export const dayInMili = 1000 * 60 * 60 * 24;

export function getMonthEnd(date) {
  const monthStart = getMonthStart(date);
  const monthIndex = monthStart.getMonth();
  const nextMonth = new Date();
  nextMonth.setFullYear(monthStart.getFullYear(), monthIndex + 1, 1);
  nextMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(nextMonth.getTime() - dayInMili);

  return endOfMonth;
}
