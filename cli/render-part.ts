import {
  areaChart,
  barChart,
  flowChart,
  ganttChart,
  lineChart,
  md2html,
  multiLineChart,
  ParseFlags,
  ParseOptions,
  pieChart,
  sequenceDiagram,
  sheetMusic,
  stackedBarChart,
} from "./deps.ts";
import type { Part } from "./separate-code-blocks.ts";

const renderSvg = (
  content: string,
  lang?: string,
): string | Promise<string> => {
  switch (lang) {
    case "area-chart":
      return areaChart.renderFromString(content);
    case "bar-chart":
      return barChart.renderFromString(content);
    case "flow-chart":
      return flowChart.renderFromString(content);
    case "gantt-chart":
      return ganttChart.renderFromString(content);
    case "line-chart":
      return lineChart.renderFromString(content);
    case "multi-line-chart":
      return multiLineChart.renderFromString(content);
    case "pie-chart":
      return pieChart.renderFromString(content);
    case "sequence-diagram":
      return sequenceDiagram.renderFromString(content);
    case "sheet-music":
      return sheetMusic.renderFromString(content);
    case "stacked-bar-chart":
      return stackedBarChart.renderFromString(content);
    default:
      throw new Error("unknown language: " + lang);
  }
};

const render = async (content: string, lang?: string): Promise<string> => {
  try {
    return `<div class="serea ${lang}">${await renderSvg(content, lang)}</div>`;
  } catch {
    return `<pre><code ${
      lang ? `class="language-${lang}" ` : ""
    }>${content}</code></pre>`;
  }
};

const renderCodeBlock = async (part: Part & { type: "code" }) =>
  await render(part.content, part.lang);

const parseOptions: ParseOptions = {
  parseFlags: ParseFlags.DEFAULT | ParseFlags.NO_HTML | ParseFlags.UNDERLINE,
};

const renderMd = (part: Part & { type: "md" }) =>
  md2html(part.content, parseOptions);

const isCode = (part: Part): part is Part & { type: "code" } =>
  part.type === "code";
const isMd = (part: Part): part is Part & { type: "md" } => part.type === "md";

export const renderPart = (part: Part) => {
  if (isCode(part)) return renderCodeBlock(part);
  if (isMd(part)) return renderMd(part);
  return "";
};
