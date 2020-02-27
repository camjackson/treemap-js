import React, { FC } from 'react';
import Hamburger from './icons/Hamburger';

type Props = {
  toggleMenu: () => void;
};

const Header: FC<Props> = ({ toggleMenu }) => {
  return (
    <header className="flex flex-row justify-between items-center">
      <button className="ml-2 text-gray-900" title="Menu" onClick={toggleMenu}>
        <Hamburger />
      </button>
      <h1 className="text-3xl text-center flex-1">Treemap (react-router)</h1>
    </header>
  );
};

export default Header;
