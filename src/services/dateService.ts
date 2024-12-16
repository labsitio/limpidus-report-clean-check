import { add } from 'date-fns';

export const addDurationInDate = (duration: string, date: Date): string => {
  const [hours, minutes, seconds]: string[] = duration.split(':');
  const finalDate = add(date, {
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
  });
  return finalDate.toString();
};
