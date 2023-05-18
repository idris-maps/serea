# sheet music

```ts
import {
  renderFromString,
} from "https://deno.land/x/serea/sheet-music/mod.ts";
```

## renderFromString

```ts
const svg = renderFromString(`
X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|:D2|"Em"EB{c}BA B2 EB|~B2 AB dBAG| "D"FDAD BDAD|FDAD dAFD|
"Em"EBBA B2 EB|B2 AB defg| "D"afe^c dBAF|"Em"DEFD E2:|
|:gf|"Em"eB B2 efge|eB B2 gedB| "D"A2 FA DAFA|A2 FA defg|
"Em"eB B2 eBgB|eB B2 defg| "D"afe^c dBAF|"Em"DEFD E2:|
`);
```

returns an SVG, see the [example](./example.svg)
