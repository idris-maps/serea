import { getCss } from "./get-css.ts";

const readDir = async (path: string) => {
  const dir = Deno.readDir(path);

  const dirs: string[] = [];
  const files: string[] = [];
  for await (const file of dir) {
    if (file.isDirectory) dirs.push(path + "/" + file.name);
    if (file.isFile) files.push(path + "/" + file.name);
  }

  const childDirs = await Promise.all(dirs.map(readDir));
  const childFiles = childDirs
    .map((d) => d.files)
    .reduce((r, d) => {
      d.forEach((file) => r.push(file));
      return r;
    }, []);

  const all: string[] = [...files, ...childFiles];

  return { files: all, dirs };
};

const normalizePath = (path: string) => {
  const parts = path.split("/");
  parts.shift();
  return parts.join("/");
};

const readDirDeep = async (path = ".") => {
  const { files } = await readDir(path);
  return files.map(normalizePath);
};

const getAllMdFiles = async () => {
  const allFiles = await readDirDeep();
  return allFiles.filter((d) => d.endsWith(".md")).sort();
};

const init = <T>(arr: T[]) => arr.slice(0, -1);
const last = <T>(arr: T[]) => arr[arr.length - 1];

interface DirTree {
  path: string;
  dirs: DirTree[];
  files: string[];
}

const listToTree = (files: string[]) => {
  const tree: DirTree = {
    path: "root",
    dirs: [],
    files: [],
  };

  const add = (path: string[], filename: string, tree: DirTree) => {
    if (!path.length) {
      tree.files.push(filename);
      return tree;
    }
    const [current, ...rest] = path;
    const exists = tree.dirs.find((d) => d.path === current) || {
      path: current,
      dirs: [],
      files: [],
    };

    const others = tree.dirs.filter((d) => d.path !== current);
    tree.dirs = others;
    tree.dirs.push(add(rest, filename, exists));

    return tree;
  };

  return files.reduce((r: DirTree, file: string): DirTree => {
    const parts = file.split("/");
    return add(init(parts), last(parts), r);
  }, tree);
};

const renderTree = (path: string, dirs: DirTree[], files: string[]): string =>
  [
    '<ul style="margin:0;padding:0;margin-left:1em">',
    ...files.map((d) =>
      `<a href="${
        path + "/" + d.slice(0, -3)
      }"><li style="list-style-type: none; margin-left: 1em">/${
        d.slice(0, -3)
      }</li></a>`
    ),
    "</ul>",
    ...dirs.map((d) =>
      `<details style="margin-left:1em" open><summary>/${d.path}</summary>${
        renderTree(path + "/" + d.path, d.dirs, d.files)
      }</details>`
    ),
  ].join("");

export const renderIndex = async () => {
  const files = await getAllMdFiles();
  const style = await getCss();

  let main = "<h1>No markdown files found</h1><p>Create one</p>";

  if (files.length) {
    const tree = listToTree(files);
    main = [
      "<h1>Pages</h1>",
      renderTree("", tree.dirs, tree.files),
    ].join("");
  }

  const parts = [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<style>${style}</style>`,
    "<title>Index</title>",
    "</head>",
    "<body>",
    "<main>",
    main,
    "</main>",
    "</body>",
    "</html>",
  ].join("");

  return parts;
};
