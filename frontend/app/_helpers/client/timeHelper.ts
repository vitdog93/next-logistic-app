import moment from "moment";

export function formatTimeForInput(time: Date) {
  return moment(time).format("YYYY-MM-DDTHH:MM");
}

export function formatTimeDisplay(time: Date) {
  return moment(time).format("YYYY/MM/DD");
}

export function formatTimeQuery(time: Date) {
  return moment(time).format();
}