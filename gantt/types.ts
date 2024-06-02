export interface ConfigEntry {
  label?: string;
  start: string;
  end: string;
}

export interface ConfigSection {
  label?: string;
  entries: ConfigEntry[];
}

export interface Config {
  domain?: string[];
  sections: ConfigSection[];
}

export interface EntryPosition {
  x: number;
  width: number;
}

export type Entry = ConfigEntry & EntryPosition;

export type Section = ConfigSection & { entries: Entry[] };

export interface El {
  tag: string;
  attrs?: Record<string, string | number>;
  children?: El[];
  innerText?: string;
}

export type AddHorizontalPosition = (d: ConfigEntry) => Entry;

export interface Legend {
  labels: { label: string; x: number }[];
  verticalLines: number[];
}
