# lume plugin

Draw graphs and charts inside code blocks with [lume](https://lume.land)

[Docs and playground](https://serea.deno.dev)

in the [`_config` file](https://lume.land/docs/configuration/config-file/):

```ts
import lume from "lume/mod.ts";
import { sereaPlugin } from "https://deno.land/x/serea/lume-plugin/mod.ts";

const site = lume();

site.use(sereaPlugin);

export default site;
```

available "languages":

- `area-chart`
- `bar-chart`
- `flow-chart`
- `line-chart`
- `pie-chart`
- `sequence-diagram`
- `sheet-music`
- `multi-line-chart`
- `stacked-bar-chart`
