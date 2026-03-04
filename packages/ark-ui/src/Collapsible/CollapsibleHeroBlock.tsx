"use client";

import React, { useRef, useState } from "react";
import {
  types,
  Text,
  Repeater,
  Image,
  useAdminContext,
} from "react-bricks/frontend";
import { ScrollParallax } from "react-just-parallax";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "../Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "../Layout/LayoutSideProps";
import { ArKUIColours } from "../colors";
import { Collapsible } from "./Collapsible";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface CollapsibleHeroBlockProps {
  title: string;
  contentType: "text" | "profile";

  // Background & gradient props
  backgroundImage: types.IImageSource;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;

  expandToFullHeight?: boolean;
}

const CollapsibleHeroBlock: types.Brick<CollapsibleHeroBlockProps> = ({
  title,
  contentType,
  backgroundImage,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,
  topGradientEndColour = ArKUIColours.TRANSPARENT.value,
  topGradientHeight,
  topGradientZIndex = 1,
  bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
  bottomGradientHeight,
  bottomGradientZIndex = 1,
  expandToFullHeight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAdminContext();

  return (
    <div className="relative w-full bg-black overflow-hidden text-left">
      {/* Gradient Overlays */}
      <GradientFadeOverlay
        height={topGradientHeight}
        direction={GradientOverlayPosition.top}
        tailwindColour={topGradientEndColour.color}
        zIndex={topGradientZIndex}
      />
      <GradientFadeOverlay
        height={bottomGradientHeight}
        direction={GradientOverlayPosition.bottom}
        tailwindColour={bottomGradientEndColour.color}
        zIndex={bottomGradientZIndex}
      />

      {/* Layout Wrapper */}
      <div className="max-w-[1900px] flex flex-col w-full relative justify-center">
        {/* Toggle Button */}
        <button
          className="relative z-10 text-left text-4xl font-bold uppercase text-white opacity-70 hover:opacity-100 p-10 md:pt-20 md:pl-20 md:pb-14 md:pr-10 hover:text-white transition-all ease-in-out flex items-center gap-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          <ChevronDown
            className={clsx(
              "transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0"
            )}
            size={28}
          />
        </button>

        {/* Animated Content */}
        <Collapsible isOpen={isOpen}>
          <div
            className={clsx(
              "relative z-10 w-full p-10 md:pt-0 md:pl-20 md:pb-20 md:pr-10 flex flex-col justify-center",
              expandToFullHeight && "h-screen"
            )}
          >
            {contentType === "text" ? (
              <div className="space-y-2 max-w-3xl">
                <Text
                  propName="header"
                  placeholder="Header..."
                  renderBlock={(props) => (
                    <h3 className="text-xl text-white font-semibold">
                      {props.children}
                    </h3>
                  )}
                />
                <Text
                  propName="subheader"
                  placeholder="Subheader..."
                  renderBlock={(props) => (
                    <p className="text-lg text-gray-300">{props.children}</p>
                  )}
                />
                <Text
                  propName="body"
                  placeholder="Service info..."
                  renderBlock={(props) => (
                    <p className="text-base text-gray-400">{props.children}</p>
                  )}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Repeater
                  propName="profileGridItems"
                  renderWrapper={(children) => (
                    <div className="flex justify-center items-center">
                      {children}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </Collapsible>
      </div>

      {/* Background Image */}
      <div className="absolute z-[1] bg-black/50 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent w-full h-full" />
      <ScrollParallax
        zIndex={0}
        strength={
          backgroundImageParallaxEnabled ? backgroundImageParallaxStrength : 0
        }
        shouldPause
        isAbsolutelyPositioned={true}
      >
        <Image
          source={backgroundImage}
          readonly
          quality={99}
          imageClassName="object-cover relative z-0 h-full"
          alt="Background"
        />
      </ScrollParallax>
    </div>
  );
};

CollapsibleHeroBlock.schema = {
  name: "collapsible-info-block",
  label: "Collapsible Hero Block",
  sideEditProps: [
    {
      name: "title",
      label: "Section Title",
      type: types.SideEditPropType.Text,
    },
    {
      name: "contentType",
      label: "Content Type",
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Select,
        options: [
          { value: "text", label: "Text Description" },
          { value: "profile", label: "Profile Grid Items" },
        ],
      },
    },
    {
      name: "expandToFullHeight",
      label: "Expand to Full Height",
      type: types.SideEditPropType.Boolean,
    },
    {
      groupName: "Background Image",
      props: [
        {
          name: "backgroundImage",
          label: "Background Image",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 99,
          },
        },
        {
          name: "backgroundImageParallaxEnabled",
          label: "Enable Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "backgroundImageParallaxStrength",
          label: "Parallax Strength",
          type: types.SideEditPropType.Number,
        },
      ],
    },
    {
      groupName: "Gradients",
      props: [
        gradientTopEndColourProps,
        {
          name: "topGradientHeight",
          label: "Top Gradient Height (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "topGradientZIndex",
          label: "Top Gradient Z-Index",
          type: types.SideEditPropType.Number,
        },
        gradientBottomEndColourProps,
        {
          name: "bottomGradientHeight",
          label: "Bottom Gradient Height (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "bottomGradientZIndex",
          label: "Bottom Gradient Z-Index",
          type: types.SideEditPropType.Number,
        },
      ],
    },
  ],
  repeaterItems: [
    {
      name: "profileGridItems",
      itemType: "profile-grid-item",
      itemLabel: "Profile Grid Item",
      max: 12,
    },
  ],
  getDefaultProps: () => ({
    title: "Section Title",
    contentType: "text",
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    backgroundImageParallaxEnabled: true,
    backgroundImageParallaxStrength: 100,
    topGradientHeight: 200,
    topGradientZIndex: 1,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 1,
    expandToFullHeight: false,
  }),
};

export default CollapsibleHeroBlock;
