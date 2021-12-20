import React from "react";
import { Fragment } from "react";

export default function Layout<React, FC>(props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Fragment>{props.children}</Fragment>
    </div>
  );
}
