# markdown-wasm

https://github.com/rsms/markdown-wasm

License: [MIT](https://github.com/rsms/markdown-wasm/blob/master/LICENSE)

## How to build

```
git clone https://github.com/rsms/markdown-wasm
cd markdown-wasm
npm install
```

Add to `wasmrc.js`

```js
module({
  ...m,
  name: "markdown-custom",
  out: outdir + "/markdown.embed.js",
  embed: true,
  format: "es",
});
```

```
npm run build
```
