"use client";

import { Text, RichText, Image, Repeater } from "react-bricks/frontend";
import React, { useRef, ElementType } from "react";
import { types } from "react-bricks/frontend";
import { AutoTextSize } from "auto-text-size";
import { ScrollParallax } from "react-just-parallax";
import { ImageProps } from "next/image";
import { ParallaxBackgroundImage } from "./Components/Parallax";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "./Layout/LayoutSideProps";
import { ArKUIColours } from "./colors";

interface HeroProps {
  // Background Image
  backgroundImage: types.IImageSource;
  backgroundImageFadeEnabled: boolean;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;
  darkenBackgroundOnSmallScreensEnabled: boolean;

  // Foreground Image
  foregroundImage: types.IImageSource;
  foregroundImageWidth: number;
  foregroundImageHeight: number;
  foregroundImageLeftOffset: number;
  foregroundImageTopOffset: number;
  foregroundImageRightOffset: number;
  foregroundImageBottomOffset: number;
  foregroundImageFit: string;

  // Foreground Parallax
  foregroundImageParallaxEnabled: boolean;
  foregroundImageParallaxStrength: number;
  foregroundImageParallaxEasing: number;

  //TEXT
  textParallaxEnabled: boolean;
  maxFontSize: number;
  dropshadowEnabled: boolean;

  // First Line
  firstLineText: string;
  firstLineBold: boolean;
  firstLineUppercase: boolean;
  firstLineBottomPadding: number;

  // Second Line
  secondLineText: string;
  secondLineBold: boolean;
  secondLineUppercase: boolean;

  // Button Links
  buttonLinks?: types.RepeaterItems[];

  // Heading Level
  headingLevel: string;

  // Subheader Text
  subheaderText: string;
  subheaderBold: boolean;
  subheaderUppercase: boolean;

  // Caption Text
  captionTextEnabled: boolean;

  // Padding & Borders
  lineHeight: Number;
  maxTextWidth: String;

  // Gradient
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;
}

