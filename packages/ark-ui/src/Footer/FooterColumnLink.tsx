"use client";

import blockNames from "../blockNames";
import React from "react";
import { Text, types, Link } from "react-bricks/frontend";

interface FooterColumnLinkProps {
  linkPath: string;
}

const FooterColumnLink: types.Brick<FooterColumnLinkProps> = ({ linkPath }) => {
  return (
    <Link href={linkPath} target="_blank">
      <Text
        propName="linkText"
        placeholder="Link..."
        renderBlock={({ children }) => (
          <div
            className={`text-sm font-medium text-gray-200 hover:text-white transition-all ease-out duration-150 hover:-translate-y-px`}
          >
            {children}
          </div>
        )}
      />
    </Link>
  );
};

FooterColumnLink.schema = {
  name: blockNames.FooterColumnLink,
  label: "Link",
  category: "layout",
  hideFromAddMenu: true,
  // tags: [],

  // Defaults when a new brick is added
  getDefaultProps: () => ({
    // linkText: 'Pricing',
    // linkPath: '/',
  }),

  // Sidebar Edit controls for props
  sideEditProps: [
    {
      name: "linkPath",
      label: "Link to...",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default FooterColumnLink;
