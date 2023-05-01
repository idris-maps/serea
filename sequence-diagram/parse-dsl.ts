import type { Sequence, SequenceDiagram } from "./config.ts";

const links: Record<string, Sequence["link"]> = {
  "->": "solid",
  "..>": "dotted",
  "-->": "dashed",
};

type G<T> = Generator<T, void, unknown>;

const readLines = function* (d: string) {
  for (const line of d.split("\n")) {
    const l = line.trim();
    if (l !== "") {
      yield l;
    }
  }
};

const removeComments = function* (g: G<string>) {
  for (const line of g) {
    if (!line.startsWith("# ")) {
      yield line;
    }
  }
};

const getLink = (d: string) => {
  const values = Object.entries(links).sort((a, b) =>
    a[0].length > b[0].length ? -1 : 1
  );
  return values.find(([link]) => d.includes(link)) || [];
};

const getParticipant = (d: string) => {
  if (d.includes("[") && d.includes("]") && d.indexOf("[") < d.indexOf("]")) {
    const [key, v] = d.split("[");
    const [value] = v.split("]");
    const tKey = key.trim();
    const tValue = value.trim();
    if (tKey !== "" && tValue !== "") {
      return { key: tKey, value: tValue };
    }
  }
  return { key: d.trim() };
};

const parseLine = function* (g: G<string>) {
  for (const line of g) {
    const [seq, label] = line.split(":");
    const [symbol, link] = getLink(seq);
    if (symbol) {
      const [f, t] = seq.split(symbol);
      yield {
        from: getParticipant(f),
        to: getParticipant(t),
        link,
        label,
      };
    } else {
      yield {
        from: getParticipant(seq),
        label,
      };
    }
  }
};

export const parseDsl = (d: string): SequenceDiagram => {
  const participantMap = new Map<string, string>();
  const sequences: Sequence[] = [];

  const lines = parseLine(removeComments(readLines(d)));
  for (const d of lines) {
    if (d.from.value) {
      participantMap.set(d.from.key, d.from.value);
    } else {
      if (!participantMap.get(d.from.key)) {
        participantMap.set(d.from.key, d.from.key);
      }
    }
    if (d.to) {
      if (d.to.value) {
        participantMap.set(d.to.key, d.to.value);
      } else {
        if (!participantMap.get(d.to.key)) {
          participantMap.set(d.to.key, d.to.key);
        }
      }
    }
    sequences.push({
      from: d.from.key,
      to: d?.to?.key,
      link: d.link,
      label: d.label,
    });
  }

  const participants = Array.from(participantMap.entries())
    .map(([key, value]) => ({ key, value }));

  return { participants, sequences };
};
