import React, {Fragment, PropsWithChildren} from 'react';

import MainNavigation from './main-navigation';

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
