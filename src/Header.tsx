import React, { FC } from 'react';
import { buildTreeDataFromClocData, TreeNode } from './buildTreeData';

type Props = {
  selectNode: (treeData: TreeNode, depth: number) => () => void;
};

const Header: FC<Props> = ({ selectNode }) => {
  const onChange = e => {
    e.target.files[0].text().then((text: string) => {
      const parsedData = buildTreeDataFromClocData(JSON.parse(text));
      selectNode(parsedData, 0)();
    });
  };

  return (
    <header className="">
      <h1 className="text-center text-3xl">Treemap (react-router)</h1>
      <label className="fixed top-0 left-0 my-4 ml-4 hidden lg:inline">
        <span
          className="mr-3 underline cursor-help"
          title="Generate with e.g. `cloc --exclude-dir node_modules --by-file --json . > cloc.json`"
        >
          Upload cloc JSON
        </span>
        <input
          type="file"
          multiple={false}
          accept="application/json"
          onChange={onChange}
        />
      </label>
    </header>
  );
};

export default Header;
