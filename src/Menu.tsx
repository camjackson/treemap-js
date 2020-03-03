import React, { FC, Dispatch, useRef } from 'react';
import Cross from './icons/Cross';
import { Action } from './state';

type Props = {
  showMenu: boolean;
  initialFilter: string;
  toggleMenu: () => void;
  dispatch: Dispatch<Action>;
};

const Li = ({ className, ...props }: any) => (
  <li
    className={`py-3 px-5 border-b border-gray-300 hover:bg-gray-200 ${className}`}
    {...props}
  />
);

const Menu: FC<Props> = ({ showMenu, initialFilter, toggleMenu, dispatch }) => {
  const filterInputRef = useRef(null);
  const focusFilterInput = () => {
    filterInputRef.current.focus();
  };

  const onFileChange = (e: any) => {
    e.target.files[0].text().then((text: string) => {
      dispatch({ type: 'uploadFile', inputData: JSON.parse(text) });
      toggleMenu();
    });
  };

  const onFilterBlur = (e: any) => {
    dispatch({ type: 'setFilter', filter: e.target.value });
  };

  const display = showMenu ? 'block' : 'hidden';

  return (
    <>
      <div
        className={`${display} fixed top-0 right-0 bottom-0 left-0 bg-fade`}
      />
      <div
        className={`${display} fixed top-0 bottom-0 left-0 shadow-2xl bg-white border-r border-gray-300`}
      >
        <header className="flex justify-between border-b border-gray-300">
          <h2 className="text-xl m-4">Options</h2>
          <button className="mr-2" title="Close" onClick={toggleMenu}>
            <Cross />
          </button>
        </header>
        <ul>
          <Li>
            <label className="block cursor-pointer">
              Upload cloc JSON, generated like:
              <div className="font-mono">
                cloc --exclude-dir node_modules --by-file --json . > cloc.json
              </div>
              <input
                className="block py-3 px-5 cursor-pointer"
                type="file"
                multiple={false}
                accept="application/json"
                onChange={onFileChange}
              />
            </label>
          </Li>
          <Li className="cursor-pointer" onClick={focusFilterInput}>
            <label>
              File filter regex:
              <input
                ref={filterInputRef}
                className="mx-3 px-2 border border-gray-400 focus:border-blue-500"
                type="text"
                defaultValue={initialFilter}
                onBlur={onFilterBlur}
              />
            </label>
            <span className="italic">(Separate multiple filters with |)</span>
          </Li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
