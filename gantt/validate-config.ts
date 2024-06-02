import { isValidDate } from "./utils.ts";
import type { Config } from "./types.ts";

const ERROR = {
  noEntries: "Could not read any entries",
  invalidEntries: (section: string | number) =>
    `section "${section}" has no valid entries`,
  notInDomain: (
    section: string | number,
    entry: string | number,
    dir: string | number,
    value: string | number,
  ) =>
    `"${value}" as ${dir} of "${entry}" in section "${section}" is not in domain`,
  notDate: (
    section: string | number,
    entry: string | number,
    dir: string | number,
    value: string | number,
  ) =>
    `"${value}" as ${dir} of "${entry}" in section "${section}" is not a valid date`,
  notUniqDomains: '"domain" must have unique values',
};

const isArray = (d: unknown) => Array.isArray(d);

export const validateConfig = ({ domain, sections }: Config) => {
  if (!isArray(sections) || !sections.length) throw new Error(ERROR.noEntries);
  sections.forEach(({ entries, label: sectionLabel }, sectionIndex) => {
    const section = sectionLabel || sectionIndex;
    if (!isArray(entries) || !entries.length) {
      throw new Error(ERROR.invalidEntries(section));
    }
    entries.forEach(({ start, end, label: entryLabel }, entryIndex) => {
      const entry = entryLabel || entryIndex;
      if (domain) {
        if (!domain.includes(start)) {
          throw new Error(ERROR.notInDomain(section, entry, "start", start));
        }
        if (!domain.includes(end)) {
          throw new Error(ERROR.notInDomain(section, entry, "end", end));
        }
        if (domain.length !== new Set(domain).size) {
          throw new Error(ERROR.notUniqDomains);
        }
      } else {
        if (!isValidDate(start)) {
          throw new Error(ERROR.notDate(section, entry, "start", start));
        }
        if (!isValidDate(end)) {
          throw new Error(ERROR.notDate(section, entry, "end", end));
        }
      }
    });
  });
};
