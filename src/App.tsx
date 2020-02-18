import React, { useRef, useLayoutEffect, useState } from 'react';
import Treemap from './Treemap';
import buildTreeData, { TreeNode } from './buildTreeData';
import exampleData from './exampleData';

const treeData: TreeNode = buildTreeData(exampleData);

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

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-center text-3xl">Treemap</h1>
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
            treeData={treeData}
            depth={0}
          />
        </svg>
      </main>
    </div>
  );
}

export default App;
