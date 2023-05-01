import { parseDsl } from "./parse-dsl.ts";
import { FlowChart, renderSvg } from "./render-svg.ts";
export type { FlowChart } from "./render-svg.ts";

export const render = (d: FlowChart) => renderSvg(d);

export const renderFromString = (d: string) => render(parseDsl(d));
