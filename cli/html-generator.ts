import { readLinesFromFile } from "./read-lines-from-file.ts";
import { separateCodeblocks } from "./separate-code-blocks.ts";
import { renderPart } from "./render-part.ts";
import { getCss } from "./get-css.ts";

const fileExists = async (path: string) => {
  try {
    return (await Deno.lstat(path)).isFile;
  } catch {
    return false;
  }
};

const getHead = (style: string, title?: string) => [
  "<!DOCTYPE html>",
  "<html>",
  "<head>",
  '<meta charset="UTF-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  `<style>${style}</style>`,
  title ? `<title>${title}</title>` : "",
  "</head>",
  "<body>",
  "<main>",
];

const foot = [
  "</main>",
  "</body>",
  "</html>",
];

export const htmlGenerator = async (path: string) => {
  if (!(await fileExists(path))) {
    throw new Error("Not found");
  }

  const style = await getCss();

  return async function* () {
    const parts = separateCodeblocks(readLinesFromFile(path));
    const pathParts = path.split("/");
    let title = pathParts[pathParts.length - 1];
    if (title.endsWith(".md")) title = title.slice(0, -3);
    let gotFirstLine = false;

    for await (const part of parts) {
      if (!gotFirstLine) {
        if (part.type === "md" && part.content.startsWith("#")) {
          const titleFromFirstLine = part.content.split("\n")[0].split("#")
            .join("").trim();
          if (titleFromFirstLine !== "") title = titleFromFirstLine;
        }
        for (const d of getHead(style, title)) {
          yield d;
        }
        gotFirstLine = true;
      }
      yield await renderPart(part);
    }

    for (const d of foot) {
      yield d;
    }
  };
};
