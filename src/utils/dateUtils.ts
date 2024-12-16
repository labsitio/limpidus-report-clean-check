export function dateUtils() {
  const getFormatDay = (date: Date) => {
    return `0${date.getDate()}`.slice(-2);
  };

  const getFormatMonth = (date: Date) => {
    return `0${date.getMonth() + 1}`.slice(-2);
  };

  const formatHourAndMinute = (hourOrMinute: number) => {
    if (hourOrMinute < 10) {
      return `0${hourOrMinute}`;
    }

    return hourOrMinute;
  };

  const getExtenseHour = (initialDate: Date) => {
    return `${formatHourAndMinute(initialDate.getHours())}:${formatHourAndMinute(initialDate.getMinutes())}`;
  };
  return { getFormatDay, getFormatMonth, getExtenseHour };
}
