export const radToDeg = (value: number) => value * 180 / Math.PI;

export const round = (num: number, decimalPlaces: number): number => {
  const factor = 10 ** decimalPlaces;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

export const roundAndFormat = (num: number, decimalPlaces: number): string =>
  num.toFixed(decimalPlaces);

export const floor = (num: number, decimalPlaces: number): number => {
  const factor = 10 ** decimalPlaces;
  return Math.floor(num * factor + Number.EPSILON) / factor;
};

export const ceil = (num: number, decimalPlaces: number): number => {
  const factor = 10 ** decimalPlaces;
  return Math.ceil(num * factor - Number.EPSILON) / factor;
};
