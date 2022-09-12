import { IApiFilter } from "../Interfaces/ApiFilter";
export function getCurrentYearAndMonth(): string {
  const today = new Date();
  const month = today.getMonth();
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = today.getFullYear();
  return `${year}-${monthString}`;
}
export function getCurrentYearAndPreviousMonth(): string {
  const today = new Date();
  const month = today.getMonth() - 1;
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = today.getFullYear();
  return `${year}-${monthString}`;
}
export function getTodaysDate(): string {
  const today = new Date();
  const day = today.getDate();
  let dayString = day.toString();
  if (day < 10) {
    dayString = `0${day}`;
  }
  const month = today.getMonth();
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = today.getFullYear();
  return `${year}-${monthString}-${dayString}`;
}

export function getDateFromThirtyDaysPrior(): string {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - 30));
  const day = priorDate.getDate();
  let dayString = day.toString();
  if (day < 10) {
    dayString = `0${day}`;
  }
  const month = priorDate.getMonth();
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = priorDate.getFullYear();
  return `${year}-${monthString}-${dayString}`;
}

export function getTodaysDateOfLastYear(): string {
  const today = new Date();
  const day = today.getDate();
  let dayString = day.toString();
  if (day < 10) {
    dayString = `0${day}`;
  }
  const month = today.getMonth();
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = today.getFullYear() - 1;
  return `${year}-${monthString}-${dayString}`;
}
export function getDateFromThirtyDaysPriorOfLastYear(): string {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - 30));
  const day = priorDate.getDate();
  let dayString = day.toString();
  if (day < 10) {
    dayString = `0${day}`;
  }
  const month = priorDate.getMonth();
  let monthString = month.toString();
  if (month < 10) {
    monthString = `0${month}`;
  }
  const year = priorDate.getFullYear() - 1;
  return `${year}-${monthString}-${dayString}`;
}

export function getUniquePostingRowColor(
  row: any,
  largest: number
): React.CSSProperties {
  const percentage = (row.unique_postings / largest) * 100;
  const leftover = 100 - percentage;
  return {
    background: `linear-gradient(to right, lightblue ${percentage}%, transparent ${percentage}%, transparent ${leftover}%)`,
  };
}

export function updateFilterBodyWithJobTitle(
  filterBody: IApiFilter,
  jobTitle: string
): IApiFilter {
  return {
    ...filterBody,
    filter: { ...filterBody.filter, title_name: [jobTitle] },
  };
}
