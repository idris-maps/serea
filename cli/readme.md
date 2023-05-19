# serea cli

Convert a markdown file to HTML.

Uses [markdown-wasm](https://github.com/rsms/markdown-wasm) and
([serea](https://github.com/idris-maps/serea) for code blocks).

## install

```
deno install -n serea --allow-read https://deno.land/x/serea/cli/mod.ts
```

## usage

```
serea my-file.md
```

Optionally add css:

```
serea my-file.md --css style.css
```
