import React, { FC } from 'react';

type Props = {
  name: string;
  size: number;
};

const Footer: FC<Props> = ({ name, size }) => {
  return (
    <footer className="fixed bottom-0 right-0 border border-gray-500 py-2 px-3 bg-white font-mono">
      {name}: {size} LoC
    </footer>
  );
};

export default Footer;
