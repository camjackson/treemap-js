import React, { useRef, useLayoutEffect, useState } from 'react';
import Header from './Header';
import Treemap from './Treemap';
import Menu from './Menu';
import { buildTreeDataFromClocData, ClocMap, TreeNode } from './buildTreeData';
import mortgageClocData from './exampleData/mortgage-cloc.json';
import reactRouterClocData from './exampleData/react-router-cloc.json';

const exampleInputs: Record<string, ClocMap> = {
  mortgage: (mortgageClocData as any) as ClocMap,
  reactRouter: (reactRouterClocData as any) as ClocMap,
};
const initialInput = exampleInputs.reactRouter;
const initialFilter = 'package-lock.json';

type ClocMapStateHook = [ClocMap, (newValue: ClocMap) => void];
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

  const [filter, setFilter] = useState(initialFilter);
  const [inputData, setInputData]: ClocMapStateHook = useState(initialInput);
  const [currentRootNode, setCurrentRootNode]: TreeNodeStateHook = useState(
    buildTreeDataFromClocData(inputData, filter),
  );
  const [currentDepth, setCurrentDepth] = useState(0);
  const selectNode = (node: TreeNode, depth: number) => () => {
    setCurrentRootNode(node);
    setCurrentDepth(depth);
  };

  const setState = (newInputData: ClocMap, newFilter: string) => {
    setInputData(newInputData);
    setFilter(newFilter);
    const treeData: TreeNode = buildTreeDataFromClocData(
      newInputData,
      newFilter,
    );
    selectNode(treeData, 0)();
  };

  const uploadFile = (parsedData: ClocMap) => setState(parsedData, filter);
  const onChangeFilter = (newFilter: string) => setState(inputData, newFilter);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="w-full h-full flex flex-col">
      <Header toggleMenu={toggleMenu} />
      <Menu
        showMenu={showMenu}
        uploadFile={uploadFile}
        initialFilter={filter}
        setFilter={onChangeFilter}
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
