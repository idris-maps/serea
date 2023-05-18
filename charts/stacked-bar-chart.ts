import { ConfigStackedBar, Data3d } from "./src/types.d.ts";
import { getStackedBarSpec } from "./src/spec.ts";
import { vegaliteToSvg } from "./vendor/mod.ts";
import { parse3d } from "./src/parse-dsl.ts";
import { getFillDefsSvg, setBorderStyle } from "./src/extra-elements.ts";

export const render = async (data: Data3d, config: ConfigStackedBar) => {
  const id = crypto.randomUUID();
  const svg = await vegaliteToSvg(getStackedBarSpec(id, data, config));
  const _svg = config.background ? svg : setBorderStyle(id, svg);
  return config.colors ? _svg : getFillDefsSvg(id) + _svg;
};

export const renderString = (d: string) => {
  const { data, config } = parse3d(d);
  return render(data, config);
};
