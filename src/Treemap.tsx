import React, { FC, useRef, useState, useLayoutEffect, Dispatch } from 'react';
import { Action } from './state';
import { TreeNode } from './buildTreeData';
import layoutRects, { Rect } from './layerOuterer';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  treeData: TreeNode;
  depth: number;
  isCurrentRoot: boolean;
  hoveredNode: TreeNode;
  setHoveredNode: (node: TreeNode) => void;
  dispatch: Dispatch<Action>;
};

const paddingX = 10;
const paddingY = 20;
const textHeight = 12;
const colourClasses = [
  'text-red-400',
  'text-orange-400',
  'text-yellow-400',
  'text-green-400',
  'text-blue-400',
  'text-purple-400',
  'text-pink-400',
];
const hoverColourClasses = [
  'text-red-600',
  'text-orange-600',
  'text-yellow-600',
  'text-green-600',
  'text-blue-600',
  'text-purple-600',
  'text-pink-600',
];

const Treemap: FC<Props> = ({
  x,
  y,
  width,
  height,
  treeData,
  depth,
  isCurrentRoot,
  hoveredNode,
  setHoveredNode,
  dispatch,
}) => {
  const textRef = useRef(null);
  const [showText, setShowText] = useState(true);
  useLayoutEffect(() => {
    const textWidth = textRef.current.getBoundingClientRect().width;
    setShowText(height > 19 && width > textWidth);
  }, [width, height, textRef]);

  // Have to do this manually with JavaScript so that we can activate the hover
  // colour when the text in front of the rect is being hovered :(
  const isHovered = hoveredNode === treeData;
  const colour = isHovered
    ? hoverColourClasses[depth % colourClasses.length]
    : colourClasses[depth % colourClasses.length];

  const childSizes = (treeData.children || []).map(child => child.size);
  const childRects = layoutRects(
    width,
    height,
    treeData.size,
    childSizes,
    paddingX,
    paddingY,
  );
  const drillTo = (node: TreeNode, depth: number) => () =>
    dispatch({ type: 'selectNode', node, depth });
  const drillDown = drillTo(treeData, depth);
  const drillUp = drillTo(treeData.parent, Math.max(depth - 1, 0));
  const mouseEvents = {
    onClick: isCurrentRoot ? drillUp : drillDown,
    onMouseEnter: () => setHoveredNode(treeData),
    onMouseLeave: () => setHoveredNode(null),
  };

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        className={`stroke-black fill-current cursor-pointer ${colour}`}
        {...mouseEvents}
      />
      <text
        ref={textRef}
        textAnchor="middle"
        x={x + width / 2}
        y={y + textHeight + 3}
        className={`${showText ? 'visible' : 'invisible'} cursor-pointer`}
        {...mouseEvents}
      >
        {isCurrentRoot ? treeData.getFullPath() : treeData.name}
      </text>
      {treeData.children &&
        treeData.children.map((child, index) => {
          const rect: Rect = childRects[index];
          return (
            <Treemap
              key={index}
              x={x + rect.x}
              y={y + rect.y}
              width={rect.width}
              height={rect.height}
              treeData={child}
              depth={depth + 1}
              isCurrentRoot={false}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              dispatch={dispatch}
            />
          );
        })}
    </>
  );
};

export default Treemap;
