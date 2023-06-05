# Serea cli

Convert a markdown to HTML.

Uses [markdown-wasm](https://github.com/rsms/markdown-wasm) and
[serea](https://github.com/idris-maps/serea) for code blocks.

## Install

```
deno install -n serea --allow-read --allow-net https://deno.land/x/serea/cli/mod.ts
```

- `--allow-read` to read the markdown files
- `--allow-net` for when serving a folder (see below)

## Convert a single markdown file to HTML

```
serea my-file.md > my-file.html
```

Optionally add css from your own file (there is basic styling by default):

```
serea my-file.md --css=my-style.css > my-file.html
```

## Serve a directory of markdown files

In the directory, run

```
serea serve
```

Optionally add css from your own file with `--css=my-style.css`.

Set the port with `--port=8888`, defaults to `3000`
