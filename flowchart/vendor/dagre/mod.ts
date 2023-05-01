import dagre from "./dagre.js";
import { Graph, GraphOptions, Layout } from "./types.d.ts";

export const initGraph = (opt: GraphOptions = {}): Graph =>
  new dagre.Graph(opt);

export const layout: Layout = dagre.layout;
