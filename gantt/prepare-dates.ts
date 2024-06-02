import type { AddHorizontalPosition, Config, Section } from "./types.ts";
import { UNIT_WIDTH } from "./constants.ts";
import { pad } from "./utils.ts";

const addPeriod = (period: "day" | "month" | "year", date: Date) => {
  const clone = new Date(date);
  if (period === "year") {
    clone.setFullYear(date.getFullYear() + 1);
  } else if (period === "month") {
    clone.setMonth(date.getMonth() + 1);
  } else {
    clone.setDate(date.getDate() + 1);
  }
  return clone;
};

const getEndTime = (end: string) => {
  const [_, mm, dd] = end.split("-").map(Number);
  if (dd) {
    return addPeriod("day", new Date(end)).getTime();
  } else if (mm) {
    return addPeriod("month", new Date(end)).getTime();
  } else {
    return addPeriod("year", new Date(end)).getTime();
  }
};

const getDomain = ({ sections }: Config) => {
  const domain: number[] = [];
  let minLength = Infinity;
  for (const { entries } of sections) {
    for (const { start, end } of entries) {
      const startTime = new Date(start).getTime();
      const endTime = getEndTime(end);
      domain.push(startTime);
      domain.push(endTime);
      minLength = Math.min(endTime - startTime, minLength);
    }
  }
  const sorted = domain.sort((a, b) => a > b ? 1 : -1);
  return { domain: sorted, minLength };
};

type DateUnit = "day" | "week" | "month" | "year" | "decade" | "century";

const unitLengths: { name: DateUnit; length: number }[] = [
  { name: "day", length: new Date("1970-01-02").getTime() },
  { name: "week", length: new Date("1970-01-08").getTime() },
  { name: "month", length: new Date("1970-02").getTime() },
  { name: "year", length: new Date("1971").getTime() },
  { name: "decade", length: new Date("1980").getTime() },
  { name: "century", length: new Date("2070").getTime() },
];

const getClosestUnit = (n: number) => {
  let closest = unitLengths[0];
  for (const unitLength of unitLengths) {
    if (
      Math.abs(unitLength.length - n) <
        Math.abs(closest.length - n)
    ) {
      closest = unitLength;
    }
  }
  return closest;
};

const getScale = (config: Config) => {
  const { domain, minLength } = getDomain(config);
  const start = domain[0];
  const end = domain[domain.length - 1];
  const diff = end - start;
  const unit = getClosestUnit(diff / (diff / minLength));
  const totalWidth = diff / unit.length * UNIT_WIDTH;
  const scale = (date: string, isEnd?: boolean) => {
    const time = isEnd ? getEndTime(date) : new Date(date).getTime();
    return 1 / diff * (time - start) * totalWidth;
  };
  return { totalWidth, scale, unit, start, end };
};

const addPositions =
  (scale: (date: string, isEnd?: boolean) => number): AddHorizontalPosition =>
  (entry) => {
    const start = scale(entry.start);
    const end = scale(entry.end, true);
    return { ...entry, x: start, width: end - start };
  };

const getLabelByUnit = (unit: DateUnit) => (date: Date) => {
  switch (unit) {
    case "century":
      return String(date.getFullYear());
    case "decade":
      return String(date.getFullYear());
    case "year":
      return String(date.getFullYear());
    case "month":
      return [
        String(date.getFullYear()),
        pad(date.getMonth() + 1),
      ].join("-");
    default:
      return [
        String(date.getFullYear()),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
      ].join("-");
  }
};

const incrementByUnit = (unit: DateUnit) => (date: Date) => {
  const d = new Date(date);
  if (unit === "century") {
    d.setFullYear(date.getFullYear() + 100);
  } else if (unit === "decade") {
    d.setFullYear(date.getFullYear() + 10);
  } else if (unit === "year") {
    d.setFullYear(date.getFullYear() + 1);
  } else if (unit === "month") {
    d.setMonth(date.getMonth() + 1);
  } else if (unit === "week") {
    d.setDate(date.getDate() + 7);
  } else {
    d.setDate(date.getDate() + 1);
  }
  return d;
};

const getDiffLabel = (b: string, a?: string) => {
  if (!a) return b;
  const _aa = a.split("-").reverse();
  const _bb = b.split("-").reverse();
  return _bb.reduce((r: string[], d: string, i) => {
    if (_aa[i] !== d) r.push(d);
    return r;
  }, []).reverse().join("-");
};

const getDateTicks = (startTime: number, endTime: number, unit: DateUnit) => {
  const getLabel = getLabelByUnit(unit);
  const increment = incrementByUnit(unit);

  const ticks: { label: string; time: number }[] = [];
  const label = getLabel(new Date(startTime));
  ticks.push({ label: label, time: new Date(label).getTime() });
  let run = true;
  while (run) {
    const last = ticks[ticks.length - 1];
    const nextDate = increment(new Date(last.time));
    ticks.push({ label: getLabel(nextDate), time: nextDate.getTime() });
    run = nextDate.getTime() <= endTime;
  }

  return ticks
    .filter((d) => startTime <= d.time && d.time <= endTime)
    .map((d, i, all) => ({
      label: getDiffLabel(d.label, all[i - 1]?.label),
      date: new Date(d.time).toISOString(),
    }));
};

const isRoundUnit = (unit: DateUnit) => ["day", "month", "year"].includes(unit);

const getLegend = ({ totalWidth, scale, unit, start, end }: {
  totalWidth: number;
  scale: (date: string, isEnd?: boolean) => number;
  unit: { name: DateUnit; length: number };
  start: number;
  end: number;
}) => {
  const ticks = getDateTicks(start, end, unit.name);
  const verticalLines: number[] = [];
  const labels: { label: string; x: number }[] = [];
  for (const { label, date } of ticks) {
    const x = scale(date);
    verticalLines.push(x);
    const labelX = isRoundUnit(unit.name) ? x + UNIT_WIDTH / 2 : x;
    if (labelX <= totalWidth) {
      labels.push({ label, x: labelX });
    }
  }
  return { labels, verticalLines };
};

export const prepareDates = (config: Config) => {
  const { scale, totalWidth, unit, start, end } = getScale(config);

  const addHorizontalPosition = addPositions(scale);
  const sections: Section[] = config.sections.map((section) => ({
    label: section.label,
    entries: section.entries.map(addHorizontalPosition),
  }));

  return {
    width: totalWidth,
    sections,
    legend: getLegend({ scale, totalWidth, unit, start, end }),
  };
};
