import React, {
  useRef,
  useLayoutEffect,
  useState,
  useReducer,
  useMemo,
} from 'react';
import Header from './Header';
import Footer from './Footer';
import Treemap from './Treemap';
import Menu from './Menu';
import { reducer, initialState } from './state';
import { buildTreeDataFromClocData } from './buildTreeData';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, filter, inputData, currentRootNode, currentDepth } = state;
  const wholeTreeData = useMemo(
    () => buildTreeDataFromClocData(inputData, filter),
    [inputData, filter],
  );

  const [hoveredNode, setHoveredNode] = useState(null);

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

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="w-full h-full flex flex-col">
      <Header toggleMenu={toggleMenu} name={name} />
      <Menu
        showMenu={showMenu}
        initialFilter={filter}
        toggleMenu={toggleMenu}
        dispatch={dispatch}
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
            treeData={currentRootNode || wholeTreeData}
            depth={currentDepth}
            isCurrentRoot
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            dispatch={dispatch}
          />
        </svg>
      </main>
      {hoveredNode && (
        <Footer name={hoveredNode.getFullPath()} size={hoveredNode.size} />
      )}
    </div>
  );
};

export default App;
