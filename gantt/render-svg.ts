import { RENDER_CONFIG, UNIT_WIDTH } from "./constants.ts";
import { renderElement } from "./utils.ts";
import type { El, Entry, Legend, Section } from "./types.ts";

const truncateLabel = (width: number, fontSize: number, label = "") => {
  const maxChars =
    Math.floor(width / (RENDER_CONFIG.fontSizeMultiplier * fontSize)) -
    1;
  return label.length > (maxChars + 1) ? label.slice(0, maxChars) + "…" : label;
};

const getMaskId = () => "mask_" + String(Math.random()).slice(2);

const renderEntry = ({ x, width, label }: Entry, y: number): El => {
  const id = getMaskId();
  return {
    tag: "g",
    attrs: {
      transform: `translate(${(x || 0)}, ${
        (y || 0) + RENDER_CONFIG.entry.margin
      })`,
    },
    children: [
      {
        tag: "defs",
        children: [
          {
            tag: "mask",
            attrs: { id },
            children: [
              {
                tag: "rect",
                attrs: {
                  width: "100%",
                  height: "100%",
                  fill: "#fff",
                },
              },
              {
                tag: "text",
                attrs: {
                  x: width / 2,
                  y: RENDER_CONFIG.entry.height * .7 +
                    RENDER_CONFIG.entry.margin,
                  "text-anchor": "middle",
                  "font-size": RENDER_CONFIG.entry.fontSize,
                  fill: "#000",
                },
                innerText: truncateLabel(
                  width,
                  RENDER_CONFIG.entry.fontSize,
                  label,
                ),
              },
            ],
          },
        ],
      },
      {
        tag: "rect",
        attrs: {
          mask: `url('#${id}')`,
          x: RENDER_CONFIG.entry.margin,
          y: RENDER_CONFIG.entry.margin,
          width: width - RENDER_CONFIG.entry.margin * 2,
          height: RENDER_CONFIG.entry.height,
          rx: RENDER_CONFIG.entry.rectRound,
          fill: "currentColor",
        },
      },
    ],
  };
};

const renderEntries = (entries: Entry[], initialY = 0) => {
  let y = initialY;
  /** @type {El[]} */
  const elements = [];
  for (const entry of entries) {
    elements.push(renderEntry(entry, y));
    y = y + RENDER_CONFIG.entry.height + RENDER_CONFIG.entry.margin * 2;
  }
  return { y: y + RENDER_CONFIG.entry.margin * 2, elements };
};

const renderSection = ({ label, entries }: Section, y = 0) => {
  const { elements, y: _y } = renderEntries(
    entries,
    RENDER_CONFIG.section.fontSize,
  );
  const element: El = {
    tag: "g",
    attrs: { transform: `translate(0, ${y + RENDER_CONFIG.section.margin})` },
    children: [
      {
        tag: "text",
        attrs: {
          x: RENDER_CONFIG.section.margin,
          y: RENDER_CONFIG.section.fontSize * .7,
          fill: "currentColor",
          "font-size": RENDER_CONFIG.section.fontSize,
        },
        innerText: label || "",
      },
      ...elements,
    ],
  };
  return { element, y: y + _y + RENDER_CONFIG.section.margin };
};

const renderSections = (sections: Section[], initialY = 0) => {
  let y = initialY;
  const elements: El[] = [];
  for (const section of sections) {
    const { y: _y, element } = renderSection(section, y);
    elements.push(element);
    y = _y;
  }
  return { y: y + RENDER_CONFIG.section.margin, elements };
};

const renderLegend = ({ labels, verticalLines }: Legend, height: number) => {
  const g: El = {
    tag: "g",
    attrs: {
      transform: `translate(0, ${RENDER_CONFIG.legend.height})`,
    },
    children: [
      ...labels.map(({ label, x }) => ({
        tag: "text",
        innerText: truncateLabel(
          UNIT_WIDTH,
          RENDER_CONFIG.legend.label["font-size"],
          label,
        ),
        attrs: {
          x,
          ...RENDER_CONFIG.legend.label,
        },
      })),
      ...verticalLines.map((x) => ({
        tag: "line",
        attrs: {
          x1: x,
          x2: x,
          y1: 0,
          y2: height,
          ...RENDER_CONFIG.legend.verticalLine,
        },
      })),
    ],
  };

  return g;
};

export const renderSvg = (
  { width, sections, legend }: {
    width: number;
    sections: Section[];
    legend?: Legend;
  },
) => {
  const { elements, y: height } = renderSections(sections);

  const sectionGroup: El = {
    tag: "g",
    attrs: legend
      ? { transform: `translate(0, ${RENDER_CONFIG.legend.height * 2})` }
      : {},
    children: elements,
  };

  const children = legend
    ? [renderLegend(legend, height), sectionGroup]
    : [sectionGroup];

  const canvasWidth = width + UNIT_WIDTH;
  const canvasHeight = legend
    ? (height + 2 * RENDER_CONFIG.legend.height)
    : height;

  const el: El = {
    tag: "svg",
    attrs: {
      viewBox: `0 0 ${canvasWidth} ${canvasHeight}`,
      xmlns: "http://www.w3.org/2000/svg",
      style:
        "font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
    },
    children: [
      {
        tag: "g",
        attrs: { transform: `translate(${UNIT_WIDTH / 2}, 0)` },
        children,
      },
    ],
  };

  return renderElement(el);
};
