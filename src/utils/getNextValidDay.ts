import moment from "moment";

export default function getNextValidDay(): Date {
  const date = moment(new Date());

  while (date.day() < 1 || date.day() > 5) {
    date.add(1, "day");
  }

  return date.toDate();
}
