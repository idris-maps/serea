import { Config } from "./types.d.ts";

const lines = function* (xml: string) {
  for (const line of xml.split(">")) {
    if (line.trim() !== "") {
      yield line + ">";
    }
  }
};

const parseLine = (line: string) => {
  const _parts = line.split('="');
  return _parts
    .map((d) => d.split('"').map((d) => d.trim()))
    .reduce(
      (
        r: { tag?: string; attrs: Record<string, string>; end?: string },
        d,
        i,
        all,
      ) => {
        if (!r.tag) {
          const [_tag, key] = d[0].split(" ");
          r.tag = _tag.slice(1);
          r.attrs[key] = all[i + 1][0];
        } else if (i === all.length - 1) {
          r.end = d[1];
        } else {
          r.attrs[d[1]] = all[i + 1][0];
        }
        return r;
      },
      { tag: undefined, attrs: {} },
    );
};

const serializeLine = (
  { tag, attrs, end }: {
    tag?: string;
    attrs: Record<string, string>;
    end?: string;
  },
) =>
  [
    "<" + tag,
    ...Object.entries(attrs).map(([k, v]) => `${k}="${v}"`),
    end,
  ].join(" ");

const getFillDefsSvg = (id: string) => [
  "<defs>",
  `<pattern id="${id}-fill-0" patternUnits="userSpaceOnUse" width="5" height="5"><path d="M 0,5 l 5,-5 M -1.25,1.25 l 2.5,-2.5 M 3.75,6.25 l 2.5,-2.5" stroke-width="2" shape-rendering="auto" stroke="currentColor" stroke-linecap="square"></path></pattern>`,
  `<pattern id="${id}-fill-1" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="3.5" cy="3.5" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="0" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="7" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="7" cy="0" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="7" cy="7" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
  `<pattern id="${id}-fill-2" patternUnits="userSpaceOnUse" width="8" height="8"><path d="M 0,0 l 8,8 M -2,6 l 4,4 M 6,-2 l 4,4" stroke-width="2" shape-rendering="auto" stroke="currentColor" stroke-linecap="square"></path></pattern>`,
  `<pattern id="${id}-fill-3" patternUnits="userSpaceOnUse" width="6" height="6"><circle cx="3" cy="3" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="0" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="6" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="6" cy="0" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="6" cy="6" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
  `<pattern id="${id}-fill-4" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="3.5" cy="3.5" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
  `<pattern id="${id}-fill-5" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M 0 3 c 0.75 -1.5 , 2.25 -1.5 , 3 0 c 0.75 1.5 , 2.25 1.5 , 3 0 M -3 3 c 0.75 1.5 , 2.25 1.5 , 3 0 M 6 3 c 0.75 -1.5 , 2.25 -1.5 , 3 0" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="square" shape-rendering="auto"></path></pattern>`,
  "</defs>",
];

const fix = function* (
  lines: Generator<string>,
  id: string,
  background?: string,
  addPatterns?: boolean,
) {
  for (const d of lines) {
    if (d.startsWith("<svg")) {
      const parsed = parseLine(d);
      delete parsed.attrs.width;
      delete parsed.attrs.height;
      parsed.attrs.id = id;
      yield serializeLine(parsed);
      if (addPatterns) {
        for (const _d of getFillDefsSvg(id)) {
          yield _d;
        }
      }
    } else if (!background && d.includes('class="background')) {
      const parsed = parseLine(d);
      delete parsed.attrs.stroke;
      yield serializeLine(parsed);
    } else {
      yield d;
    }
  }
};

export const addExtras = (
  id: string,
  svg: string,
  config: Config,
  addPatterns?: boolean,
) => {
  let result = "";
  for (const d of fix(lines(svg), id, config.background, addPatterns)) {
    result = result + d;
  }
  return result;
};
