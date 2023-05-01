export interface GraphOptions {
  directed?: boolean;
  multigraph?: boolean;
  compound?: boolean;
}
// deno-lint-ignore no-explicit-any
export interface Graph<T = any> {
  graph: () => GraphLabel;
  isDirected: () => boolean;
  isMultiGraph: () => boolean;
  setGraph: (label: GraphLabel) => Graph<T>;

  edge: (edgeObj: Edge) => GraphEdge;
  edgeCount: () => number;
  edges: () => Edge[];
  hasEdge: (edgeObj: Edge) => boolean;
  inEdges: (inNodeName: string, outNodeName?: string) => Edge[] | undefined;
  outEdges: (outNodeName: string, inNodeName?: string) => Edge[] | undefined;
  removeEdge: (outNodeName: string, inNodeName: string) => Graph<T>;
  setDefaultEdgeLabel: (
    callback:
      | string
      | ((v: string, w: string, name?: string) => string | Label),
  ) => Graph<T>;
  setEdge: (
    sourceId: string,
    targetId: string,
    value?: string | Label,
    name?: string,
  ) => Graph<T>;
  children: (parentName: string) => string | undefined;
  hasNode: (name: string) => boolean;
  neighbors: (name: string) => Array<Node<T>> | undefined;
  node: (id: string | Label) => Node<T>;
  nodeCount: () => number;
  nodes: () => string[];
  parent: (childName: string) => string | undefined;
  predecessors: (name: string) => Array<Node<T>> | undefined;
  removeNode: (name: string) => Graph<T>;
  filterNodes: (callback: (nodeId: string) => boolean) => Graph<T>;
  setDefaultNodeLabel: (
    callback: string | ((nodeId: string) => string | Label),
  ) => Graph<T>;
  setNode: (name: string, label: string | Label) => Graph<T>;
  setParent: (childName: string, parentName: string) => void;
  sinks: () => Array<Node<T>>;
  sources: () => Array<Node<T>>;
  successors: (name: string) => Array<Node<T>> | undefined;
}

export interface Label {
  [key: string]: unknown;
}
export type WeightFn = (edge: Edge) => number;
export type EdgeFn = (outNodeName: string) => GraphEdge[];

export interface GraphLabel {
  width?: number | undefined;
  height?: number | undefined;
  compound?: boolean | undefined;
  rankdir?: string | undefined;
  align?: string | undefined;
  nodesep?: number | undefined;
  edgesep?: number | undefined;
  ranksep?: number | undefined;
  marginx?: number | undefined;
  marginy?: number | undefined;
  acyclicer?: string | undefined;
  ranker?: string | undefined;
}

export interface NodeConfig {
  width?: number | undefined;
  height?: number | undefined;
}

export interface EdgeConfig {
  minlen?: number | undefined;
  weight?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  lablepos?: "l" | "c" | "r" | undefined;
  labeloffest?: number | undefined;
}

export function layout(
  graph: Graph,
  layout?: GraphLabel & NodeConfig & EdgeConfig,
): void;

export type Layout = (
  graph: Graph,
  layout?: GraphLabel & NodeConfig & EdgeConfig,
) => void;

export interface Edge {
  v: string;
  w: string;
  name?: string | undefined;
}

export interface GraphEdge {
  points: Array<{ x: number; y: number }>;
  [key: string]: unknown;
}

export type Node<T = Record<string, unknown>> = T & {
  x: number;
  y: number;
  width: number;
  height: number;
  class?: string | undefined;
  label?: string | undefined;
  padding?: number | undefined;
  paddingX?: number | undefined;
  paddingY?: number | undefined;
  rx?: number | undefined;
  ry?: number | undefined;
  shape?: string | undefined;
};
