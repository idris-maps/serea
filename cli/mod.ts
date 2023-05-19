import { readLinesFromFile } from "./read-lines-from-file.ts";
import { separateCodeblocks } from "./separate-code-blocks.ts";
import { renderPart } from "./render-part.ts";
import { defaultCss } from "./default-css.ts";

const run = async () => {
  const mdFile = Deno.args[0];

  if (!mdFile) {
    console.error(`
      No markdown file specified

      Usage:
        serea my-file.md
    `);
    return;
  }

  let style = defaultCss;

  try {
    if (Deno.args[1] === "--css" && (Deno.args[2] || "").endsWith(".css")) {
      style = await Deno.readTextFile(Deno.args[2]);
    }
  } catch {
    console.error(`
    Could not find css file ${Deno.args[2]}

    Usage:
      serea my-file.md --css style.css    
    `);
  }

  const parts = separateCodeblocks(readLinesFromFile(mdFile));

  const main: string[] = [];

  [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<style>${style}</style>`,
    "</head>",
    "<body>",
    "<main>",
  ].forEach((d) => console.log(d));

  for await (const part of parts) {
    console.log(await renderPart(part));
  }

  [
    "</main>",
    "</body>",
    "</html>",
  ].forEach((d) => console.log(d));
};

run();
