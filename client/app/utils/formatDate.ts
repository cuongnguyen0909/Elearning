export const formatDate = (date: string) => {
  const createdAt = new Date(date || '');
  const formattedDate = !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('en-US') : 'Invalid Date';
  return formattedDate;
};
