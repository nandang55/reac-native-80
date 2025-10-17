export const isDatePassed = (date: string, durationInDays: number) => {
  let inputDate = new Date();

  if (date) {
    inputDate = new Date(date);
  }

  const comparisonDate = new Date();
  comparisonDate.setDate(comparisonDate.getDate() - durationInDays);

  return inputDate < comparisonDate;
};
