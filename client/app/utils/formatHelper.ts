import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
dayjs.locale('vi');
dayjs.extend(relativeTime);

export const formatDate = (date: string) => {
  const createdAt = new Date(date || '');
  const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('vi-VN') : 'Invalid Date';
  return formattedDate;
};

export const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow();
};

export const formatTime = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
