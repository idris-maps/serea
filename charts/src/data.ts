import { Data, Data2d, Data3d, DataPie } from "./types.d.ts";

const is3dData = (d: Data): d is Data3d => Object.keys(d).includes("zLabel");

const isPieData = (d: Data): d is DataPie =>
  Object.keys(d).includes("categoryLabel");

export const format2dData = ({ rows }: Data2d) => ({
  values: rows.map(([x, y]) => ({ x, y })),
});

export const format3dData = ({ rows }: Data3d) => ({
  values: rows.map(([x, y, category]) => ({ x, y, category })),
});

export const formatPieData = ({ rows }: DataPie) => ({
  values: rows.map(([category, value]) => ({ category, value })),
});

export const formatData = (data: Data) =>
  is3dData(data)
    ? format3dData(data)
    : isPieData(data)
    ? formatPieData(data)
    : format2dData(data);
