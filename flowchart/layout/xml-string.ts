interface Attributes {
  [key: string]: string | number | boolean;
}

const stringifyAttributes = (attributes: Attributes): string =>
  Object.keys(attributes)
    .map((key) => ` ${key}="${String(attributes[key])}"`)
    .join("");

export class Element {
  tag: string;
  constructor(tag: string) {
    this.tag = tag;
  }

  private children: Element[] = [];
  public child(tag: string): Element {
    const child = new Element(tag);
    this.children.push(child);
    return child;
  }

  private attributes: Attributes = {};
  public attr(newAttributes: Attributes): Element {
    const previousAttributes = this.attributes;
    this.attributes = {
      ...previousAttributes,
      ...newAttributes,
    };
    return this;
  }

  private innerText = "";
  public data(innerText: string): Element {
    this.innerText = innerText;
    return this;
  }

  public outer(): string {
    return `<${this.tag}${
      stringifyAttributes(this.attributes)
    }>${this.inner()}</${this.tag}>`;
  }

  public inner(): string {
    return this.children.length > 0
      ? this.children
        .map((child) => child.outer())
        .join("")
      : this.innerText;
  }
}

export const xml = (tag: string) => new Element(tag);
