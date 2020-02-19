export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type OneDElement = {
  start: number;
  length: number;
};
const layOutOneDimension = (
  spaceToFill: number,
  values: number[],
  sumOfValues: number,
  offset: number,
): OneDElement[] => {
  let spaceTakenSoFar = offset;
  return values.map((value: number) => {
    const start = spaceTakenSoFar;
    const length = (value / sumOfValues) * spaceToFill;
    spaceTakenSoFar += length;

    return { start, length };
  });
};

const layOutItemsInColumn = (
  columnWidth: number,
  startX: number,
  items: OneDElement[],
): Rect[] => {
  return items.map((item: OneDElement) => {
    return {
      x: startX,
      y: item.start,
      width: columnWidth,
      height: item.length,
    };
  });
};

const layOutItemsInRow = (
  rowHeight: number,
  startY: number,
  items: OneDElement[],
): Rect[] => {
  return items.map((item: OneDElement) => ({
    x: item.start,
    y: startY,
    width: item.length,
    height: rowHeight,
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
  itemsToRowOrColumn: (_: number, __: number, ___: OneDElement[]) => Rect[],
): Rect[] => {
  const numberOfRowsOrCols = Math.floor(Math.sqrt(childSizes.length));
  const groupedSizes = groupSizes(childSizes, totalSize / numberOfRowsOrCols);

  const sumOfEachGroup = groupedSizes.map((group: number[]) => sum(group));

  // Cross-axis sizes
  return layOutOneDimension(
    crossAxisSpaceForAllGroups,
    sumOfEachGroup,
    totalSize,
    crossAxisOffset,
  )
    .map((outerItem: OneDElement, index: number) => {
      // Main axis sizes
      const innerItems = layOutOneDimension(
        mainAxisSpaceForEachGroup,
        groupedSizes[index],
        sumOfEachGroup[index],
        mainAxisOffset,
      );
      return itemsToRowOrColumn(outerItem.length, outerItem.start, innerItems);
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
      layOutItemsInColumn,
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
      layOutItemsInRow,
    );
  }
};

export default layoutRects;
