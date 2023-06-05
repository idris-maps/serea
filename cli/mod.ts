import { convertToHtml } from "./convert-to-html.ts";
import { startServer } from "./serve.ts";

const firstArg = Deno.args[0];

const help = `
-- serea --

Usage:
======

- convert a markdown file to html
  -------------------------------

  serea [MD-FILE] > [OUTPUT]

  Example:

  serea my-file.md > my-file.html

  Optionally use your own css file with "--css=my-style.css"


- serve all md files in the current directory
  -------------------------------------------

  serea serve

  Options:

    * --port=3000 (defaults to 3000)
    * --css=my-style.css

`;

if (!firstArg || ["help", "-h"].includes(firstArg)) {
  console.log(help);
} else if (firstArg === "serve") {
  startServer();
} else {
  convertToHtml(firstArg);
}
