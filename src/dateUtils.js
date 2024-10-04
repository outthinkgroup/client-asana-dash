export function getMonthStart(date) {
	const year = date.getFullYear();
	const month = date.getMonth();
	const monthStartDate = new Date();
	monthStartDate.setFullYear(year, month, 1);
	monthStartDate.setHours(0, 0, 0, 0);
	return monthStartDate;
}

export const dayInMili = 1000 * 60 * 60 * 24;
export const monthInMili = (date) => getMonthEnd(date).getDate() * dayInMili;

export function getMonthEnd(date) {
	const monthStart = getMonthStart(date);
	const monthIndex = monthStart.getMonth();
	const nextMonth = new Date();
	nextMonth.setFullYear(monthStart.getFullYear(), monthIndex + 1, 1);
	nextMonth.setHours(0, 0, 0, 0);
	const endOfMonth = new Date(nextMonth.getTime() - dayInMili);

	return endOfMonth;
}

export function getMonth(dateString, isLong = true) {
	const dateArr = parseDateString(dateString);
	const date = new Date(...dateArr); // 2009-11-10
	const month = date.toLocaleString("default", {
		month: isLong ? "long" : "short",
	});
	return month;
}

export function getDay(dateString, isLong = true) {
	const dateArr = parseDateString(dateString);
	const date = new Date(...dateArr);
	const day = date.getDate();
	const dayOfWeek = date.toLocaleString("default", {
		weekday: isLong ? "long" : "short",
	});
	return { day, dayOfWeek };
}

export function parseDateString(dateString) {
	const [year, day, month] = dateString.split("-");
	return [Number(year), Number(day) - 1, Number(month)];
}
