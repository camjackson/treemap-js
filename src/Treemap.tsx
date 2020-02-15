import React, { FC } from 'react';
import { TreeNode } from './buildTreeData';

enum Direction {
  HORIZONTAL,
  VERTICAL,
}

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  treeData: TreeNode;
  depth: number;
};

const paddingX = 10;
const paddingY = 20;
const textHeight = 12;
const colourClasses = [
  'text-red-400 hover:text-red-600',
  'text-orange-400 hover:text-orange-600',
  'text-yellow-400 hover:text-yellow-600',
  'text-green-400 hover:text-green-600',
  'text-blue-400 hover:text-blue-600',
  'text-purple-400 hover:text-purple-600',
  'text-pink-400 hover:text-pink-600',
];

const pickDirection = (width: number, height: number) =>
  width > height ? Direction.HORIZONTAL : Direction.VERTICAL;

const Treemap: FC<Props> = ({ x, y, width, height, treeData, depth }) => {
  const colour = colourClasses[depth % colourClasses.length];
  const direction = pickDirection(width, height);

  const widthForAllChildren = width - 2 * paddingX;
  const heightForAllChildren = height - 2 * paddingY;

  let nextChildLocation =
    direction === Direction.HORIZONTAL ? x + paddingX : y + paddingY;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        className={`stroke-black fill-current ${colour}`}
      />
      <text text-anchor="middle" x={x + width / 2} y={y + textHeight + 3}>
        {treeData.name}
      </text>
      {treeData.children &&
        treeData.children.map((child, index) => {
          const childProportion = child.size / treeData.size;
          let childX: number,
            childY: number,
            childWidth: number,
            childHeight: number;
          if (direction === Direction.HORIZONTAL) {
            childX = nextChildLocation;
            childY = y + paddingY;
            childWidth = childProportion * widthForAllChildren;
            childHeight = heightForAllChildren;
            nextChildLocation += childWidth;
          } else {
            childX = x + paddingX;
            childY = nextChildLocation;
            childWidth = widthForAllChildren;
            childHeight = childProportion * heightForAllChildren;
            nextChildLocation += childHeight;
          }

          return (
            <Treemap
              key={index}
              x={childX}
              y={childY}
              width={childWidth}
              height={childHeight}
              treeData={child}
              depth={depth + 1}
            />
          );
        })}
    </>
  );
};

export default Treemap;
