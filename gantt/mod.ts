import { parseContent } from "./parse-content.ts";
import { prepareDates } from "./prepare-dates.ts";
import { prepareDomains } from "./prepare-domains.ts";
import { renderSvg } from "./render-svg.ts";
import { validateConfig } from "./validate-config.ts";
import type { Config } from "./types.ts";

export const render = (config: Config) => {
  validateConfig(config);
  return renderSvg(
    config.domain
      // @ts-ignore ?
      ? prepareDomains(config)
      : prepareDates(config),
  );
};

export const renderFromString = (content: string) =>
  render(parseContent(content));
