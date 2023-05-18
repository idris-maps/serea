# sequence diagram

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/sequence-diagram/mod.ts";
```

Both examples below return the same SVG, see the [example](./example.svg)

## render

```ts
const svg = render({
  participants: [
    { key: "A", value: "Alice" },
    { key: "B", value: "Bob" },
    { key: "C", value: "Cecile" },
  ],
  sequences: [
    { from: "A", to: "B", link: "solid", label: " Hello Bob!" },
    { from: "B", label: " Who is this?" },
    { from: "B", to: "A", link: "dashed", label: " Hello stranger" },
    { from: "C", to: "B", link: "dotted", label: " It's Alice" },
  ],
});
```

## renderFromString

```ts
const svg = renderFromString(`
A[Alice] -> B[Bob]: Hello Bob!
B: Who is this?
B --> A: Hello stranger
C[Cecile] ..> B: It's Alice
`);
```
