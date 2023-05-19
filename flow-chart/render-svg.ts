import { createLayout, toSvg } from "./layout/mod.ts";

export type Dir = "TB" | "BT" | "LR" | "RL";

export type EdgeType = "-" | "--" | ".." | "->" | "-->" | "..>";

export interface FlowNode {
  id: string;
  label: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export interface FlowChart {
  rankdir: Dir;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const EDGE_TYPES: EdgeType[] = ["..>", "-->", "--", "..", "->", "-"];
export const DIRS: Dir[] = ["TB", "BT", "LR", "RL"];

const NODE_HEIGHT = 30;
const FONT_SIZE = 16;
const STROKE_WIDTH = 1.5;

const getNodeSize = (label: string) => ({
  width: label.length * FONT_SIZE,
  height: NODE_HEIGHT,
});

const getStrokeDashArray = (type?: string) => {
  if (type && type.includes("--")) {
    return `${STROKE_WIDTH * 2} ${STROKE_WIDTH * 3}`;
  }
  if (type && type.includes("..")) {
    return `${STROKE_WIDTH * 0.5} ${STROKE_WIDTH * 1.5}`;
  }
  return "1 0";
};

const getEdgePath = (type?: string) => ({
  stroke: "currentColor",
  "stroke-dasharray": getStrokeDashArray(type),
});

export const renderSvg = ({ rankdir, nodes, edges }: FlowChart) => {
  const layout = createLayout({
    nodes: nodes.map((d) => ({ ...getNodeSize(d.label), ...d })),
    edges: edges,
    config: { rankdir },
  });

  const typeMap = new Map<string, EdgeType>();
  edges.forEach((d) => {
    typeMap.set(`${d.from}___${d.to}`, d.type);
  });
  const getEdgeType = (from: string, to: string) =>
    typeMap.get(`${from}___${to}`);

  return toSvg(layout, {
    style: {
      "font-family":
        "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;",
    },
    padding: [10, 10],
    edge: ({ to, from }) => {
      const type = getEdgeType(String(from), String(to));
      return {
        arrow: Boolean(type && type.includes(">")),
        path: {
          ...getEdgePath(type),
          "stroke-width": STROKE_WIDTH,
        },
      };
    },
    node: {
      rect: {
        stroke: "currentColor",
        rx: "3",
        fill: "currentColor",
        "fill-opacity": 0.05,
        "stroke-opacity": 0.5,
      },
      label: {
        fill: "currentColor",
        "font-size": FONT_SIZE,
      },
    },
  });
};
