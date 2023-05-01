# flowchart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/anders/flowchart/mod.ts";
```

Both examples below return the same SVG, see the [example](./example.svg)

## render

```ts
const svg = render({
  rankdir: "LR",
  nodes: [
    { id: "A", label: "Alice" },
    { id: "B", label: "Bob" },
    { id: "C", label: "Cecile" },
  ],
  edges: [
    { from: "A", to: "B", type: "->" },
    { from: "C", to: "A", type: "-->" },
    { from: "B", to: "C", type: ".." },
  ],
});
```

## renderFromString

```ts
const svg = renderFromString(`
dir: LR
A[Alice] -> B[Bob]
C[Cecile] --> A
B .. C
`);
```
