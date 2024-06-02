import { UNIT_WIDTH } from "./constants.ts";
import { invertMap, round } from "./utils.ts";
import type { AddHorizontalPosition, Config, Section } from "./types.ts";

type DomainConfig = Config & { domain: string[] };

export interface ScaleData {
  scale: (d: number) => number;
  domain: number[];
  domainMap: Map<string, number>;
}

const getDomain = (configDomain: string[]) => {
  const domain: number[] = [];
  const domainMap: Map<string, number> = new Map();
  configDomain.forEach((d, i) => {
    domain.push(i);
    domainMap.set(d, i);
  });

  return { domain, domainMap };
};

const getScale = (domain: number[]) => {
  const start = domain.slice(0, 1)[0];
  const end = domain.slice(-1)[0];
  const diff = end - start;
  return (d: number) => 1 / diff * (d - start);
};

const getScaleData = (domain: string[]): ScaleData => {
  const d = getDomain(domain);
  return { ...d, scale: getScale(d.domain) };
};

const addPositions =
  ({ scale, domainMap }: ScaleData): AddHorizontalPosition => (entry) => {
    const width = (domainMap.size - 1) * UNIT_WIDTH;
    const _start = scale(domainMap.get(entry.start) || 0);
    const _end = scale(domainMap.get(entry.end) || 0);
    const start = round(Math.min(_start, _end) * width);
    const end = round(Math.max(_start, _end) * width) + UNIT_WIDTH;
    return { ...entry, x: start, width: round(end - start) };
  };

const getLegend = (
  { scale, domainMap, domain }: ScaleData,
  width: number,
) => {
  const invertedMap = invertMap(domainMap);

  const lineXs: Set<number> = new Set();
  const labels: { label: string; x: number }[] = [];

  for (const d of domain) {
    const w = width - UNIT_WIDTH;
    const start = round(scale(d) * w);
    const end = round(scale(d) * w) + UNIT_WIDTH;
    const center = start + (end - start) / 2;
    lineXs.add(start);
    lineXs.add(end);
    labels.push({ label: invertedMap.get(d) || "", x: center });
  }

  return { labels, verticalLines: Array.from(lineXs) };
};

export const prepareDomains = (config: DomainConfig) => {
  const scaleData = getScaleData(config.domain);

  const width = scaleData.domainMap.size * UNIT_WIDTH;

  const addHorizontalPosition = addPositions(scaleData);
  const sections: Section[] = config.sections.map((section) => ({
    label: section.label,
    entries: section.entries.map(addHorizontalPosition),
  }));

  const legend = getLegend(scaleData, width);

  return {
    width,
    sections,
    legend,
  };
};
