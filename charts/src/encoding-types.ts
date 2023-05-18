import {
  AxisStyle,
  AxisStyleProps,
  Config2d,
  ConfigMultiLine,
  ConfigPie,
  ConfigStackedBar,
  Data2d,
  Data3d,
  DataPie,
  EncodingItem,
} from "./types.d.ts";

const getAxisStyle = (
  { labelAngle, legendColor = "currentColor" }: AxisStyleProps,
) => {
  const style: AxisStyle = {
    labelColor: legendColor,
    tickColor: legendColor,
    titleColor: legendColor,
    domainColor: legendColor,
    gridColor: legendColor,
    gridOpacity: 0.1,
  };
  if (labelAngle) {
    style.labelAngle = labelAngle;
  }
  return style;
};

export const getX = (
  type: "ordinal" | "temporal",
  data: Data2d | Data3d,
  config: Config2d | ConfigStackedBar,
): EncodingItem => ({
  field: "x",
  type,
  title: data.xLabel,
  axis: getAxisStyle({
    labelAngle: config.xLabelAngle,
    legendColor: config.legendColor,
  }),
});

export const getY = (
  data: Data2d | Data3d,
  config: Config2d | ConfigStackedBar,
): EncodingItem => ({
  field: "y",
  type: "quantitative",
  title: data.yLabel,
  axis: getAxisStyle({
    labelAngle: config.yLabelAngle,
    legendColor: config.legendColor,
  }),
});

const getDefaultFill = (id: string) =>
  Array.from(Array(6))
    .map((_, i) => `url(#${id}-fill-${i})`);

export const getColor = (
  id: string,
  data: DataPie | Data3d,
  config: ConfigPie | ConfigStackedBar,
  skipAxis?: boolean,
): EncodingItem => {
  const item: EncodingItem = {
    field: "category",
    type: "nominal",
    title: data.categoryLabel,
    legend: {
      labelColor: config.legendColor || "currentColor",
      titleColor: config.legendColor || "currentColor",
    },
    scale: {
      range: config.colors || getDefaultFill(id),
    },
  };

  if (!skipAxis) {
    item.axis = getAxisStyle({ legendColor: config.legendColor });
  }

  return item;
};

export const getTheta = (data: DataPie): EncodingItem => ({
  field: "value",
  type: "quantitative",
  title: data.valueLabel,
});

export const getStrokeDash = (
  data: Data3d,
  config: ConfigMultiLine,
): EncodingItem => ({
  field: "category",
  type: "nominal",
  title: data.categoryLabel,
  scale: {
    range: [
      [1, 0],
      [1, 1],
      [3, 1],
      [5, 1, 2, 1],
      [2, 3, 4, 3],
      [1, 3],
    ],
  },
  legend: {
    labelColor: config.legendColor || "currentColor",
    titleColor: config.legendColor || "currentColor",
  },
});
