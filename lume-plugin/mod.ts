import type { Element, HTMLDocument, Page, Plugin } from "./deps.ts";

import * as areaChart from "../charts/area-chart.ts";
import * as barChart from "../charts/bar-chart.ts";
import * as flowChart from "../flow-chart/mod.ts";
import * as lineChart from "../charts/line-chart.ts";
import * as multiLineChart from "../charts/multi-line-chart.ts";
import * as pieChart from "../charts/pie-chart.ts";
import * as sequenceDiagram from "../sequence-diagram/mod.ts";
import * as sheetMusic from "../sheet-music/mod.ts";
import * as stackedBarChart from "../charts/stacked-bar-chart.ts";

const getLanguage = (codeElement: Element) => {
  const classes = Array.from(codeElement.classList.values());
  const langClass = classes.find((d) => d.startsWith("language-"));
  if (!langClass) return undefined;
  const [_, language] = langClass.split("language-");
  return language && language.trim() !== "" ? language.trim() : undefined;
};

const getHTML = (lang: string, content: string) => {
  switch (lang) {
    case "area-chart":
      return areaChart.renderFromString(content);
    case "bar-chart":
      return barChart.renderFromString(content);
    case "flow-chart":
      return flowChart.renderFromString(content);
    case "line-chart":
      return lineChart.renderFromString(content);
    case "pie-chart":
      return pieChart.renderFromString(content);
    case "sequence-diagram":
      return sequenceDiagram.renderFromString(content);
    case "sheet-music":
      return sheetMusic.renderFromString(content);
    case "multi-line-chart":
      return multiLineChart.renderFromString(content);
    case "stacked-bar-chart":
      return stackedBarChart.renderFromString(content);
  }
};

const handleCodeBlock = async (
  document: HTMLDocument,
  codeElement: Element,
  path: string,
) => {
  const language = getLanguage(codeElement);
  if (!language) return;

  const pre = codeElement.parentNode;
  if (pre?.nodeName !== "PRE") return;

  const parent = pre.parentNode;
  if (!parent) return;

  const container = document.createElement("div");
  container.classList.add("serea");
  container.classList.add(language);

  try {
    const innerHTML = await getHTML(language, codeElement.innerHTML);

    if (!innerHTML) return;
    container.innerHTML = innerHTML;

    Array.from(container.querySelectorAll("svg")).map((d) => {
      (d as Element).removeAttribute("width");
      (d as Element).removeAttribute("height");
    });

    parent.replaceChild(container, pre);
  } catch (e) {
    console.error(`Could not handle ${language} on page: ${path}`, e);
  }
};

export const sereaPlugin: Plugin = site => {
    site.process([".md"], async (page: Page) => {
      const { document } = page;
      if (!document) {
        return;
      }
      const codeblocks = Array.from(
        document.querySelectorAll("code"),
      ) as Element[];
      await Promise.all(
        codeblocks.map((code) => handleCodeBlock(document, code, page.src.path)),
      );
    });
  };

