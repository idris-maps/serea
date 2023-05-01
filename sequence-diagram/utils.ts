import type { SequenceDiagram } from "./config.ts";
import { P_FONT_SIZE, S_FONT_SIZE } from "./config.ts";

export const getLabelWidth = (fontSize: number, label = "") =>
  label.length * fontSize * 0.6 + fontSize;

export const getParticipantIndex = (
  participants: SequenceDiagram["participants"],
) => {
  const keys = participants.map((d) => d.key);
  return (key: string) => {
    const index = keys.indexOf(key);
    if (index === -1) throw new Error(`participant key ${key} does not exist`);
    return index;
  };
};

const maxParticipantDistance = ({ participants }: SequenceDiagram) =>
  Math.max(...participants.map((d) => getLabelWidth(P_FONT_SIZE, d.value)));

const maxSequenceDistance = ({ participants, sequences }: SequenceDiagram) => {
  let maxWidth = 0;
  const getIndex = getParticipantIndex(participants);
  sequences.forEach((seq) => {
    const width = getLabelWidth(S_FONT_SIZE, seq.label);
    const fromI = getIndex(seq.from);
    if (seq.to) {
      const toI = getIndex(seq.to);
      const dist = Math.abs(fromI - toI);
      if (width / dist > maxWidth) maxWidth = width / dist;
    } else {
      if (width / 2 > maxWidth) maxWidth = width / 2;
    }
  });
  return maxWidth;
};

export const getXDistance = (d: SequenceDiagram) =>
  Math.max(
    maxParticipantDistance(d),
    maxSequenceDistance(d),
  );
