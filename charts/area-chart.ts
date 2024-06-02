import { Config2d, Data2d } from "./src/types.d.ts";
import { get2dSpec } from "./src/spec.ts";
import { vegaliteToSvg } from "./vendor/mod.ts";
import { parse2d } from "./src/parse-dsl.ts";
import { addExtras } from "./src/extra-elements.ts";

export const render = async (data: Data2d, config: Config2d = {}) => {
  const svg = await vegaliteToSvg(get2dSpec("area-chart", data, config));
  const id = "area-" + Math.random().toFixed(10);
  return addExtras(id, svg, config);
};

export const renderFromString = (d: string) => {
  const { data, config } = parse2d(d);
  return render(data, config);
};
