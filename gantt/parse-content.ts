import type { Config, ConfigEntry, ConfigSection } from "./types.ts";
import { validateConfig } from "./validate-config.ts";

const parseDomain = (line: string): string[] | undefined => {
  const parts = line.replace("domain:", "").trim().split(",").map((d) =>
    d.trim()
  );
  if (parts.length > 1) {
    return parts;
  }
  return undefined;
};

const getSectionLabel = (line: string) => {
  const label = line.replace("section:", "").trim();
  return label === "" ? undefined : label;
};

const parseEntry = (
  line: string,
): ConfigEntry | undefined => {
  const label = line.includes(":") ? line.split(":")[0].trim() : undefined;
  const rest = label ? line.replace(`${label}:`, "").trim() : line;
  const [_start, _end] = rest.split(">");
  const start = (_start || "").trim();
  const end = (_end || _start).trim();
  if (start === "" || end === "") return undefined;
  const entry: ConfigEntry = { start, end };
  if (label && label !== "") {
    entry.label = label;
  }
  return entry;
};

export const parseContent = (content: string): Config => {
  const lines = content.split("\n").map((d) => d.trim()).filter((d) =>
    d !== ""
  );

  const sections: ConfigSection[] = [];
  let domain: string[] | undefined = undefined;
  let first = true;
  let currentSection: ConfigSection | undefined = undefined;

  for (const line of lines) {
    if (first) {
      if (line.startsWith("domain:")) {
        domain = parseDomain(line);
        continue;
      }
      first = false;
    }

    if (line.startsWith("section:")) {
      if (currentSection && currentSection.entries.length) {
        sections.push(currentSection);
      }
      currentSection = { label: getSectionLabel(line), entries: [] };
    } else {
      const entry = parseEntry(line);
      if (entry) {
        if (currentSection) {
          currentSection.entries.push(entry);
        } else {
          currentSection = { entries: [entry] };
        }
      }
    }
  }

  if (currentSection && currentSection.entries.length) {
    sections.push(currentSection);
  }

  validateConfig({ sections, domain });

  return { domain, sections };
};
