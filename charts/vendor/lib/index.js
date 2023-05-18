// deno-lint-ignore-file
// deno-fmt-ignore-file

import { View, parse } from 'vega'
import { compile } from 'vega-lite'

export const renderVega = async json => {
  const view = new View(parse(json))
  return await view.toSVG()
}

export const renderVegalite = async json => {
  const { spec } = compile(json)
  return renderVega(spec)
}
