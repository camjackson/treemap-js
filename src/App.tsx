import React, { useRef, useLayoutEffect, useState, useReducer } from 'react';
import Header from './Header';
import Treemap from './Treemap';
import Menu from './Menu';
import { reducer, initialState } from './state';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { filter, currentRootNode, currentDepth } = state;

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
      <Header toggleMenu={toggleMenu} />
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
            treeData={currentRootNode}
            depth={currentDepth}
            isCurrentRoot
            dispatch={dispatch}
          />
        </svg>
      </main>
    </div>
  );
};

export default App;
