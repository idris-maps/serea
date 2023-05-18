import {
  ChartType2d,
  Config2d,
  ConfigMultiLine,
  ConfigPie,
  ConfigStackedBar,
  Data2d,
  Data3d,
  DataPie,
  Encoding,
} from "./types.d.ts";
import {
  getColor,
  getStrokeDash,
  getTheta,
  getX,
  getY,
} from "./encoding-types.ts";

export const get2dEncoding = (
  chartType: ChartType2d,
  data: Data2d,
  config: Config2d = {},
): Encoding => {
  const xType = (chartType === "bar-chart" || !config.temporal)
    ? "ordinal"
    : "temporal";
  return {
    x: getX(xType, data, config),
    y: getY(data, config),
  };
};

export const getPieEncoding = (
  id: string,
  data: DataPie,
  config: ConfigPie,
): Encoding => ({
  theta: getTheta(data),
  color: getColor(id, data, config),
});

export const getStackedBarEncoding = (
  id: string,
  data: Data3d,
  config: ConfigStackedBar,
): Encoding => ({
  x: getX("ordinal", data, config),
  y: getY(data, config),
  color: getColor(id, data, config),
});

export const getMultilineEncoding = (
  data: Data3d,
  config: ConfigMultiLine,
): Encoding => {
  const encoding: Encoding = {
    x: getX(config.temporal ? "temporal" : "ordinal", data, config),
    y: getY(data, config),
  };

  if (config.colors) {
    encoding.color = getColor("", data, config);
  } else {
    encoding.strokeDash = getStrokeDash(data, config);
  }

  return encoding;
};
