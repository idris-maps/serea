import type { Participant, Sequence, SequenceDiagram } from "./config.ts";

const isUndefinedOr = <T>(check: (d: unknown) => d is T, d: unknown): d is T =>
  typeof d === "undefined" || check(d);

const isString = (d: unknown): d is string => Boolean(d) && String(d) === d;

const isLink = (d: unknown): d is "solid" | "dashed" | "dotted" =>
  isString(d) && ["solid", "dashed", "dotted"].includes(d);

const isRecord = (d: unknown): d is Record<string, unknown> =>
  Boolean(d) &&
  typeof d === "object" &&
  // @ts-ignore ?
  Object.keys(d).every(isString);

const isParticipant = (d: unknown): d is Participant =>
  isRecord(d) &&
  isString(d.key) &&
  isString(d.value);

const isSequence = (d: unknown): d is Sequence =>
  isRecord(d) &&
  isString(d.from) &&
  isUndefinedOr(isString, d.to) &&
  isUndefinedOr(isString, d.label) &&
  isUndefinedOr(isLink, d.link);

const err = (msg: string) => new Error("Invalid SequenceDiagram: " + msg);

const isSequenceDiagram = (d: unknown): d is SequenceDiagram => {
  if (!isRecord(d)) {
    throw err("must be an object");
  }

  if (!Array.isArray(d.participants)) {
    throw err('"partcipants" must be an array');
  }

  if (!d.participants.length) {
    throw err('"participants" list is empty');
  }

  const participantErrors = (d.participants as unknown[]).filter((d) =>
    !isParticipant(d)
  );
  if (participantErrors.length) {
    throw err(
      `invalid "participants"\n${
        participantErrors.map((d) => JSON.stringify(d)).join("\n")
      }`,
    );
  }

  if (!Array.isArray(d.sequences)) {
    throw err('"sequences" must be an array');
  }

  if (!d.sequences.length) {
    throw err('"sequences" list is empty');
  }

  const sequenceErrors = (d.sequences as unknown[]).filter((d) =>
    !isSequence(d)
  );
  if (sequenceErrors.length) {
    throw err(
      `invalid sequences\n${
        sequenceErrors.map((d) => JSON.stringify(d)).join("\n")
      }`,
    );
  }

  return true;
};

const participantKeysAreUnique = (participants: Participant[]) => {
  const keys = participants.map((d) => d.key);
  if (keys.length !== Array.from(new Set(keys)).length) {
    throw err("participant keys must be unique");
  }
  return true;
};

const allSequencesCorrespondToParticipant = (
  { participants, sequences }: SequenceDiagram,
) => {
  const keys = participants.map((d) => d.key);
  const errors: string[] = [];
  sequences.forEach((d, i) => {
    if (!keys.includes(d.from)) {
      errors.push(
        `"from" (${d.from}) in sequence ${i} is not a participant key`,
      );
    }
    if (d.to && !keys.includes(d.to)) {
      errors.push(`"to" (${d.to}) in sequence ${i} is not a participant key`);
    }
  });
  if (errors.length) {
    throw err(errors.join("\n"));
  }
  return true;
};

export const isValidSequenceDiagram = (d: unknown): d is SequenceDiagram =>
  isSequenceDiagram(d) &&
  participantKeysAreUnique(d.participants) &&
  allSequencesCorrespondToParticipant(d);
