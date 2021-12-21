import React from "react";
import { Fragment } from "react";

type Props = {
  children: JSX.Element
}

const Layout: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Fragment>{props.children}</Fragment>
    </div>
  );
};

export default Layout;
