"use client";

import blockNames from "../blockNames";
import React from "react";
import {
  types,
  Link,
  useAdminContext,
} from "react-bricks/frontend";
import { BodyText, FontWeight, TextSize } from "../Components/Text";
import { ArKUIColours, ArkUIColourValue } from "../colors";

export interface NavigationBarItems {
  linkPath: string;
  linkText: string;
  size?: TextSize;
  colour?: ArkUIColourValue;
}

interface NavigationBarItemProps extends NavigationBarItems {
  mobileRef: React.MutableRefObject<HTMLDivElement>;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationBarItem: types.Brick<NavigationBarItemProps> = ({
  linkPath,
  linkText,
  size = TextSize.sm,
  mobileRef,
  colour = ArKUIColours.WHITE.value,
  setMobileMenuOpen,
}) => {
  let { isAdmin } = useAdminContext();
  return (
    <div
      // When the link is clicked, we want to close the mobile menu, but only when not using the editor.
      onClick={() => !isAdmin && setMobileMenuOpen(false)}
    >
      <Link
        href={linkPath}
        activeClassName="opacity-100"
        className="opacity-70 hover:opacity-100 transition-all ease-out cursor-pointer font-semibold bg-transparent inline-flex justify-center items-center text-sm  py-1.5 px-2 rounded-[5px] text-white"
      >
        <BodyText
          propName="linkText"
          textSize={size}
          placeholder="Type a text..."
          fontWeight={FontWeight.semibold}
          colour={colour}
        />
      </Link>
    </div>
  );
};

NavigationBarItem.schema = {
  name: blockNames.NavigationBarItem,
  label: "Navigation Bar Item",
  category: "layout",
  hideFromAddMenu: true,

  // repeaterItems: [
  //   {
  //     name: 'submenuItems',
  //     itemType: blockNames.HeaderMenuSubItem,
  //   },
  // ],

  getDefaultProps: () => ({
    linkPath: "/about-us",
    linkText: "About us",
  }),

  sideEditProps: [
    {
      name: "linkText",
      label: "Text",
      type: types.SideEditPropType.Text,
    },
    {
      name: "linkPath",
      label: "Link to...",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default NavigationBarItem;
