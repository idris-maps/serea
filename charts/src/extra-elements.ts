import { DOMParser, Element, HTMLDocument } from "../deps.ts";
import { Config } from "./types.d.ts";

const getFillDefsSvg = (id: string) =>
  [
    "<defs>",
    `<pattern id="${id}-fill-0" patternUnits="userSpaceOnUse" width="5" height="5"><path d="M 0,5 l 5,-5 M -1.25,1.25 l 2.5,-2.5 M 3.75,6.25 l 2.5,-2.5" stroke-width="2" shape-rendering="auto" stroke="currentColor" stroke-linecap="square"></path></pattern>`,
    `<pattern id="${id}-fill-1" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="3.5" cy="3.5" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="0" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="7" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="7" cy="0" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="7" cy="7" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
    `<pattern id="${id}-fill-2" patternUnits="userSpaceOnUse" width="8" height="8"><path d="M 0,0 l 8,8 M -2,6 l 4,4 M 6,-2 l 4,4" stroke-width="2" shape-rendering="auto" stroke="currentColor" stroke-linecap="square"></path></pattern>`,
    `<pattern id="${id}-fill-3" patternUnits="userSpaceOnUse" width="6" height="6"><circle cx="3" cy="3" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="0" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="0" cy="6" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="6" cy="0" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle><circle cx="6" cy="6" r="2" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
    `<pattern id="${id}-fill-4" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="3.5" cy="3.5" r="1" fill="currentColor" stroke="currentColor" stroke-width="0"></circle></pattern>`,
    `<pattern id="${id}-fill-5" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M 0 3 c 0.75 -1.5 , 2.25 -1.5 , 3 0 c 0.75 1.5 , 2.25 1.5 , 3 0 M -3 3 c 0.75 1.5 , 2.25 1.5 , 3 0 M 6 3 c 0.75 -1.5 , 2.25 -1.5 , 3 0" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="square" shape-rendering="auto"></path></pattern>`,
    "</defs>",
  ].join("");

const parseSvg = (svg: string) => {
  try {
    return new DOMParser().parseFromString(svg, 'text/html');
  } catch {
    return null
  }
}


const setBorderStroke = (doc: HTMLDocument, config: Config) => {
  if (config.background) { return doc }
  for (const el of doc.querySelectorAll('.background')) {
    const bg = el as Element
    if (bg.getAttribute('stroke')) {
      bg.setAttribute('stroke', 'none')
    }
  }
  return doc
}

const fixSvgElement = (id: string, doc: HTMLDocument) => {
  const svg = doc.querySelector('svg')
  if (svg) {
    svg.setAttribute('id', id)
    svg.removeAttribute('width')
    svg.removeAttribute('height')
  }
  return doc
}

export const addExtras = (id: string, svg: string, config: Config, addPatterns?: boolean) => {
  const doc = parseSvg(svg)
  if (!doc) { return svg }
  const fixed = setBorderStroke(fixSvgElement(id, doc), config)
  const fixedSvg = fixed.querySelector('svg')

  if (!fixedSvg) {
    return svg
  }
  
  // hacks because DomParser does not support SVG yet
  // in HTML attributes such as "patternUnits" and "viewBox" are lower case

  const svgString = fixedSvg.outerHTML.replace('viewbox', 'viewBox')

  if (!addPatterns) {
    return svgString
  }

  const [_svg] = svgString.split('</svg>')
  return _svg + getFillDefsSvg(id) + '</svg>'
}
