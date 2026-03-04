"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Repeater,
  types,
  Link,
  useAdminContext,
  Text,
} from "react-bricks/frontend";
import { FiMenu, FiX } from "react-icons/fi";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import blockNames from "../blockNames";
import { bgColors, buttonColors } from "../colors";
import {
  backgroundColorsEditProps,
  borderBottomEditProp,
  LayoutProps,
  sectionDefaults,
} from "../Layout/LayoutSideProps";
interface FooterProps extends LayoutProps {
  backgroundImage: types.IImageSource;
}

const Footer: types.Brick<FooterProps> = ({ backgroundImage }) => {
  return (
    <div className="w-full bg-backgroundBlack p-5 flex flex-col overflow-y-hidden">
      <div className="flex relative align-top flex-col md:flex-row p-5 pb-10 space-y-5 md:space-y-0 space-x-0 md:space-x-10 lg:space-x-20 max-w-[1400px] mx-auto w-full">
        <Image
          propName="logo"
          alt="Logo"
          imageClassName="w-[40px] z-10 object-contain mb-auto"
        />

        <Repeater
          propName="columns"
          itemProps={{
            className:
              "text-md text-left z-10 font-medium text-white leading-tight",
          }}
        />

        {/* Spacer */}
        <div className="grow"></div>

        {/* Social Media Icons */}
        <div className="flex z-10 h-fit space-x-4 flex-row items-center mb-auto min-w-fit">
          <Repeater propName="socialLinks" />
        </div>

        {/* Background Image Overlay */}
        <Image
          readonly
          source={backgroundImage}
          alt="Background Image"
          imageClassName="w-[900px] z-0 absolute opacity-5 object-cover mb-auto -left-[500px] -top-20"
        />
      </div>

      {/* Footer Copyright Text */}
      <Text
        renderBlock={(props) => (
          <h2 className="text-sm z-10 relative text-left md:text-center text-gray-300 leading-tight mb-3 px-5">
            {props.children}
          </h2>
        )}
        placeholder="Footer Text"
        propName="footerText"
      />
    </div>
  );
};

export default Footer;

Footer.schema = {
  name: "footer",
  label: "Footer",
  sideEditProps: [
    {
      name: "backgroundImage",
      label: "Background Image",
      helperText: "Displayed as a subtle overlay behind the footer content.",
      type: types.SideEditPropType.Image,
    },
  ],
  repeaterItems: [
    {
      name: "columns",
      itemType: blockNames.FooterColumnItem,
      itemLabel: "Column",
      min: 1,
      max: 6,
    },
    {
      name: "socialLinks",
      itemType: blockNames.FooterSocialLink,
      itemLabel: "Social Link",
    },
  ],
};
