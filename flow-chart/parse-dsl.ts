import type { Dir, FlowEdge } from "./render-svg.ts";
import { DIRS, EDGE_TYPES } from "./render-svg.ts";

type G<T> = Generator<T, void, unknown>;

const readLines = function* (d: string) {
  for (const line of d.split("\n")) {
    const l = line.trim();
    if (l !== "") {
      yield l;
    }
  }
};

const removeComments = function* (g: G<string>) {
  for (const line of g) {
    if (!line.startsWith("# ")) {
      yield line;
    }
  }
};

const isDirLine = (line: string) => line.startsWith("dir:");

// @ts-ignore ?
const isDir = (d: string): d is Dir => DIRS.includes(d);

const getDir = (line: string): Dir => {
  const [_, _dir] = line.split("dir:");
  const dir = _dir.trim().toUpperCase();
  return isDir(dir) ? dir : DIRS[0];
};

const getEdgeType = (d: string) => EDGE_TYPES.find((link) => d.includes(link));

const getNode = (d: string) => {
  if (d.includes("[") && d.includes("]") && d.indexOf("[") < d.indexOf("]")) {
    const [id, l] = d.split("[");
    const [label] = l.split("]");
    const tId = id.trim();
    const tLabel = label.trim();
    if (tId !== "" && tLabel !== "") {
      return { id: tId, label: tLabel };
    }
  }
  return { id: d.trim() };
};

const getEdge = (line: string) => {
  const type = getEdgeType(line);
  if (!type) return undefined;
  const [_from, _to] = line.split(type).map((d) => d.trim());
  const from = getNode(_from);
  const to = getNode(_to);
  return from && to ? { from, to, type } : undefined;
};

export const parseDsl = (dsl: string) => {
  let rankdir: Dir = DIRS[0];

  const nodeMap = new Map<string, string>();
  const addNode = ({ id, label }: { id: string; label?: string }) => {
    if (label) nodeMap.set(id, label);
    else {
      if (!nodeMap.get(id)) {
        nodeMap.set(id, id);
      }
    }
  };
  const edges: FlowEdge[] = [];

  const lines = removeComments(readLines(dsl));
  for (const line of lines) {
    if (isDirLine(line)) {
      rankdir = getDir(line);
    } else {
      const edge = getEdge(line);
      if (edge) {
        edges.push({ from: edge.from.id, to: edge.to.id, type: edge.type });
        addNode(edge.from);
        addNode(edge.to);
      }
    }
  }

  return {
    rankdir,
    nodes: Array.from(nodeMap.entries()).map(([id, label]) => ({ id, label })),
    edges,
  };
};
