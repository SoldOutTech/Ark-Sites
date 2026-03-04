"use client";

import blockNames from "../blockNames";
import React, { useRef, useState } from "react";
import { Text, Repeater, types, Link, Plain } from "react-bricks/frontend";
import useOnClickOutside from "../Util/useClickOutside";

export interface FooterColumns {}

interface FooterColumnProps extends FooterColumns {
  className: string;
}

const FooterItem: types.Brick<FooterColumnProps> = ({ className }) => {
  return (
    <div className={className}>
      <Text
        renderBlock={(props) => (
          <h2 className="text-md font-bold uppercase text-white leading-tight">
            {props.children}
          </h2>
        )}
        placeholder="Column Header"
        propName="columnHeader"
        renderPlaceholder={(props) => <h2>Column Header</h2>}
      />
      <Repeater propName="links" />
    </div>
  );
};

FooterItem.schema = {
  name: blockNames.FooterColumnItem,
  label: "Footer Column",
  category: "layout",
  hideFromAddMenu: true,

  repeaterItems: [
    {
      name: "links",
      itemType: blockNames.FooterColumnLink,
      itemLabel: "Link",
    },
  ],

  getDefaultProps: () => ({}),

  sideEditProps: [],
};

export default FooterItem;
