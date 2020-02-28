import React, { useRef, useLayoutEffect, useState } from 'react';
import Header from './Header';
import Treemap from './Treemap';
import Menu from './Menu';
import {
  buildTreeData,
  buildTreeDataFromClocData,
  ClocMap,
  TreeNode,
} from './buildTreeData';
import mortgageData from './exampleData/mortgage';
import reactRouterClocData from './exampleData/react-router-cloc.json';

const examples = {
  mortgage: buildTreeData(mortgageData),
  reactRouter: buildTreeDataFromClocData(
    (reactRouterClocData as any) as ClocMap,
  ),
};

type TreeNodeStateHook = [TreeNode, (newValue: TreeNode) => void];

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

  const [currentRootNode, setCurrentRootNode]: TreeNodeStateHook = useState(
    examples.mortgage,
  );
  const [currentDepth, setCurrentDepth] = useState(0);
  const selectNode = (node: TreeNode, depth: number) => () => {
    setCurrentRootNode(node);
    setCurrentDepth(depth);
  };

  const uploadFile = (parsedData: ClocMap) => {
    const treeData: TreeNode = buildTreeDataFromClocData(parsedData);
    selectNode(treeData, 0)();
  };

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="w-full h-full flex flex-col">
      <Header toggleMenu={toggleMenu} />
      <Menu
        showMenu={showMenu}
        uploadFile={uploadFile}
        toggleMenu={toggleMenu}
      />

      <main className="flex-1 p-2 pt-0">
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
