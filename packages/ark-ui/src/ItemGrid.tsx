"use client";

import {
  Text,
  RichText,
  Image,
  Link,
  useAdminContext,
  Repeater,
} from "react-bricks/frontend";
import React, { useRef } from "react";
import { types } from "react-bricks/frontend";
import { AutoTextSize } from "auto-text-size";
import { ScrollParallax } from "react-just-parallax";
import { ImageProps } from "next/image";
import { ArKUIColours } from "./colors";
import { HeaderText, BodyText, HeaderLevel } from "./Components/Text";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import { ParallaxBackgroundImage } from "./Components/Parallax";
import PhotoGridItem from "./Components/PhotoGridItem";
import blockNames from "./blockNames";

interface ItemGridProps {
  // Text
  backgroundTitleText: string;
  showBackgroundTitleText: boolean;

  // Image
  blackAndWhite: boolean;
  backgroundImageFadeEnabled: boolean;
  backgroundImage: types.IImageSource;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;

  // Gradient Overlay
  topGradientEndColour: types.IColor;
  bottomGradientEndColour: types.IColor;

  // Layout
  maxNumOfCols: string;
  headerTextAlignment: HeaderTextAlignment;
}

// Enum controlling the alignment of the header text
enum HeaderTextAlignment {
  left = "left",
  center = "center",
  right = "right",
}

// Converts the HeaderTextAlignment into a class specifying the flex box alignment
const getHeaderAlignmentClass = (alignment: HeaderTextAlignment) => {
  switch (alignment) {
    case HeaderTextAlignment.left:
      return "items-start";
    case HeaderTextAlignment.center:
      return "items-center";
    case HeaderTextAlignment.right:
      return "items-end";
  }
};

const ItemGrid: types.Brick<ItemGridProps> = ({
  showBackgroundTitleText,
  backgroundTitleText,
  backgroundImage,
  backgroundImageFadeEnabled,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,

  // Gradient overlay
  topGradientEndColour,
  bottomGradientEndColour,

  // Layout
  maxNumOfCols,
  headerTextAlignment = HeaderTextAlignment.left,
}) => {
  const { isAdmin } = useAdminContext();
  const GridItem = () => (
    <div className="flex relative cursor-pointer overflow-hidden">
      <Link className="flex flex-col justify-center items-center" href="/about">
        <h2 className="absolute z-10 text-center font-bold text-4xl">
          SINGLES
        </h2>
        {/* Image Overlay Fade */}
        <div className="absolute w-full h-full bg-black z-[1] opacity-40 pointer-events-none"></div>
        <Image
          imageClassName="z-0 object-cover transition-all duration-500 hover:scale-110"
          alt=""
          readonly
          source={backgroundImage}
        />
      </Link>
    </div>
  );

  return (
    <div
      className={`relative text-center flex-col flex align-baseline content-center items-center bg-backgroundBlack min-h-screen overflow-y-hidden`}
    >
      {/* Gradient Overlays */}
      <GradientFadeOverlay
        zIndex={10}
        direction={GradientOverlayPosition.top}
        tailwindColour={topGradientEndColour.color}
      />
      <GradientFadeOverlay
        zIndex={10}
        direction={GradientOverlayPosition.bottom}
        tailwindColour={bottomGradientEndColour.color}
      />

      <div className="p-10 lg:p-20 mr-auto mb-auto z-10 flex flex-col w-full justify-center">
        <div
          className={`flex flex-col ${getHeaderAlignmentClass(
            headerTextAlignment
          )}`}
        >
          <HeaderText
            showBackgroundTitleText={showBackgroundTitleText}
            backgroundTitleText={backgroundTitleText}
            propName="title"
            placeholder="Title Here..."
            headerLevel={HeaderLevel.h2}
            textColour={ArKUIColours.WHITE.value}
          />
          <HeaderText
            showBackgroundTitleText={showBackgroundTitleText}
            backgroundTitleText={backgroundTitleText}
            propName="subheader"
            placeholder="Subheader Here..."
            headerLevel={HeaderLevel.h3}
            textColour={ArKUIColours.WHITE.value}
          />
          {/* <BodyText propName="bodyText" placeholder="Body Text Here..." /> */}
        </div>

        {/* Photo Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            maxNumOfCols ?? "xl:grid-cols-3"
          } gap-4 z-10 relative mt-10 max-w-screen-2xl m-auto`}
        >
          {/* Grid Item */}
          <Repeater propName="photoGridItems" />
          <Repeater propName="profileGridItems" />
        </div>
      </div>

      {/* Background Image Gradient Overlay */}
      <div
        className={`${
          backgroundImageFadeEnabled
            ? " bg-black/50 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent"
            : ""
        } absolute z-[1] w-full h-full`}
      ></div>

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
          imageClassName="object-cover w-full relative z-0 h-full"
          alt="Background Image"
        />
      </ScrollParallax>
    </div>
  );
};

