"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Repeater,
  types,
  Link,
  useAdminContext,
} from "react-bricks/frontend";
import blockNames from "../blockNames";
import { bgColors, buttonColors } from "../colors";
import {
  backgroundColorsEditProps,
  borderBottomEditProp,
  LayoutProps,
} from "../Layout/LayoutSideProps";
import Section from "../Components/Section";
import useOnClickOutside from "../Util/useClickOutside";
import { ButtonProps } from "../Components/Button";
import { NavigationBarItems } from "../Navigation/NavigationBarItem";
import Hamburger from "hamburger-react";
import { TextSize } from "../Components/Text";

interface HeaderProps extends LayoutProps {
  menuItems: NavigationBarItems[];
  mobileLinkTextSize?: TextSize;
  desktopLinkTextSize?: TextSize;
  logo: types.IImageSource;
  buttons: ButtonProps[];
}

const NavigationBar: types.Brick<HeaderProps> = ({
  backgroundColor,
  borderBottom,
  mobileLinkTextSize,
  desktopLinkTextSize,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setMobileMenuOpen(false));

  const MobileNavigationLinks = () => {
    return (
      <div className="md:hidden flex w-full">
        <div className="z-10 ml-auto">
          {mounted && (
            <Hamburger
              toggled={mobileMenuOpen}
              color={`white`}
              onToggle={setMobileMenuOpen}
              size={20}
            />
          )}
        </div>

        {/* Wrap all the mobile navigation items in a div to ensure that we can hide any overflow caused by the scaling */}
        <div className="fixed inset-0 w-full h-full overflow-hidden scroll">
          <div
            className={`${
              mobileMenuOpen
                ? "scale-100 opacity-100"
                : "scale-[1.1] opacity-0 blur-sm pointer-events-none"
            } z-[8] bg-backgroundBlack ease-in-out duration-700 h-full w-full absolute inset-0 flex flex-col justify-center content-center items-center space-y-10`}
          >
            {/* Vertical list of links which are derived from the <Repeater /> */}
            <Repeater
              propName="menuItems"
              itemProps={{
                mobileRef: ref,
                setMobileMenuOpen,
                size: mobileLinkTextSize,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const DesktopNavigationLinks = () => {
    return (
      <div className="ml-auto hidden md:flex items-center space-x-2">
        <Repeater
          propName="menuItems"
          itemProps={{
            mobileRef: ref,
            setMobileMenuOpen,
            size: desktopLinkTextSize,
          }}
        />
      </div>
    );
  };

  return (
    <Section
      backgroundColor={backgroundColor}
      borderBottom={"none"}
      className="fixed inset-x-0 top-0 z-[1000] w-full"
    >
      <div className="w-full h-40 bg-gradient-to-b from-black/60 to-transparent ">
        <nav className="py-5 px-5 lg:px-20 flex justify-start items-cente">
          {/* Branding */}
          <Link
            href="/"
            aria-label="home"
            className="z-10 inline-flex py-1.5 px-2 mr-6 opacity-75 hover:opacity-100 transition-all"
          >
            <Image
              propName="logo"
              alt="Logo"
              maxWidth={300}
              imageClassName="block w-32 h-7 object-contain object-left"
            />
          </Link>

          {/* Mobile Navigation  */}
          {MobileNavigationLinks()}

          {/* Desktop Navigation  */}
          {DesktopNavigationLinks()}
        </nav>
      </div>
    </Section>
  );
};

export default NavigationBar;

NavigationBar.schema = {
  name: blockNames.NavigationBar,
  label: "NavigationBar",
  category: "layout",
  tags: ["navigation"],
  //   previewImageUrl: `/bricks-preview-images/${blockNames.Header}.png`,
  repeaterItems: [
    {
      name: "menuItems",
      itemType: blockNames.NavigationBarItem,
      itemLabel: "Link",
      min: 0,
      max: 6,
    },
  ],
  sideEditProps: [
    {
      groupName: "Layout",
      defaultOpen: true,
      props: [backgroundColorsEditProps, borderBottomEditProp],
    },
    {
      groupName: "Links (Mobile)",
      props: [
        {
          name: "mobileLinkTextSize",
          label: "Link Size",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: TextSize.sm, label: "Small" },
              { value: TextSize.md, label: "Medium" },
              { value: TextSize.lg, label: "Large" },
              { value: TextSize.xl, label: "Extra Large" },
              { value: TextSize["2xl"], label: "2x Large" },
              { value: TextSize["3xl"], label: "3x Large" },
              { value: TextSize["4xl"], label: "4x Large" },
              { value: TextSize["5xl"], label: "5x Large" },
              { value: TextSize["6xl"], label: "6x Large" },
              { value: TextSize["7xl"], label: "7x Large" },
              { value: TextSize["8xl"], label: "8x Large" },
              { value: TextSize["9xl"], label: "9x Large" },
            ],
          },
        },
      ],
    },
    {
      groupName: "Links (Desktop)",
      props: [
        {
          name: "desktopLinkTextSize",
          label: "Link Size",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: TextSize.sm, label: "Small" },
              { value: TextSize.md, label: "Medium" },
              { value: TextSize.lg, label: "Large" },
              { value: TextSize.xl, label: "Extra Large" },
              { value: TextSize["2xl"], label: "2x Large" },
              { value: TextSize["3xl"], label: "3x Large" },
              { value: TextSize["4xl"], label: "4x Large" },
              { value: TextSize["5xl"], label: "5x Large" },
              { value: TextSize["6xl"], label: "6x Large" },
              { value: TextSize["7xl"], label: "7x Large" },
              { value: TextSize["8xl"], label: "8x Large" },
              { value: TextSize["9xl"], label: "9x Large" },
            ],
          },
        },
      ],
    },
  ],
  getDefaultProps: () => ({
    backgroundColor: bgColors.WHITE.value,
    borderBottom: "none",
    menuItems: [
      {
        linkPath: "/",
        linkText: "Home",
      },
      {
        linkPath: "/about",
        linkText: "About",
      },
    ],
    logo: {
      src: "/bricks-assets/logo.png",
      width: 128,
      height: 28,
    },
    buttons: [
      {
        type: "link",
        text: "Edit content",
        href: "/admin",
        isTargetBlank: true,
        buttonType: "submit",
        buttonColor: buttonColors.SKY.value,
        variant: "solid",
        padding: "small",
        simpleAnchorLink: true,
      },
    ],
  }),
};
