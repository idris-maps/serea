import { ChartType, Config } from "./types.d.ts";

const hasColor = (d: Config): d is Config & { color: string } =>
  Object.keys(d).includes("color");

const hasOutlineColor = (d: Config): d is Config & { outlineColor: string } =>
  Object.keys(d).includes("outlineColor");

export const getMark = (chartType: ChartType, config: Config = {}) => {
  const color = hasColor(config) ? config.color : "currentColor";
  const outlineColor = hasOutlineColor(config)
    ? config.outlineColor
    : "currentColor";

  switch (chartType) {
    case "area-chart":
      return { type: "area", color };
    case "bar-chart":
      return { type: "bar", color };
    case "line-chart":
      return { type: "line", color };
    case "multiline-chart":
      return { type: "line", color: color };
    case "pie-chart":
      return { type: "arc", stroke: outlineColor };
    case "stacked-bar-chart":
      return { type: "bar", stroke: outlineColor };
    default:
      throw new Error(`Unknown chart type ${chartType}`);
  }
};
