import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <h1>I'm a header</h1>
      {children}
      <h1>I'm a footer</h1>
    </div>
  );
};
