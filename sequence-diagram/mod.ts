import { SequenceDiagram } from "./config.ts";
import { parseDsl } from "./parse-dsl.ts";
import { renderSvg } from "./render-svg.ts";
import { isValidSequenceDiagram } from "./validate.ts";
export type { SequenceDiagram } from "./config.ts";

export const render = (d: SequenceDiagram) => {
  if (isValidSequenceDiagram(d)) {
    return renderSvg(d);
  }
  throw new Error("invalid sequence diagram");
};

export const renderFromString = (d: string) => render(parseDsl(d));