const Hero: types.Brick<HeroProps> = ({
  backgroundImage,
  backgroundImageFadeEnabled,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,
  darkenBackgroundOnSmallScreensEnabled,

  foregroundImage,
  foregroundImageParallaxEnabled,
  foregroundImageParallaxStrength,
  foregroundImageParallaxEasing,

  foregroundImageFit,
  foregroundImageBottomOffset,
  foregroundImageLeftOffset,
  foregroundImageRightOffset,
  foregroundImageTopOffset,
  foregroundImageHeight,
  foregroundImageWidth,

  textParallaxEnabled,
  maxFontSize,
  dropshadowEnabled,

  firstLineText,
  firstLineBold,
  firstLineUppercase,
  firstLineBottomPadding,

  secondLineText,
  secondLineBold,
  secondLineUppercase,

  buttonLinks,

  headingLevel = "h2",

  subheaderText,
  subheaderBold,
  subheaderUppercase,

  captionTextEnabled,

  lineHeight,
  maxTextWidth,

  topGradientEndColour,
  topGradientHeight,
  topGradientZIndex,

  bottomGradientEndColour,
  bottomGradientHeight,
  bottomGradientZIndex,
}) => {
  const allowedTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  type HeadingLevel = (typeof allowedTags)[number];

  // runtime guard + safe fallback
  const fallback: HeadingLevel = "h2";

  const headingTag: HeadingLevel = allowedTags.includes(
    headingLevel as HeadingLevel
  )
    ? (headingLevel as HeadingLevel)
    : fallback;

  const HeadingTag: ElementType = headingTag;

  let foregroundImageWithParallax = (
    <ScrollParallax
      zIndex={10}
      lerpEase={foregroundImageParallaxEasing}
      strength={
        foregroundImageParallaxEnabled ? foregroundImageParallaxStrength : 0
      }
      shouldPause
      isAbsolutelyPositioned={true}
    >
      <Image
        source={foregroundImage}
        readonly
        quality={99}
        imageStyle={{
          width: `${foregroundImageWidth}%`,
          height: `${foregroundImageHeight}%`,
          bottom: `${foregroundImageBottomOffset}px`,
          left: `${foregroundImageLeftOffset}px`,
          top: `${foregroundImageTopOffset}px`,
          right: `${foregroundImageRightOffset}px`,
        }}
        imageClassName={`absolute ${foregroundImageFit} z-0`}
        alt="Background Image"
      />
    </ScrollParallax>
  );

  let autoSizingText = (
    <HeadingTag className="flex flex-col">
      <AutoTextSize
        fontSizePrecisionPx={0.1}
        maxFontSizePx={maxFontSize}
        style={{ lineHeight: `${lineHeight}` }}
        className={`text-white ${dropshadowEnabled ? "text-shadow" : ""} ${
          firstLineBold ? "font-bold" : ""
        } ${firstLineUppercase ? "uppercase" : ""} leading-[${lineHeight}rem]`}
      >
        {firstLineText}
      </AutoTextSize>
      <AutoTextSize
        maxFontSizePx={maxFontSize}
        style={{ lineHeight: `${lineHeight}` }}
        className={`text-white ${dropshadowEnabled ? "text-shadow" : ""} ${
          secondLineBold ? "font-bold" : ""
        } ${secondLineUppercase ? "uppercase" : ""} leading-[${lineHeight}rem]`}
      >
        {secondLineText}
      </AutoTextSize>
    </HeadingTag>
  );

  let smartPhoneTitleText = (
    <ScrollParallax
      zIndex={15}
      strength={textParallaxEnabled ? 0.14 : 0}
      shouldPause
      isAbsolutelyPositioned={true}
    >
      {/* This is displayed on smartphones and small screens */}
      <div
        style={{ paddingBottom: `${firstLineBottomPadding}rem` }}
        className={`max-w-${maxTextWidth} !flex lg:!hidden relative z-[100] flex-col justify-center content-center w-3/4 h-full mx-auto`}
      >
        {autoSizingText}
      </div>
    </ScrollParallax>
  );

  let desktopTitleTextElement = (
    <ScrollParallax
      zIndex={5}
      strength={textParallaxEnabled ? 0.14 : 0}
      shouldPause
      isAbsolutelyPositioned={true}
    >
      {/* This is displayed on large screens */}
      <div
        style={{ paddingBottom: `${firstLineBottomPadding}rem` }}
        className={`max-w-${maxTextWidth} !hidden lg:!flex relative z-0 flex-col justify-center content-center w-3/4 h-full mx-auto`}
      >
        {/* For Desktops we can control both lines */}
        {autoSizingText}
      </div>
    </ScrollParallax>
  );

  let subheaderTextElement = (
    <h3
      className={`text-white text-3xl 
      ${subheaderBold ? "font-bold" : ""} 
      ${subheaderUppercase ? "uppercase" : ""} mt-80 pt-20`}
      style={{ zIndex: 100 }}
    >
      {subheaderText}
    </h3>
  );

  let buttonLinksElement = (
    <div className="relative flex-col flex justify-center content-center items-center w-full z-[150]">
      <Repeater
        propName="buttonLinks"
        renderWrapper={(children) => (
          <div className="flex flex-wrap gap-4 flex-col justify-center mt-6">
            {children}
          </div>
        )}
      />
    </div>
  );

  let backgroundImageWithParallax = (
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
        quality={99}
        readonly
        imageClassName="object-cover relative z-0 h-full w-full"
        alt="Background Image"
      />
    </ScrollParallax>
  );

  let gradientOverlays = (
    <>
      <GradientFadeOverlay
        zIndex={topGradientZIndex}
        height={topGradientHeight}
        direction={GradientOverlayPosition.top}
        tailwindColour={topGradientEndColour ? topGradientEndColour.color : ""}
      />
      <GradientFadeOverlay
        zIndex={bottomGradientZIndex}
        height={bottomGradientHeight}
        direction={GradientOverlayPosition.bottom}
        tailwindColour={
          bottomGradientEndColour ? bottomGradientEndColour.color : ""
        }
      />
    </>
  );

  let backgroundImageFadeForMobile = (
    <div
      className={`${
        !darkenBackgroundOnSmallScreensEnabled ? "hidden" : ""
      } block lg:hidden bg-black absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[15] opacity-30`}
    ></div>
  );

  return (
    <div
      className={`relative text-center flex-col flex justify-center content-center items-center h-screen overflow-y-hidden`}
    >
      {backgroundImageFadeForMobile}

      {gradientOverlays}

      {foregroundImageWithParallax}

      {smartPhoneTitleText}

      {desktopTitleTextElement}

      {subheaderTextElement}

      {buttonLinksElement}

      {backgroundImageWithParallax}
    </div>
  );
};

