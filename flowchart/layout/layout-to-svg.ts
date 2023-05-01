import type { Layout, OutputEdge, OutputNode } from "./layout.ts";
import type { Element } from "./xml-string.ts";
import { xml } from "./xml-string.ts";
import {
  getArrowColors,
  getArrowId,
  getEdgeConfig,
  getNodeConfig,
  getPadding,
} from "./layout-to-svg.utils.ts";

export interface NodeConfigObj {
  rect?: { [key: string]: string | number };
  label?: { [key: string]: string | number };
}

export type NodeConfigFunc = (node: OutputNode) => NodeConfigObj;

export interface EdgeConfigObj {
  arrow?: boolean;
  path?: { [key: string]: string | number };
}

export type EdgeConfigFunc = (edge: OutputEdge) => EdgeConfigObj;

export interface SvgConfig {
  style?: Record<string, string>;
  padding?: number | [number, number];
  node?: NodeConfigObj | NodeConfigFunc;
  edge?: EdgeConfigObj | EdgeConfigFunc;
}

export const defaultNodeRect = {
  fill: "none",
  stroke: "black",
};

export const defaultNodeLabel = {
  "text-anchor": "middle",
  "font-size": 16,
};

export const defaultEdgePath = {
  fill: "none",
  stroke: "black",
  "stroke-linecap": "round",
};

const drawNode = (
  parent: Element,
  node: OutputNode,
  config: SvgConfig["node"] = {},
) => {
  const g = parent.child("g");
  g.attr({ "class": `node-${node.id}` });

  const conf = getNodeConfig(config, node);

  const rect = g.child("rect");
  rect.attr({
    x: node.translate[0],
    y: node.translate[1],
    width: node.width,
    height: node.height,
    ...defaultNodeRect,
    ...(conf.rect || {}),
  });

  const text = g.child("text");
  const textConfig = {
    ...defaultNodeLabel,
    ...(conf.label || {}),
  };
  text.attr({
    x: node.center[0],
    y: node.center[1] +
      (textConfig["font-size"] ? (Number(textConfig["font-size"]) * 0.3) : 0),
    ...textConfig,
  });
  text.data(node.label);
};

const drawEdge = (
  parent: Element,
  edge: OutputEdge,
  config: SvgConfig["edge"] = {},
) => {
  const path = parent.child("path");
  const conf = getEdgeConfig(config, edge);

  const _pathConf = {
    ...defaultEdgePath,
    ...(conf.path || {}),
  };

  const pathConf = conf.arrow
    ? { ..._pathConf, "marker-end": `url(#${getArrowId(_pathConf.stroke)})` }
    : _pathConf;

  path.attr({
    d: edge.path,
    ...pathConf,
  });
};

const defs = (svg: Element, config: SvgConfig = {}, edges: OutputEdge[]) => {
  const arrowColors = getArrowColors(edges, config?.edge);
  if (!arrowColors.length) return;

  const defs = svg.child("defs");

  arrowColors.forEach((fill) => {
    const marker = defs.child("marker");
    marker.attr({
      id: getArrowId(fill),
      orient: "auto",
      viewBox: "0 0 10 10",
      refX: 8,
      refY: 5,
      markerUnits: "strokeWidth",
      markerWidth: 5,
      markerHeight: 5,
    });

    const markerPath = marker.child("path");
    markerPath.attr({
      d: "M 0 0 L 10 5 L 0 10 z",
      fill,
    });
  });
};

export const toSvg = (
  { bbox, edges, nodes }: Layout,
  config: SvgConfig = {},
) => {
  const padding = getPadding(config.padding);
  const viewBox = [
    bbox[0],
    bbox[1],
    (bbox[2] + (2 * padding[0])) - bbox[0],
    (bbox[3] + (2 * padding[1])) - bbox[1],
  ].join(" ");

  const svg = xml("svg");
  svg.attr({
    viewBox,
    xmlns: "http://www.w3.org/2000/svg",
    style: Object.entries(config.style || {}).map(([k, v]) => `${k}:${v}`).join(
      ";",
    ),
  });

  defs(svg, config, edges);

  const g = svg.child("g");
  g.attr({
    transform: `translate(${padding[0]}, ${padding[1]})`,
  });

  const edgeG = g.child("g").attr({ "class": "edges" });

  edges.forEach((d) => drawEdge(edgeG, d, config.edge));
  nodes.forEach((d) => drawNode(g, d, config.node));

  return svg.outer();
};
