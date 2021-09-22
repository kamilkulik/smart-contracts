import React, { ReactNode } from 'react';
import { Container } from 'semantic-ui-react';
import Header from './header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
