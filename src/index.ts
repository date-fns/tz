export interface Interval {
  start: Date;
  end: Date;
}

export function tzScan(tz: string, interval: Interval) {
  const changes: any[] = [];
  const date = new Date(interval.start);
  date.setUTCSeconds(0, 0);
  const endDate = new Date(interval.end);
  endDate.setUTCSeconds(0, 0);
  const endTime = +endDate;

  const { format } = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour12: false,
  });

  let lastValues = formatToValues(format(date));
  let lastOffset = calcOffset(lastValues, date);
  while (+date < endTime) {
    date.setUTCHours(date.getUTCHours() + 1);

    let lastHours = lastValues[3] + 1;
    if (lastHours === 24) lastHours = 0;

    const values = formatToValues(format(date));

    if (values[3] !== lastHours) {
      const offset = calcOffset(values, date);
      changes.push({
        date: new Date(date),
        change: offset - lastOffset,
        offset,
      });
    }

    lastValues = values;
    lastOffset = calcOffset(lastValues, date);
  }

  return changes;
}

export function tzOffset(tz: string, date: Date) {
  const { format } = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour12: false,
  });

  const _date = new Date(date);
  _date.setUTCSeconds(0, 0);

  const values = formatToValues(format(_date));
  return calcOffset(values, _date);
}

function calcOffset(values: DateValues, date: Date) {
  return (Date.UTC(...values) - +date) / 60000;
}

type DateValues = [number, number, number, number, number];

function formatToValues(formatResult: string): DateValues {
  const [month, day, year, hours, minutes] = formatResult
    .match(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/)
    ?.slice(1)
    .map(Number) as DateValues;
  return [year, month - 1, day, hours === 24 ? 0 : hours, minutes];
}
