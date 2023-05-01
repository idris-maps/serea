export const P_FONT_SIZE = 20;
export const S_FONT_SIZE = 12;
export const S_HEIGHT = 50;
export const P_HEIGHT = 40;
export const P_SELF_RADIUS = 3;
export const STROKE_WIDTH = 2;

export interface Participant {
  key: string;
  value: string;
}

export interface Sequence {
  from: string;
  to?: string;
  label?: string;
  link?: "solid" | "dashed" | "dotted";
}

export interface SequenceDiagram {
  participants: Participant[];
  sequences: Sequence[];
}
