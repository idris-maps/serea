import { default as abcToSvg } from "./abc.js";

/**
 * @param {string} abc music notation https://paulrosen.github.io/abcjs/overview/abc-notation.html
 * @returns {Promise<string>} svg string
 */
export default (abc: string): Promise<string> => abcToSvg(abc);
