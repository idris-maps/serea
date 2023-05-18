// deno-fmt-ignore-file

const { parseHTML } = require('linkedom')
const renderAbc = require('abcjs/src/api/abc_tunebook_svg')

const toSvg = async abc => {
  const html = '<!DOCTYPE html>\n<html><body><div id="sheet"></div></body></html>'
  const { document } = parseHTML(html)
  const el = document.getElementById('sheet')

  globalThis.document = document
  await renderAbc(el, abc)

  const svg = el.getElementsByTagName('svg')[0]
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const viewBox = `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`
  svg.setAttribute('viewBox', viewBox)
  svg.removeAttribute('height')
  svg.removeAttribute('width')
  svg.removeAttribute('style')

  const style = svg.getElementsByTagName('style')[0]
  if (style) {
    svg.removeChild(style)
  }

  return svg.outerHTML
}

module.exports = toSvg