ItemGrid.schema = {
  name: "linkedPhotoGrid",
  label: "Linked Photo Grid",
  previewImageUrl:
    "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/master/ZAQhg_JbUdtE3nk.png",
  getDefaultProps: () => ({
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    backgroundImageFadeEnabled: true,
    maxNumberOfColumns: "grid-cols-3",
    headerTextAlignment: HeaderTextAlignment.left,
  }),
  repeaterItems: [
    {
      name: "photoGridItems",
      itemType: blockNames.PhotoGridItem,
      itemLabel: "Photo Grid Item",
      min: 0,
    },
    {
      name: "profileGridItems",
      itemType: blockNames.ProfileGridItem,
      itemLabel: "Profile Grid Item",
      min: 0,
    },
  ],
  // Sidebar Edit controls for props
  sideEditProps: [
    {
      groupName: "Text",
      props: [
        {
          name: "backgroundTitleText",
          label: "Background Title Text",
          type: types.SideEditPropType.Text,
        },
        {
          name: "showBackgroundTitleText",
          label: "Show Background Title Text",
          type: types.SideEditPropType.Boolean,
          helperText:
            "Copies the background title and displays it again on the background with a faded effect.",
        },
        {
          name: "headerTextAlignment",
          label: "Header Text Alignment",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              {
                value: HeaderTextAlignment.left,
                label: "Left",
              },
              {
                value: HeaderTextAlignment.center,
                label: "Center",
              },
              {
                value: HeaderTextAlignment.right,
                label: "Right",
              },
            ],
          },
        },
      ],
    },
    {
      groupName: "Image",
      props: [
        {
          name: "backgroundImage",
          label: "Background Image",
          type: types.SideEditPropType.Image,
        },
        {
          name: "backgroundImageFadeEnabled",
          label: "Background Image Fade",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "backgroundImageParallaxEnabled",
          label: "Background Image Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "backgroundImageParallaxStrength",
          label: "Background Image Parallax Strength (px)",
          type: types.SideEditPropType.Number,
        },
      ],
    },
    {
      groupName: "Gradient",
      props: [
        {
          name: "topGradientEndColour",
          label: "Top Gradient End Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.BLACK,
              ArKUIColours.WHITE,
              ArKUIColours.TRANSPARENT,
            ],
          },
        },
        {
          name: "bottomGradientEndColour",
          label: "Bottom Gradient End Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.BLACK,
              ArKUIColours.WHITE,
              ArKUIColours.TRANSPARENT,
            ],
          },
        },
      ],
    },
    {
      groupName: "Layout",
      props: [
        {
          name: "maxNumOfCols",
          label: "Number of Columns (For Large Screen)",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "xl:grid-cols-1", label: "1 Column" },
              { value: "xl:grid-cols-2", label: "2 Columns" },
              { value: "xl:grid-cols-3", label: "3 Columns" },
              { value: "xl:grid-cols-4", label: "4 Columns" },
              { value: "xl:grid-cols-5", label: "5 Columns" },
            ],
          },
        },
      ],
    },
  ],
};

export default ItemGrid;
