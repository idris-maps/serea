import { Config, Data2d, Data3d, DataPie } from "./types.d.ts";

const linesFromString = function* (d: string) {
  const lines = d.split("\n");
  for (const line of lines) {
    yield line;
  }
};

const isString = (d: unknown): d is string => Boolean(d) && d === String(d);
const isNumber = (d: unknown): d is number => !Number.isNaN(d);
const isArrayOfStrings = (d: unknown): d is string[] =>
  Array.isArray(d) && d.every(isString);

type StringConfigKey =
  | "description"
  | "background"
  | "legendColor"
  | "color"
  | "outlineColor";
type NumberConfigKey = "width" | "height" | "xLabelAngle" | "yLabelAngle";
const isStringConfigKey = (d: string): d is StringConfigKey =>
  ["description", "background", "legendColor", "color", "outlineColor"]
    .includes(d);
const isNumberConfigKey = (d: string): d is NumberConfigKey =>
  ["width", "height", "xLabelAngle", "yLabelAngle"].includes(d);

const isConfigLine = (d: string) => d.includes(":");
const isRow = (d: string) => d.split(",").length >= 2;

const parseString = (d: string) => {
  const config: Config = {};
  let head: string[] = [];
  const rows: (string | number | undefined)[][] = [];

  for (const line of linesFromString(d)) {
    if (isConfigLine(line)) {
      const [key, value] = line.split(":").map((d) => d.trim());
      if (isStringConfigKey(key) && isString(value) && value !== "") {
        // @ts-ignore ?
        config[key] = value;
      }
      if (isNumberConfigKey(key) && isNumber(Number(value))) {
        // @ts-ignore ?
        config[key] = Number(value);
      }
      if (key === "temporal") {
        // @ts-ignore ?
        config.temporal = value === "true";
      }
      if (key === "colors") {
        const colors = value.split(",").map((d) => d.trim()).filter((d) =>
          d !== ""
        );
        if (isArrayOfStrings(colors) && colors.length > 1) {
          // @ts-ignore ?
          config.colors = colors;
        }
      }
    }

    if (isRow(line)) {
      const parts = line.split(",").map((d) => d.trim()).filter((d) =>
        d !== ""
      );
      if (!head.length) head = parts;
      else rows.push(parts.map((d, i) => i === 1 ? Number(d) : d));
    }
  }

  return { config, head, rows };
};

const is2dRow = (d: (string | number | undefined)[]): d is [string, number] =>
  Boolean(
    Array.isArray(d) &&
      (d[0] && String(d[0]) === d[0]) &&
      (d[1] && !Number.isNaN(d[1])),
  );

export const parse2d = (d: string): { data: Data2d; config: Config } => {
  const { config, head, rows } = parseString(d);

  const [xLabel, yLabel] = head;
  if (!xLabel || !yLabel) {
    throw new Error("Could not parse data: missing headers");
  }

  const _rows = rows.filter(is2dRow);
  if (!_rows.length) {
    throw new Error("Could not parse data: missing rows");
  }

  return { data: { xLabel, yLabel, rows: _rows }, config };
};

export const parsePie = (d: string): { data: DataPie; config: Config } => {
  const { data, config } = parse2d(d);
  return {
    data: {
      categoryLabel: data.xLabel,
      valueLabel: data.yLabel,
      rows: data.rows,
    },
    config,
  };
};

const is3dRow = (
  d: (string | number | undefined)[],
): d is [string, number, string] =>
  Boolean(
    Array.isArray(d) &&
      (d[0] && String(d[0]) === d[0]) &&
      (d[1] && !Number.isNaN(d[1])) &&
      (d[2] && String(d[2]) === d[2]),
  );

export const parse3d = (d: string): { data: Data3d; config: Config } => {
  const { config, head, rows } = parseString(d);

  const [xLabel, yLabel, categoryLabel] = head;
  if (!xLabel || !yLabel || !categoryLabel) {
    throw new Error("Could not parse data: missing headers");
  }

  const _rows = rows.filter(is3dRow);
  if (!_rows.length) {
    throw new Error("Could not parse data: missing rows");
  }

  return { data: { xLabel, yLabel, categoryLabel, rows: _rows }, config };
};
