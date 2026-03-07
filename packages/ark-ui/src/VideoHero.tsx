"use client";

import { Text, RichText, Image, Repeater } from "react-bricks/frontend";
import React, { useRef, useState, ElementType } from "react";
import { types } from "react-bricks/frontend";
import { AutoTextSize } from "auto-text-size";
import { ScrollParallax } from "react-just-parallax";
import dynamic from "next/dynamic.js";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import { ArKUIColours } from "./colors";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "./Layout/LayoutSideProps";

const NoSSRReactPlayer = dynamic(
  () => import("react-player/lazy").then((mod) => mod.default),
  { ssr: false }
);

interface VideoHeroProps {
  // Image
  youTubeVideoURL: string;
  videoParallaxStrength: number;
  videoParallaxEnabled: boolean;

  //TEXT
  textParallaxEnabled: boolean;
  maxFontSize: number;

  // Button Links
  buttonLinks?: types.RepeaterItems[];

  // First Line
  firstLineText: string;
  firstLineBold: boolean;
  firstLineUppercase: boolean;

  // Second Line
  secondLineText: string;
  secondLineBold: boolean;
  secondLineUppercase: boolean;

  // Padding & Borders
  lineHeight: Number;
  maxTextWidth: String;

  // Gradient Overlay
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;

  // Heading Level
  headingLevel: string;
}

const VideoHero: types.Brick<VideoHeroProps> = ({
  youTubeVideoURL,
  videoParallaxStrength,
  videoParallaxEnabled,

  textParallaxEnabled,
  maxFontSize,

  firstLineText,
  firstLineBold,
  firstLineUppercase,

  buttonLinks,

  secondLineText,
  secondLineBold,
  secondLineUppercase,

  lineHeight,
  maxTextWidth,

  // Gradient overlay
  topGradientEndColour = ArKUIColours.TRANSPARENT.value,
  topGradientHeight,
  topGradientZIndex,
  bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
  bottomGradientHeight,
  bottomGradientZIndex,

  // Heading Level
  headingLevel = "h2",
}) => {
  const [videoReady, setVideoReady] = useState(false);

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

  return (
    <div
      className={`relative text-center flex-col flex justify-center content-center items-center h-screen overflow-hidden`}
    >
      {/* <ScrollParallax
        zIndex={9}
        strength={videoParallaxEnabled ? videoParallaxStrength : 0}
        shouldPause
        isAbsolutelyPositioned={true}
      >
        <YouTube videoId={youTubeVideoID} />
      </ScrollParallax> */}

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

      <ScrollParallax
        zIndex={50}
        strength={textParallaxEnabled ? 0.14 : 0}
        shouldPause
        isAbsolutelyPositioned={true}
      >
        {/* This is displayed on large screens */}
        <div
          className={`max-w-${maxTextWidth} flex relative z-0 flex-col justify-center content-center w-3/4 h-full mx-auto`}
        >
          <AutoTextSize
            fontSizePrecisionPx={0.1}
            maxFontSizePx={maxFontSize}
            style={{ lineHeight: `${lineHeight}` }}
            className={`text-white ${firstLineBold ? "font-bold" : ""} ${
              firstLineUppercase ? "uppercase" : ""
            } leading-[${lineHeight}rem]`}
          >
            <HeadingTag>{firstLineText}</HeadingTag>
          </AutoTextSize>
          <AutoTextSize
            maxFontSizePx={maxFontSize}
            style={{ lineHeight: `${lineHeight}` }}
            className={`text-white ${secondLineBold ? "font-bold" : ""} ${
              secondLineUppercase ? "uppercase" : ""
            } leading-[${lineHeight}rem]`}
          >
            {secondLineText}
          </AutoTextSize>

          {/* Container for Call to Action buttons */}
          <div className="flex-col flex justify-center content-center items-center w-full">
            <Repeater
              propName="buttonLinks"
              renderWrapper={(children) => (
                <div className="flex flex-wrap gap-4 flex-col justify-center mt-6">
                  {children}
                </div>
              )}
            />
          </div>
        </div>
      </ScrollParallax>

      <ScrollParallax
        zIndex={5}
        strength={videoParallaxEnabled ? videoParallaxStrength : 0}
        shouldPause
        isAbsolutelyPositioned={true}
      >
        <div>
          <div
            className={`${
              videoReady ? "opacity-0" : "opacity-100"
            } transition-opacity ease-in-out duration-300 absolute top-0 left-0 w-full h-full bg-black z-10`}
          />
          <div className="absolute inset-0 overflow-hidden z-10 w-full h-full bg-black opacity-40"></div>
          <NoSSRReactPlayer
            controls={false}
            loop
            playsinline
            playing
            muted
            width="100%"
            height="100vh"
            className={`video-background`}
            onStart={() => {
              setVideoReady(true);
            }}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  fs: 0,
                  iv_load_policy: 3, // hides annotations
                  disablekb: 1,
                },
              },
            }}
            url={youTubeVideoURL}
          />
        </div>
      </ScrollParallax>
    </div>
  );
};

VideoHero.schema = {
  name: "videoHero",
  label: "Video Hero",

  previewImageUrl:
    "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/master/EwmpEAw84kbtURi.png",

  getDefaultProps: () => ({
    firstLineText: "First Line",
    firstLineBold: true,
    firstLineUppercase: true,
    secondLineText: "Second Line",
    secondLineBold: true,
    secondLineUppercase: true,
    lineHeight: 1,
    headingLevel: "h2",

    //IMAGE
    backgroundImageParallaxStrength: 0.14,
    foregroundImageParallaxStrength: 0.14,

    //LAYOUT
    maxTextWidth: "3xl",

    //GRADIENT
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    topGradientHeight: 200,
    topGradientZIndex: 1,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 1,
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
      groupName: "Video",
      props: [
        {
          name: "youTubeVideoURL",
          label: "YouTube Video URL",
          type: types.SideEditPropType.Text,
        },
        {
          name: "videoParallaxEnabled",
          label: "Video Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "videoParallaxStrength",
          label: "Background Video Parallax Strength",
          type: types.SideEditPropType.Number,
        },
      ],
    },
    {
      groupName: "Text",
      props: [
        {
          name: "firstLineText",
          label: "Text",
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
          name: "secondLineText",
          label: "Text",
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
          name: "headingLevel",
          label: "Heading Level",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "h1", label: "H1" },
              { value: "h2", label: "H2" },
              { value: "h3", label: "H3" },
              { value: "h4", label: "H4" },
              { value: "h5", label: "H5" },
              { value: "h6", label: "H6" },
              { value: "div", label: "None (div)" },
            ],
          },
          helperText:
            "Select the appropriate heading tag. Use H1 only once per page, ideally for the primary title. Proper heading structure is vital for good SEO and accessibility.",
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

export default VideoHero;
