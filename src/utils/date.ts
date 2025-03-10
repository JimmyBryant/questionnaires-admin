// src/utils/date.ts
type DateInput = number | string | Date;

export const formatDate = (timestamp?: DateInput): string => {
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    console.error('Invalid date input:', timestamp);
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateISO = (timestamp: DateInput): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

export type TimeAgoUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';

export const getTimeAgo = (timestamp: DateInput): string => {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  const intervals: Record<TimeAgoUnit, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
};
