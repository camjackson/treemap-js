export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getNumberOfRows = number => {
  return Math.floor(Math.sqrt(number));
};

const layoutSingleRow = (
  width: number,
  height: number,
  totalSize: number,
  sizes: number[],
  startX: number,
  startY: number,
): Rect[] => {
  let widthSoFar = startX;
  return sizes.map((size: number) => {
    const x = widthSoFar;
    const childWidth = width * (size / totalSize);
    widthSoFar += childWidth;
    return {
      x: x,
      y: startY,
      width: childWidth,
      height: height,
    };
  });
};

const sum = (numbers: number[]) =>
  numbers.reduce((result, number) => result + number, 0);

const groupSizes = (sizes: number[], minGroupSize: number): number[][] => {
  return sizes.reduce(
    (result: any[][], size: number) => {
      const currentGroup = result[result.length - 1];
      if (sum(currentGroup) < minGroupSize) {
        currentGroup.push(size);
      } else {
        result.push([size]);
      }
      return result;
    },
    [[]],
  );
};

const layoutRects = (
  width: number,
  height: number,
  totalSize: number,
  childSizes: number[],
  paddingX: number = 10,
  paddingY: number = 20,
): Rect[] => {
  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingY * 2;

  const numberOfRows = getNumberOfRows(childSizes.length);
  const groupedSizes = groupSizes(childSizes, totalSize / numberOfRows);

  let currentY = paddingY;

  return groupedSizes
    .map((rowOfSizes: number[]) => {
      const rowSize = sum(rowOfSizes);
      const rowHeight = availableHeight * (rowSize / totalSize);
      const rowY = currentY;
      currentY += rowHeight;

      return layoutSingleRow(
        availableWidth,
        rowHeight,
        rowSize,
        rowOfSizes,
        paddingX,
        rowY,
      );
    })
    .flat();
};

export default layoutRects;
