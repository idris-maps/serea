import { defaultCss } from "./default-css.ts";
import { readArgs } from "./read-args.ts";

export const getCss = async () => {
  const { css } = readArgs();
  if (!css || css === true) {
    return defaultCss;
  }

  try {
    return await Deno.readTextFile(css);
  } catch {
    return defaultCss;
  }
};
