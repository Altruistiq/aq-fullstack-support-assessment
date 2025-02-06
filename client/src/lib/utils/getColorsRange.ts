// Note: generate colors for N countries
// start value hsla(191, 59%, 76%, 1)
// end value hsla(191, 16%, 30%, 1)

const HUE = 191;

const START_SATURATION = 59;
const END_SATURATION = 16;

const START_LIGHTNESS = 76;
const END_LIGHTNESS = 30;

export function getColorsRange(n: number): string[] {
  const colors = new Array(n).fill('').map((_, i) => {
    const saturationDiff = END_SATURATION - START_SATURATION;
    const saturation = START_SATURATION + saturationDiff * (i / (n - 1));

    const lightnessDiff = END_LIGHTNESS - START_LIGHTNESS;
    const lightness = START_LIGHTNESS + lightnessDiff * (i / (n - 1));

    return `hsla(${HUE}, ${saturation}%, ${lightness}%)`;
  });

  return colors;
}
