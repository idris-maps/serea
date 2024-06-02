import type { El } from "./types.ts";

export const round = (d: number) => Math.floor(d * 100) / 100;

export const pad = (d: number) => d >= 10 ? String(d) : `0${d}`;

export const invertMap = <A, B>(d: Map<A, B>): Map<B, A> => {
  const map = new Map();
  for (const [label, value] of d.entries()) {
    map.set(value, label);
  }
  return map;
};

export const renderElement = ({ tag, attrs, innerText, children }: El) => {
  let d = "<" + tag;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      d = d + ` ${key}="${value}"`;
    }
  }
  d = d + ">";
  if (innerText) {
    d = d + innerText;
  }
  if (children) {
    for (const child of children) {
      const _child = renderElement(child);
      d = d + _child;
    }
  }
  d = d + `</${tag}>`;
  return d;
};

export const isValidDate = (date: unknown) => {
  try {
    // @ts-ignore ?
    const d = new Date(date);
    return !Number.isNaN(d.getTime());
  } catch {
    return false;
  }
};
