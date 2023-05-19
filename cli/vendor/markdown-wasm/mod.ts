import { parse, ready } from "./markdown.embed.js";

export type Source = string | ArrayLike<number>;

export interface ParseOptions {
  parseFlags?: ParseFlags;
  format?: "html" | "xhtml";
  bytes?: boolean;
  allowJSURIs?: boolean;
  onCodeBlock?: (
    langname: string,
    body: Uint8Array,
  ) => Uint8Array | string | null | undefined;
}

export enum ParseFlags {
  /** In TEXT, collapse non-trivial whitespace into single ' ' */ COLLAPSE_WHITESPACE,
  /** Enable $ and $$ containing LaTeX equations. */ LATEX_MATH_SPANS,
  /** Disable raw HTML blocks. */ NO_HTML_BLOCKS,
  /** Disable raw HTML (inline). */ NO_HTML_SPANS,
  /** Disable indented code blocks. (Only fenced code works.) */ NO_INDENTED_CODE_BLOCKS,
  /** Do not require space in ATX headers ( ###header ) */ PERMISSIVE_ATX_HEADERS,
  /** Recognize e-mails as links even without <...> */ PERMISSIVE_EMAIL_AUTO_LINKS,
  /** Recognize URLs as links even without <...> */ PERMISSIVE_URL_AUTO_LINKS,
  /** Enable WWW autolinks (without proto; just 'www.') */ PERMISSIVE_WWW_AUTOLINKS,
  /** Enable strikethrough extension. */ STRIKETHROUGH,
  /** Enable tables extension. */ TABLES,
  /** Enable task list extension. */ TASK_LISTS,
  /** Enable wiki links extension. */ WIKI_LINKS,
  /** Enable underline extension (disables '_' for emphasis) */ UNDERLINE,

  /** Default flags are:
   *    COLLAPSE_WHITESPACE |
   *    PERMISSIVE_ATX_HEADERS |
   *    PERMISSIVE_URL_AUTO_LINKS |
   *    STRIKETHROUGH |
   *    TABLES |
   *    TASK_LISTS
   */
  DEFAULT,

  /** Shorthand for NO_HTML_BLOCKS | NO_HTML_SPANS */
  NO_HTML,
}

export const toString = async (
  s: Source,
  o?: ParseOptions,
): Promise<string> => {
  await ready;
  return parse(s, { ...(o || {}), bytes: false });
};

export const toUint8Array = async (
  s: Source,
  o?: ParseOptions,
): Promise<Uint8Array> => {
  await ready;
  return parse(s, { ...(o || {}), bytes: true });
};
