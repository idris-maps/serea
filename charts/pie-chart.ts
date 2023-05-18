import { ConfigPie, DataPie } from "./src/types.d.ts";
import { getPieSpec } from "./src/spec.ts";
import { vegaliteToSvg } from "./vendor/mod.ts";
import { parsePie } from "./src/parse-dsl.ts";
import { getFillDefsSvg } from "./src/extra-elements.ts";

export const render = async (data: DataPie, config: ConfigPie) => {
  const id = crypto.randomUUID();
  const svg = await vegaliteToSvg(getPieSpec(id, data, config));
  return config.colors ? svg : getFillDefsSvg(id) + svg;
};

export const renderFromString = (d: string) => {
  const { data, config } = parsePie(d);
  return render(data, config);
};
