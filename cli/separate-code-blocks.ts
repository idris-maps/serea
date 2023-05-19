export interface Part {
  type: "md" | "code";
  lang?: string;
  content: string;
}

const FENCE = "```";

const trimIfDefined = (d?: string) => {
  if (!d) return "";
  return d.trim();
};

export const separateCodeblocks = async function* (
  iterator: AsyncGenerator<string>,
): AsyncGenerator<Part> {
  let isCode = false;
  let lang: string | undefined = undefined;
  let current: string | undefined = undefined;

  for await (const line of iterator) {
    if (line.startsWith(FENCE)) {
      if (!isCode) {
        yield { type: "md", content: trimIfDefined(current) };
        const _lang = line.split(FENCE)[1];
        if (_lang !== "") lang = _lang;
        current = undefined;
        isCode = true;
      } else {
        yield { type: "code", lang, content: trimIfDefined(current) };
        lang = undefined;
        current = undefined;
        isCode = false;
      }
    } else {
      current = (current || "") + "\n" + line;
    }
  }

  yield { type: "md", content: trimIfDefined(current) };
};
