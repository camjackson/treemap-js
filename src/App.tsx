import React, { useRef, useLayoutEffect, useState } from 'react';
import Header from './Header';
import Treemap from './Treemap';
import {
  buildTreeData,
  buildTreeDataFromClocData,
  TreeNode,
} from './buildTreeData';
import mortgageData from './exampleData/mortgage';
import reactRouterClocData from './exampleData/react-router-cloc.json';

const examples = {
  mortgage: buildTreeData(mortgageData),
  reactRouter: buildTreeDataFromClocData(reactRouterClocData),
};

function App() {
  const svgRef = useRef(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1, height: 1 });
  useLayoutEffect(() => {
    const onResize = () => {
      const rect = svgRef.current.getBoundingClientRect();
      setSvgDimensions({ width: rect.width, height: rect.height });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [svgRef]);

  const [currentRootNode, setCurrentRootNode] = useState(examples.reactRouter);
  const [currentDepth, setCurrentDepth] = useState(0);
  const selectNode = (node: TreeNode, depth: number) => () => {
    setCurrentRootNode(node);
    setCurrentDepth(depth);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header selectNode={selectNode} />

      <main className="flex-1 p-2">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full border-gray-700"
        >
          <Treemap
            x={0}
            y={0}
            width={svgDimensions.width}
            height={svgDimensions.height}
            treeData={currentRootNode}
            depth={currentDepth}
            isCurrentRoot
            drillTo={selectNode}
          />
        </svg>
      </main>
    </div>
  );
}

export default App;
