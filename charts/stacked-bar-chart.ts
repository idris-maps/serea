import { ConfigStackedBar, Data3d } from "./src/types.d.ts";
import { getStackedBarSpec } from "./src/spec.ts";
import { vegaliteToSvg } from "./vendor/mod.ts";
import { parse3d } from "./src/parse-dsl.ts";
import { addExtras } from "./src/extra-elements.ts";

export const render = async (data: Data3d, config: ConfigStackedBar = {}) => {
  const id = "stacked-bar" + Math.random().toFixed(10);
  const svg = await vegaliteToSvg(getStackedBarSpec(id, data, config));
  return addExtras(id, svg, config, !config.colors);
};

export const renderFromString = (d: string) => {
  const { data, config } = parse3d(d);
  return render(data, config);
};
