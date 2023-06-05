import { serve } from "./deps.ts";
import { htmlGenerator } from "./html-generator.ts";
import { readArgs } from "./read-args.ts";
import { renderIndex } from "./render-index.ts";

const stringGeneratorToStream = (
  gen: AsyncGenerator<string> | Generator<string>,
) =>
  new ReadableStream<Uint8Array>({
    pull: async (controller) => {
      try {
        const { done, value } = await gen.next();
        if (value) {
          controller.enqueue(new TextEncoder().encode(value));
        }
        if (done) {
          controller.close();
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });

const getMdPath = (request: Request) => {
  const { pathname } = new URL(request.url);
  let mdPath = pathname.slice(1);
  if (mdPath === "") {
    return undefined;
  }
  if (!mdPath.endsWith(".md")) {
    mdPath = mdPath + ".md";
  }
  return mdPath;
};

const getPort = () => {
  const { port } = readArgs();
  return Number.isInteger(Number(port)) ? Number(port) : 3000;
};

export const startServer = () =>
  serve(async (request) => {
    try {
      const mdPath = getMdPath(request);
      if (!mdPath) {
        return new Response(await renderIndex(), {
          headers: new Headers({
            "Content-Type": "text/html; charset=utf-8",
          }),
        });
      }
      const html = await htmlGenerator(mdPath);
      return new Response(stringGeneratorToStream(html()));
    } catch (err) {
      if (err.message === "Not found") {
        return new Response("Not found", { status: 400 });
      }
      console.error(err);
      return new Response("Internal error", { status: 500 });
    }
  }, { port: getPort() });
