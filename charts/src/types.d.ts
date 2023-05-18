export type ChartType2d = "area-chart" | "bar-chart" | "line-chart";
export type ChartType =
  | ChartType2d
  | "pie-chart"
  | "multiline-chart"
  | "stacked-bar-chart";

export interface Data2d {
  xLabel: string;
  yLabel: string;
  rows: [x: string, y: number][];
}

export interface Data3d {
  xLabel: string;
  yLabel: string;
  categoryLabel: string;
  rows: [x: string, y: number, category: string][];
}

export interface DataPie {
  categoryLabel: string;
  valueLabel: string;
  rows: [category: string, value: number][];
}

export type Data = Data2d | Data3d | DataPie;

export interface ConfigCommon {
  description?: string;
  background?: string;
  legendColor?: string;
  width?: number;
  height?: number;
}

export type Config2d = ConfigCommon & {
  color?: string;
  xLabelAngle?: number;
  yLabelAngle?: number;
  temporal?: boolean;
};

export type ConfigBar = Omit<Config2d, "temporal">;

export type ConfigStackedBar = ConfigCommon & {
  colors?: string[];
  outlineColor?: string;
  xLabelAngle?: number;
  yLabelAngle?: number;
};

export type ConfigMultiLine = ConfigCommon & {
  temporal?: boolean;
  colors?: string[];
};

export type ConfigPie = ConfigCommon & {
  outlineColor?: string;
  colors?: string[];
  xLabelAngle?: number;
  yLabelAngle?: number;
};

export type Config =
  | Config2d
  | ConfigBar
  | ConfigCommon
  | ConfigMultiLine
  | ConfigPie
  | ConfigStackedBar;

export interface AxisStyle {
  labelColor: string;
  tickColor: string;
  titleColor: string;
  domainColor: string;
  gridColor: string;
  gridOpacity: number;
  labelAngle?: number;
}

export interface AxisStyleProps {
  legendColor?: string;
  labelAngle?: number;
}

export interface EncodingItem {
  field: "x" | "y" | "value" | "category";
  type: "ordinal" | "quantitative" | "temporal" | "nominal";
  title: string;
  legend?: Record<string, string | number>;
  axis?: AxisStyle;
  scale?: {
    range: string[] | number[][];
  };
}

export type Encoding = Record<string, EncodingItem>;