Hero.schema = {
  name: "hero",
  label: "Hero",

  previewImageUrl:
    "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/master/-NZcCTh8KOOPD_y.png",

  getDefaultProps: () => ({
    firstLineText: "First Line",
    firstLineBold: true,
    firstLineUppercase: true,
    secondLineText: "Second Line",
    secondLineBold: true,
    secondLineUppercase: true,
    subheaderText: "Subheader",
    subheaderUppercase: true,
    subheaderBold: true,
    captionTextEnabled: false,
    dropshadowEnabled: false,
    lineHeight: 1,

    //IMAGE
    backgroundImageParallaxStrength: 0.14,
    foregroundImageParallaxEasing: 0.9,
    foregroundImageFit: "cover",
    foregroundImageHeight: 100,
    foregroundImageWidth: 100,

    //LAYOUT
    maxTextWidth: "3xl",

    // GRADIENT
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    topGradientHeight: 200,
    topGradientZIndex: 10,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 10,
  }),
  repeaterItems: [
    {
      name: "buttonLinks",
      itemType: "button-link", // must match ButtonLink.schema.name
      label: "Buttons",
      min: 0,
      max: 3, // optional limit
    },
  ],
  // Sidebar Edit controls for props
  sideEditProps: [
    {
      groupName: "Foreground Image",
      props: [
        {
          name: "foregroundImage",
          label: "Foreground Image",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 99,
            maxWidth: 5120,
          },
        },
        {
          name: "foregroundImageHeight",
          label: "Image Height (%)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageWidth",
          label: "Image Width (%)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageFit",
          label: "Image Fit",
          type: types.SideEditPropType.Select,
          helperText: "How should the image be resized?",
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "object-cover", label: "Cover" },
              { value: "object-contain", label: "Contain" },
              { value: "object-fill", label: "Fill" },
              { value: "object-none", label: "None" },
              { value: "object-scale-down", label: "Scale Down" },
            ],
          },
        },
        {
          name: "foregroundImageLeftOffset",
          label: "Left Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageRightOffset",
          label: "Right Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageTopOffset",
          label: "Top Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageBottomOffset",
          label: "Bottom Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageParallaxEnabled",
          label: "Foreground Image Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "foregroundImageParallaxStrength",
          label: "Foreground Image Parallax Strength (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "foregroundImageParallaxEasing",
          label: "Foreground Image Parallax Easing",
          type: types.SideEditPropType.Number,
          helperText:
            "The higher this value, the quicker the parallax will react to scroll / mouse movement.",
        },
      ],
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
            maxWidth: 5120,
          },
        },
        {
          name: "backgroundImageFadeEnabled",
          label: "Background Image Fade",
          type: types.SideEditPropType.Boolean,
          helperText: "Adds a subtle gradient fade ontop of the image.",
        },
        {
          name: "darkenBackgroundOnSmallScreensEnabled",
          label: "Darken Background On Small Screens",
          type: types.SideEditPropType.Boolean,
          helperText:
            "Darkens the background on small screens, making title text easier to read.",
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
      groupName: "Header",
      props: [
        {
          name: "firstLineText",
          label: "First Line Text",
          type: types.SideEditPropType.Text,
        },
        {
          name: "firstLineBold",
          label: "Bold",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "firstLineUppercase",
          label: "Uppercase",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "firstLineBottomPadding",
          label: "Bottom Padding (rem)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "secondLineText",
          label: "Second Line Text",
          type: types.SideEditPropType.Text,
        },
        {
          name: "secondLineBold",
          label: "Bold",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "secondLineUppercase",
          label: "Uppercase",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "maxFontSize",
          label: "Max Font Size (px)",
          type: types.SideEditPropType.Number,
          helperText:
            "Set the maximum font size the text will scale to. Change this depending on how large you want the text to grow on large screens.",
        },
        {
          name: "textParallaxEnabled",
          label: "Text Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "dropshadowEnabled",
          label: "Dropshadow",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "headingTag",
          label: "Heading Level (SEO)",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { label: "H1", value: "h1" },
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ],
          },
          helperText:
            "Sets the Level for the Heading text. Important for SEO — ideally, only one H1 per page.",
        },
      ],
    },
    {
      groupName: "Subheader",
      props: [
        {
          name: "subheaderText",
          label: "Subheader Text",
          type: types.SideEditPropType.Text,
        },
        {
          name: "subheaderBold",
          label: "Subheader Bold",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "subheaderUppercase",
          label: "Subheader Uppercase",
          type: types.SideEditPropType.Boolean,
        },
      ],
    },
    {
      groupName: "Caption",
      label: "Placed underneath the image with a faded gradient behind it.",
      props: [
        {
          name: "captionTextEnabled",
          label: "Caption Enabled",
          type: types.SideEditPropType.Boolean,
        },
      ],
    },
    {
      groupName: "Gradient",
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
    {
      groupName: "Layout",
      props: [
        {
          name: "lineHeight",
          label: "Line Height",
          type: types.SideEditPropType.Number,
        },
        {
          name: "maxTextWidth",
          label: "Max Text width",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "9xl", label: "9XL" },
              { value: "8xl", label: "8XL" },
              { value: "7xl", label: "7XL" },
              { value: "6xl", label: "6XL" },
              { value: "5xl", label: "5XL" },
              { value: "4xl", label: "4XL" },
              { value: "3xl", label: "3XL" },
              { value: "2xl", label: "2XL" },
              { value: "xl", label: "XL" },
              { value: "lg", label: "Large" },
              { value: "md", label: "Medium" },
              { value: "sm", label: "Small" },
            ],
          },
        },
      ],
    },
  ],
};

export default Hero;
