// deno-lint-ignore-file no-explicit-any
import { initGraph, layout } from "../vendor/dagre/mod.ts";
import { flatten, getBbox, getLinePath, has, path } from "../utils.ts";

export interface InputNode {
  id: string | number;
  label: string;
  width?: number;
  height?: number;
}

export interface InputEdge {
  from: string | number;
  to: string | number;
}

export interface LayoutConfig {
  rankdir?: "TB" | "BT" | "LR" | "RL";
  node?: {
    width?: number;
    height?: number;
    distanceX?: number;
    distanceY?: number;
  };
}

export interface LayoutProps {
  nodes: InputNode[];
  edges: InputEdge[];
  config?: LayoutConfig;
}

export interface OutputNode extends InputNode {
  width: number;
  height: number;
  center: [number, number];
  translate: [number, number];
}

export interface OutputEdge extends InputEdge {
  points: [number, number][];
  path: string;
}

export interface Layout {
  nodes: OutputNode[];
  edges: OutputEdge[];
  bbox: number[];
}

const fixNode = ({ x, y, width, height, ...rest }: any): OutputNode => ({
  ...rest,
  width,
  height,
  center: [x, y],
  translate: [x - (width / 2), y - (height / 2)],
});

const validate = (nodes: InputNode[], edges: InputEdge[]): void => {
  const nodeMap = new Map();

  nodes.forEach((d) => {
    if (!has("id", d)) {
      throw new Error(`Node is missing "id": ${JSON.stringify(d)}`);
    }
    if (!d.label) {
      throw new Error(`Node is missing "name": ${JSON.stringify(d)}`);
    }
    if (nodeMap.get(d.id)) throw new Error(`Duplicate node "id": ${d.id}`);
    nodeMap.set(d.id, true);
  });

  edges.forEach((d) => {
    if (!has("from", d)) {
      throw new Error(`Edge is missing "from": ${JSON.stringify(d)}`);
    }
    if (!has("to", d)) {
      throw new Error(`Edge is missing "to": ${JSON.stringify(d)}`);
    }
    if (!nodeMap.get(d.from)) {
      throw new Error(`Edge "from" is not a node "id": ${JSON.stringify(d)}`);
    }
    if (!nodeMap.get(d.to)) {
      throw new Error(`Edge "to" is not a node "id": ${JSON.stringify(d)}`);
    }
  });
};

const DEFAULT_CONFIG = {
  rankdir: "TB",
  nodesep: 50,
  ranksep: 50,
  node: { width: 100, height: 20 },
};

const getConfig = (config: LayoutConfig = {}) => {
  const conf = DEFAULT_CONFIG;

  const rankdir = path(["rankdir"], config);
  if (["TB", "BT", "LR", "RL"].includes(rankdir)) {
    conf.rankdir = rankdir;
  }

  const distanceX = path<number>(["node", "distanceX"], config);
  if (distanceX && !Number.isNaN(distanceX)) {
    if (["TB", "BT"].includes(conf.rankdir)) {
      conf.nodesep = distanceX;
    } else {
      conf.ranksep = distanceX;
    }
  }

  const distanceY = path<number>(["node", "distanceY"], config);
  if (distanceY && !Number.isNaN(distanceY)) {
    if (["TB", "BT"].includes(conf.rankdir)) {
      conf.ranksep = distanceY;
    } else {
      conf.nodesep = distanceY;
    }
  }

  const width = path<number>(["node", "width"], config);
  if (width && !Number.isNaN(width)) {
    conf.node.width = width;
  }

  const height = path<number>(["node", "height"], config);
  if (height && !Number.isNaN(height)) {
    conf.node.height = height;
  }

  return conf;
};

export const createLayout = ({ config, nodes, edges }: LayoutProps) => {
  validate(nodes, edges);

  const conf = getConfig(config);

  const graph = initGraph();

  graph.setGraph({
    rankdir: conf.rankdir,
    nodesep: conf.nodesep,
    ranksep: conf.ranksep,
  });

  graph.setDefaultEdgeLabel(function () {
    return {};
  });

  nodes.forEach((d) => {
    const node = {
      ...d,
      width: d.width || conf.node.width,
      height: d.height || conf.node.height,
    };
    graph.setNode(String(d.id), node);
  });

  edges.forEach(({ from, to }) => {
    graph.setEdge(String(from), String(to));
  });

  layout(graph);

  const result: Layout = {
    nodes: [],
    edges: [],
    bbox: [0, 0, 0, 0],
  };

  graph.nodes().forEach(function (v: any) {
    result.nodes.push(fixNode(graph.node(v)));
  });

  graph.edges().forEach(function (e: any) {
    const points: [number, number][] = ((graph.edge(e) || {}).points || [])
      .map(({ x, y }: { x: number; y: number }) => [x, y]);
    const path = getLinePath(points);
    result.edges.push({ from: e.v, to: e.w, points, path });
  });

  const nodePoints = flatten(result.nodes
    .map((
      { translate: [x, y], width, height },
    ) => [[x, y], [x + width, y + height]]));

  const edgePoints = flatten(result.edges.map((d) => d.points));

  const bbox = getBbox(nodePoints.concat(edgePoints));
  result.bbox = bbox;

  return result;
};
