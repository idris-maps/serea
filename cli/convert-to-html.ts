import { htmlGenerator } from "./html-generator.ts";

export const convertToHtml = async (path: string) => {
  const html = await htmlGenerator(path);

  for await (const d of html()) {
    console.log(d);
  }
};
