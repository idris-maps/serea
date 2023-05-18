import { ConfigMultiLine, Data3d } from "./src/types.d.ts";
import { getMultiLineSpec } from "./src/spec.ts";
import { vegaliteToSvg } from "./vendor/mod.ts";
import { parse3d } from "./src/parse-dsl.ts";
import { setBorderStyle } from "./src/extra-elements.ts";

export const render = async (data: Data3d, config: ConfigMultiLine) => {
  const id = crypto.randomUUID();
  const svg = await vegaliteToSvg(getMultiLineSpec(data, config));
  return config.background ? svg : setBorderStyle(id, svg);
};

export const renderString = (d: string) => {
  const { data, config } = parse3d(d);
  return render(data, config);
};
