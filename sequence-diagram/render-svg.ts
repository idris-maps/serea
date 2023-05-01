import type { Sequence, SequenceDiagram } from "./config.ts";
import {
  P_FONT_SIZE,
  P_HEIGHT,
  P_SELF_RADIUS,
  S_FONT_SIZE,
  S_HEIGHT,
  STROKE_WIDTH,
} from "./config.ts";
import { getLabelWidth, getParticipantIndex, getXDistance } from "./utils.ts";

const getX = (xDistance: number, index: number) =>
  xDistance / 2 + xDistance * index;

const getParticipantLabelY = (height: number, y: number) =>
  y - (height / 2 - P_FONT_SIZE * 0.4);

const getSequenceLabelY = (height: number, y: number) =>
  y - (height / 2 - S_FONT_SIZE * 1.3);

const getStrokeDashArray = ({ link }: Sequence) => {
  if (link === "dashed") return `${STROKE_WIDTH * 3} ${STROKE_WIDTH * 2}`;
  if (link === "dotted") return `${STROKE_WIDTH} ${STROKE_WIDTH}`;
  return "1 0";
};

const renderDefs = () => [
  "<defs>",
  '<path id="arrow-left" transform="translate(-5, -5)" d="M 0 5 L 10 0 L 10 10 z"></path>',
  '<path id="arrow-right" transform="translate(-5, -5)" d="M 0 0 L 10 5 L 0 10 z"></path>',
  "</defs>",
];

const renderParticipants = (
  { participants }: SequenceDiagram,
  xDistance: number,
) => [
  '<g fill="none" stroke="currentColor">',
  ...participants.map(({ value }, i) => {
    const w = getLabelWidth(P_FONT_SIZE, value);
    const x = getX(xDistance, i) - w / 2;
    return `<rect x="${x}" width="${w}" height="${P_HEIGHT}" rx="${
      P_HEIGHT / 10
    }"></rect>`;
  }),
  "</g>",
  `<g text-anchor="middle" font-size="${P_FONT_SIZE}" fill="currentColor">`,
  ...participants.map(({ value }, i) => {
    const y = getParticipantLabelY(P_HEIGHT, P_HEIGHT);
    return `<text x="${getX(xDistance, i)}" y="${y}">${value}</text>`;
  }),
  "</g>",
];

type SeqReduce = { y: number; lines: string[] };

const renderSequences = (
  { sequences, participants }: SequenceDiagram,
  xDistance: number,
) => {
  const getIndex = getParticipantIndex(participants);
  const { y, lines } = sequences.reduce((r: SeqReduce, seq): SeqReduce => {
    const y = r.y + S_HEIGHT;
    const lines = r.lines;
    if (seq.to) {
      const xStart = getX(
        xDistance,
        Math.min(getIndex(seq.from), getIndex(seq.to)),
      );
      const xEnd = getX(
        xDistance,
        Math.max(getIndex(seq.from), getIndex(seq.to)),
      );
      const xMiddle = xStart + (xEnd - xStart) / 2;

      lines.push(
        `<line x1="${xStart}" x2="${xEnd}" y1="${y}" y2="${y}" stroke="currentColor" stroke-dasharray="${
          getStrokeDashArray(seq)
        }" stroke-width="${STROKE_WIDTH}"></line>`,
      );
      lines.push(
        `<text x="${xMiddle}" y="${getSequenceLabelY(S_HEIGHT, y)}">${
          seq.label || ""
        }</text>`,
      );
      if (getIndex(seq.from) < getIndex(seq.to)) {
        lines.push(
          `<use x="${xEnd}" y="${y}" href="#arrow-right" fill="currentColor"></use>`,
        );
      } else {
        lines.push(
          `<use x="${xStart}" y="${y}" href="#arrow-left" fill="currentColor"></use>`,
        );
      }
    } else {
      const x = getX(xDistance, getIndex(seq.from));

      lines.push(`<circle cx="${x}" cy="${y}" r="${P_SELF_RADIUS}"></circle>`);
      lines.push(
        `<text x="${x}" y="${getSequenceLabelY(S_HEIGHT, y)}">${
          seq.label || ""
        }</text>`,
      );
    }
    return { y, lines };
  }, { y: P_HEIGHT * 1.5, lines: [] });
  return {
    lines: [
      `<g text-anchor="middle" font-size="${S_FONT_SIZE}" fill="currentColor">`,
      ...lines,
      "</g>",
    ],
    height: y,
  };
};

const renderVerticalLines = (
  { participants }: SequenceDiagram,
  xDistance: number,
  height: number,
) => [
  '<g stroke="currentColor" stroke-opacity="0.2">',
  ...participants.map((_, i) => {
    const x = getX(xDistance, i);
    return `<line x1="${x}" x2="${x}" y1="${P_HEIGHT}" y2="${height}"></line>`;
  }),
  "</g>",
];

export const renderSvg = (SequenceDiagram: SequenceDiagram) => {
  const xDistance = getXDistance(SequenceDiagram);
  const { lines: sequenceLines, height } = renderSequences(
    SequenceDiagram,
    xDistance,
  );
  const h = height + S_HEIGHT / 2 + P_HEIGHT / 2;
  const xMargin = xDistance * 0.1;
  const w = xDistance * SequenceDiagram.participants.length + xMargin * 2;
  const font =
    "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;";
  return [
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="font-family:${font}">`,
    ...renderDefs(),
    `<g transform="translate(${xMargin}, ${P_HEIGHT / 2})">`,
    ...renderVerticalLines(SequenceDiagram, xDistance, height),
    ...renderParticipants(SequenceDiagram, xDistance),
    ...sequenceLines,
    "</g>",
    "</svg>",
  ].join("\n");
};
