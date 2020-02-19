export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RectSingleDimension = {
  rectStart: number;
  rectSize: number;
};
const calculateRectScales = (
  spaceToTakeUp: number, // width or height
  totalSize: number,
  sizes: number[],
  overallStart: number, // startX or startY
): RectSingleDimension[] => {
  let sizeSoFar = overallStart;
  return sizes.map((size: number) => {
    const rectStart = sizeSoFar;
    const rectSize = spaceToTakeUp * (size / totalSize);
    sizeSoFar += rectSize;

    return { rectStart, rectSize };
  });
};

const layoutSingleColumn = (
  width: number,
  startX: number,
  rectScales: RectSingleDimension[],
): Rect[] => {
  return rectScales.map((rectScale: RectSingleDimension) => {
    return {
      x: startX,
      y: rectScale.rectStart,
      width,
      height: rectScale.rectSize,
    };
  });
};

const layoutSingleRow = (
  height: number,
  startY: number,
  rectScales: RectSingleDimension[],
): Rect[] => {
  return rectScales.map((rectScale: RectSingleDimension) => ({
    x: rectScale.rectStart,
    y: startY,
    width: rectScale.rectSize,
    height,
  }));
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

const layoutRowsOrColumns = (
  totalSize: number,
  childSizes: number[],
  mainAxisOffset: number,
  crossAxisOffset: number,
  mainAxisSpaceForEachGroup: number,
  crossAxisSpaceForAllGroups: number,
  childLayoutFn: (_, __, ___) => Rect[],
) => {
  const numberOfRowsOrCols = Math.floor(Math.sqrt(childSizes.length));
  const groupedSizes = groupSizes(childSizes, totalSize / numberOfRowsOrCols);

  let crossAxisLocation = crossAxisOffset;
  return groupedSizes
    .map((groupOfSizes: number[]) => {
      const groupSize = sum(groupOfSizes);
      const scaledSize = crossAxisSpaceForAllGroups * (groupSize / totalSize);
      const groupLocation = crossAxisLocation;
      crossAxisLocation += scaledSize;

      const rectScales = calculateRectScales(
        mainAxisSpaceForEachGroup,
        groupSize,
        groupOfSizes,
        mainAxisOffset,
      );
      return childLayoutFn(scaledSize, groupLocation, rectScales);
    })
    .flat();
};

const layoutRects = (
  width: number,
  height: number,
  totalSize: number,
  childSizes: number[],
  paddingX: number = 10,
  paddingY: number = 20,
  ROW_BIAS: number = 1.5,
): Rect[] => {
  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingY * 2;

  if (width > height * ROW_BIAS) {
    // lay out in columns: main axis is Y, cross axis is X
    return layoutRowsOrColumns(
      totalSize,
      childSizes,
      paddingY,
      paddingX,
      availableHeight,
      availableWidth,
      layoutSingleColumn,
    );
  } else {
    // lay out in rows: main axis is X, cross axis is Y
    return layoutRowsOrColumns(
      totalSize,
      childSizes,
      paddingX,
      paddingY,
      availableWidth,
      availableHeight,
      layoutSingleRow,
    );
  }
};

export default layoutRects;
