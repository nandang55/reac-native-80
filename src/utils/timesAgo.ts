import { format, parseISO } from 'date-fns';

export const timesAgo = (createdAt: string) => {
  const date = parseISO(createdAt);
  const now = new Date();
  const timeDifferenceInSeconds = (now.getTime() - date.getTime()) / 1000;

  let timeAgoMessage;
  if (timeDifferenceInSeconds < 3600) {
    timeAgoMessage = format(date, 'HH:mm');
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    timeAgoMessage = `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
  } else {
    timeAgoMessage = format(date, 'MMM dd');
  }

  return timeAgoMessage;
};
