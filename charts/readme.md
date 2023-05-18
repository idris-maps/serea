# charts

## area chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/area-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  xLabel: string;
  yLabel: string;
  rows: [x: string, y: number][];
}

interface Config {
  background?: string;
  color?: string;
  description?: string;
  height?: number;
  legendColor?: string;
  temporal?: boolean;
  width?: number;
  xLabelAngle?: number;
  yLabelAngle?: number;
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400
temporal: true

Date,Price
2000-01-01,28
2000-02-01,55
2000-03-01,43
2000-05-01,91
`);
```

## bar chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/bar-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  xLabel: string;
  yLabel: string;
  rows: [x: string, y: number][];
}

interface Config {
  background?: string;
  color?: string;
  description?: string;
  height?: number;
  legendColor?: string;
  width?: number;
  xLabelAngle?: number;
  yLabelAngle?: number;
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400
xLabelAngle: 45

Fruit,Amount
Apples,28
Blackberries,55
Cherries,43
Dates,91
`);
```

## line chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/line-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  xLabel: string;
  yLabel: string;
  rows: [x: string, y: number][];
}

interface Config {
  background?: string;
  color?: string;
  description?: string;
  height?: number;
  legendColor?: string;
  temporal?: boolean;
  width?: number;
  xLabelAngle?: number;
  yLabelAngle?: number;
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400
temporal: true

Date,Price
2000-01-01,28
2000-02-01,55
2000-03-01,43
2000-05-01,91
`);
```

## multi line chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/multi-line-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  xLabel: string;
  yLabel: string;
  categoryLabel: string;
  rows: [x: string, y: number, category: string][];
}

interface Config {
  description?: string;
  background?: string;
  legendColor?: string;
  width?: number;
  height?: number;
  temporal?: boolean;
  colors?: string[];
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400
temporal: true

Date,Price,Fruit
2000-01-01,28,Apples
2000-02-01,55,Apples
2000-03-01,43,Apples
2000-05-01,91,Apples
2000-01-01,68,Blackberries
2000-02-01,45,Blackberries
2000-03-01,53,Blackberries
2000-05-01,72,Blackberries
2000-01-01,18,Cherries
2000-02-01,25,Cherries
2000-03-01,33,Cherries
2000-05-01,61,Cherries
`);
```

## pie chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/pie-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  categoryLabel: string;
  valueLabel: string;
  rows: [category: string, value: number][];
}

interface Config {
  background?: string;
  colors?: string[];
  description?: string;
  height?: number;
  legendColor?: string;
  outlineColor?: string;
  width?: number;
  xLabelAngle?: number;
  yLabelAngle?: number;
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400

Fruit,Amount
Apples,28
Blackberries,55
Cherries,43
Dates,91
`);
```

## stacked bar chart

```ts
import {
  render,
  renderFromString,
} from "https://deno.land/x/serea/charts/stacked-bar-chart.ts";
```

### render

takes 2 arguments `data` and `config`. the latter is optional

```ts
interface Data {
  xLabel: string;
  yLabel: string;
  categoryLabel: string;
  rows: [x: string, y: number, category: string][];
}

interface Config {
  background?: string;
  colors?: string[];
  description?: string;
  height?: number;
  legendColor?: string;
  outlineColor?: string;
  width?: number;
  xLabelAngle?: number;
  yLabelAngle?: number;
}
```

### renderFromString

```ts
const html = renderFromString(`
width: 400
xLabelAngle: 45

Country,Production,Fruit
Algeria,28,Apples
Benin,55,Apples
Cuba,43,Apples
Dominican Rep.,91,Apples
Algeria,68,Blackberries
Benin,45,Blackberries
Cuba,53,Blackberries
Dominican Rep.,72,Blackberries
Algeria,18,Cherries
Benin,25,Cherries
Cuba,33,Cherries
Dominican Rep.,61,Cherries
`);
```
