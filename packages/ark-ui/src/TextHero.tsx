"use client";

import { Text, RichText, Image } from "react-bricks/frontend";
import React, { useRef } from "react";
import { types } from "react-bricks/frontend";
import { AutoTextSize } from "auto-text-size";
import { ScrollParallax } from "react-just-parallax";
import { ImageProps } from "next/image";
import { ArKUIColours, ArkUIColourValue } from "./colors";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "./Layout/LayoutSideProps";

interface TextHeroProps {
  // Text
  headingTextColour: ArkUIColourValue;
  bodyTextColour: ArkUIColourValue;
  // Images

  foregroundImage: types.IImageSource;
  foregroundImageWidth: number;
  foregroundImageHeight: number;
  foregroundImageLeftOffset: number;
  foregroundImageTopOffset: number;
  foregroundImageRightOffset: number;
  foregroundImageBottomOffset: number;
  foregroundImageZIndex: number;
  foregroundImageFit: string;

  // Foreground image parallax
  foregroundImageParallaxEnabled: boolean;
  foregroundImageParallaxStrength: number;
  foregroundImageParallaxEasing: number;

  backgroundImage: types.IImageSource;
  backgroundImageFadeEnabled: boolean;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;

  // Gradient overlay
  topGradientEndColour: ArkUIColourValue;
  topGradientHeight: number;
  topGradientZIndex: number;

  bottomGradientEndColour: ArkUIColourValue;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;
}

const TextHero: types.Brick<TextHeroProps> = ({
  // Text
  headingTextColour,
  bodyTextColour,

  // Images
  foregroundImage,
  foregroundImageHeight,
  foregroundImageWidth,
  foregroundImageFit,
  foregroundImageLeftOffset,
  foregroundImageTopOffset,
  foregroundImageBottomOffset,
  foregroundImageRightOffset,
  foregroundImageZIndex = 10,
  foregroundImageParallaxEnabled,
  foregroundImageParallaxEasing,
  foregroundImageParallaxStrength,

  backgroundImage,
  backgroundImageFadeEnabled,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,

  // Gradient overlay
  topGradientEndColour = ArKUIColours.TRANSPARENT.value,
  topGradientHeight,
  topGradientZIndex = 10,

  bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
  bottomGradientHeight,
  bottomGradientZIndex = 10,
}) => {
  const resolveTextClassName = (colour?: ArkUIColourValue) =>
    colour?.textClassName || (colour?.className || "").replace(/^bg-/, "text-");

  let gradientOverlays = (
    <>
      <GradientFadeOverlay
        zIndex={topGradientZIndex}
        height={topGradientHeight}
        direction={GradientOverlayPosition.top}
        tailwindColour={topGradientEndColour.color}
      />
      <GradientFadeOverlay
        zIndex={bottomGradientZIndex}
        height={bottomGradientHeight}
        direction={GradientOverlayPosition.bottom}
        tailwindColour={bottomGradientEndColour.color}
      />
    </>
  );

  let foregroundImageElement = (
    <ScrollParallax
      zIndex={100}
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
        imageStyle={{
          width: `${foregroundImageWidth}%`,
          height: `${foregroundImageHeight}%`,
          bottom: `${foregroundImageBottomOffset}px`,
          left: `${foregroundImageLeftOffset}px`,
          top: `${foregroundImageTopOffset}px`,
          right: `${foregroundImageRightOffset}px`,
          zIndex: `${foregroundImageZIndex}`,
        }}
        imageClassName={`hidden lg:block absolute ${foregroundImageFit} z-0`}
        alt="Background Image"
      />
    </ScrollParallax>
  );

  let mobileForegroundImage = (
    <Image
      source={foregroundImage}
      imageStyle={{
        zIndex: `${foregroundImageZIndex}`,
      }}
      readonly
      imageClassName={`block lg:hidden object-cover z-10`}
      alt="Background Image"
    />
  );

  let backgroundImageElement = (
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
        alt="Background Image"
      />
    </ScrollParallax>
  );

  let backgroundImageGradientOverlay = (
    <div
      className={`${
        backgroundImageFadeEnabled
          ? " bg-black/50 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent"
          : ""
      } absolute z-[1] w-full h-full`}
    ></div>
  );

  let headerTextElement = (
    <RichText
      renderBlock={(props) => (
        <h2
          className={`${resolveTextClassName(
            headingTextColour
          )} z-10 text-3xl font-black sm:text-4xl leading-tight text-left`}
        >
          {props.children}
        </h2>
      )}
      placeholder="Title text..."
      propName="title"
    />
  );

  let subheaderTextElement = (
    <RichText
      renderBlock={(props) => (
        <p
          className={`${resolveTextClassName(
            bodyTextColour
          )} z-10 text-lg lg:text-xl text-left leading-relaxed mt-2`}
        >
          {props.children}
        </p>
      )}
      placeholder="Body text..."
      propName="body"
      allowedFeatures={[
        types.RichTextFeatures.Bold,
        types.RichTextFeatures.Italic,
        types.RichTextFeatures.Highlight,
        types.RichTextFeatures.Code,
        types.RichTextFeatures.Link,
      ]}
      renderLink={(props) => (
        <a
          href={props.href}
          className={`${resolveTextClassName(
            bodyTextColour
          )} opacity-75 hover:opacity-100 cursor-pointer transition-opacity text-lg`}
        >
          {props.children}
        </a>
      )}
    />
  );

  return (
    <div
      className={`relative text-center flex-col flex justify-center content-center items-center bg-gray-800 min-h-screen h-full overflow-y-hidden`}
    >
      {/* Gradient Overlays */}
      {gradientOverlays}
      {/* Foreground Image */}
      {foregroundImageElement}

      {/* Content-Wrapper (used to limit the maximum width) */}
      <div className="max-w-[1900px] w-full relative h-full flex z-100 flex-col justify-center">
        <div className="w-full lg:w-[50vw] flex-col flex mr-auto p-10 max-w-3xl z-[100]">
          {headerTextElement}
          {subheaderTextElement}
        </div>
        {/* The Mobile Foreground Image will only be displayed on small screen sizes, and it will not have parallax by default. */}
        {mobileForegroundImage}
      </div>
      {/* Background Image Gradient Overlay */}
      {backgroundImageGradientOverlay}

      {/* Background Image */}
      {backgroundImageElement}
    </div>
  );
};

TextHero.schema = {
  name: "textHero",
  label: "Text Hero",

  previewImageUrl:
    "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/master/zSlmmtnsvMgPUu3.png",

  getDefaultProps: () => ({
    backgroundImageFadeEnabled: true,
    foregroundImageFit: "cover",
    foregroundImageParallaxEasing: 1,
    topGradientHeight: 200,
    bottomGradientHeight: 200,
  }),
  // Sidebar Edit controls for props
  sideEditProps: [
    {
      groupName: "Text",
      props: [
        {
          name: "headingTextColour",
          label: "Heading Text Colour",
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
          name: "bodyTextColour",
          label: "Body Text Colour",
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
          name: "foregroundImageZIndex",
          label: "Foreground Image Z Index",
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
    // A gradient which will help transition between different blocks on the page, especially if they are of different colours.
    // It will be applied at the background of the hero section, only at the top and bottom. It will always start from transparent, and end at the gradient colour.
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
  ],
};

export default TextHero;
