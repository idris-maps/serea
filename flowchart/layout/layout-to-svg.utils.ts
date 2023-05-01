import type {
  EdgeConfigFunc,
  EdgeConfigObj,
  NodeConfigFunc,
  NodeConfigObj,
  SvgConfig,
} from "./layout-to-svg.ts";
import type { OutputEdge, OutputNode } from "./layout.ts";
import { defaultEdgePath } from "./layout-to-svg.ts";
import { isNum, uniq } from "../utils.ts";

export const isNodeConfigFunc = (
  d?: NodeConfigFunc | NodeConfigObj,
): d is NodeConfigFunc => Boolean(d) && typeof d === "function";

export const isNodeConfigObj = (
  d?: NodeConfigFunc | NodeConfigObj,
): d is NodeConfigObj => Boolean(d) && typeof d === "object";

export const isEdgeConfigFunc = (
  d?: EdgeConfigFunc | EdgeConfigObj,
): d is EdgeConfigFunc => Boolean(d) && typeof d === "function";

export const isEdgeConfigObj = (
  d?: EdgeConfigFunc | EdgeConfigObj,
): d is EdgeConfigObj => Boolean(d) && typeof d === "object";

const ARROW_ID = "arrow-head";
export const getArrowId = (color: string) =>
  color.includes("#")
    ? ARROW_ID + "-" + (color.split("#").join(""))
    : ARROW_ID + "-" + color;

export const getNodeConfig = (config: SvgConfig["node"], node: OutputNode) => {
  if (isNodeConfigFunc(config)) {
    return config(node);
  }
  if (isNodeConfigObj(config)) {
    return config;
  }
  return {};
};

export const getEdgeConfig = (config: SvgConfig["edge"], edge: OutputEdge) => {
  if (isEdgeConfigFunc(config)) {
    return config(edge);
  }
  if (isEdgeConfigObj(config)) {
    return config;
  }
  return {};
};

export const getPadding = (
  d?: number | [number, number],
): [number, number] => {
  if (
    Array.isArray(d) &&
    isNum(d[0]) &&
    isNum(d[1])
  ) {
    return d;
  }
  if (isNum(d)) return [d, d];
  return [0, 0];
};

export const getArrowColors = (
  edges: OutputEdge[],
  config?: EdgeConfigObj | EdgeConfigFunc,
): string[] => {
  if (isEdgeConfigObj(config)) {
    const c = config.path?.stroke
      ? String(config.path.stroke)
      : defaultEdgePath.stroke;
    return config.arrow ? [c] : [];
  }

  if (isEdgeConfigFunc(config)) {
    const allColors = edges.reduce((colors: string[], edge) => {
      const conf = config(edge);
      if (conf?.arrow) {
        const c = conf.path?.stroke
          ? String(conf.path.stroke)
          : defaultEdgePath.stroke;
        colors.push(c);
      }
      return colors;
    }, []);
    return uniq(allColors);
  }

  return [];
};
