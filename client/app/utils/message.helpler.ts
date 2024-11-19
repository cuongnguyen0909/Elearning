export const errorMessage = (error: any) => {
  if ('data' in error) {
    const errorData = error.data as any;
    return errorData.data.message;
  }
  return null;
};
