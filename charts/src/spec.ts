import {
  ChartType2d,
  Config,
  Config2d,
  ConfigMultiLine,
  ConfigPie,
  ConfigStackedBar,
  Data2d,
  Data3d,
  DataPie,
} from "./types.d.ts";
import { format2dData, format3dData, formatPieData } from "./data.ts";
import {
  get2dEncoding,
  getMultilineEncoding,
  getPieEncoding,
  getStackedBarEncoding,
} from "./encoding.ts";
import { getMark } from "./mark.ts";

const getBaseSpec = (config: Config = {}) => {
  const base: Record<string, string | number> = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    background: "none",
  };

  const keys = ["description", "width", "height", "background"];
  keys.forEach((key) => {
    // @ts-ignore ?
    if (config[key]) base[key] = config[key];
  });

  return base;
};

export const get2dSpec = (
  chartType: ChartType2d,
  data: Data2d,
  config: Config2d = {},
) => ({
  ...getBaseSpec(config),
  data: format2dData(data),
  mark: getMark(chartType, config),
  encoding: get2dEncoding(chartType, data, config),
});

export const getPieSpec = (
  id: string,
  data: DataPie,
  config: ConfigPie = {},
) => ({
  ...getBaseSpec(config),
  data: formatPieData(data),
  mark: getMark("pie-chart", config),
  encoding: getPieEncoding(id, data, config),
});

export const getMultiLineSpec = (
  data: Data3d,
  config: ConfigMultiLine = {},
) => ({
  ...getBaseSpec(config),
  data: format3dData(data),
  mark: getMark("multiline-chart", config),
  encoding: getMultilineEncoding(data, config),
});

export const getStackedBarSpec = (
  id: string,
  data: Data3d,
  config: ConfigStackedBar = {},
) => ({
  ...getBaseSpec(config),
  data: format3dData(data),
  mark: getMark("stacked-bar-chart", config),
  encoding: getStackedBarEncoding(id, data, config),
});
