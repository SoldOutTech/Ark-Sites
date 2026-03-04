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
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "./Layout/LayoutSideProps";

interface EventInfoHeroProps {
  // Text
  backgroundTitleText: string;
  showBackgroundTitleText: boolean;

  // Image
  blackAndWhite: boolean;
  backgroundImage: types.IImageSource;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;
  rightContentImageTop: types.IImageSource;
  rightContentImageBottom: types.IImageSource;

  // Gradient Overlay
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;
}

const EventInfoHero: types.Brick<EventInfoHeroProps> = ({
  showBackgroundTitleText,
  backgroundTitleText,
  backgroundImage,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,
  rightContentImageTop,
  rightContentImageBottom,
  // Gradient overlay
  topGradientEndColour,
  topGradientHeight,
  topGradientZIndex,
  bottomGradientEndColour,
  bottomGradientHeight,
  bottomGradientZIndex,
}) => {
  const { isAdmin } = useAdminContext();
  return (
    <div
      className={`relative text-center flex-col flex justify-center content-center items-center bg-gray-800 min-h-screen overflow-y-hidden`}
    >
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

      {/* Content-Wrapper (used to limit the maximum width) */}
      <div className="max-w-[1900px] flex flex-col md:flex-row w-full relative min-h-screen justify-center">
        {/* LEFT CONTENT: We use this to limit the width to just half-width */}
        <div className="w-full justify-center min-h-screen xl:w-[50vw] z-10 mr-auto p-10 md:pt-20 md:pl-20 md:pb-20 md:pr-10 max-w-3xl flex flex-col">
          {/* Wrap this element in a div and add a bottom margin of auto */}
          <div className="mb-auto">
            <Text
              renderBlock={(props) => (
                <div className="relative">
                  <h2 className="mb-auto z-20 text-4xl md:text-5xl font-black text-white leading-tight text-left">
                    {props.children}
                  </h2>
                  {/* Background Text */}
                  {showBackgroundTitleText ? (
                    <h2 className="absolute md:-top-6 opacity-0 md:opacity-5 md:-left-20 z-10 mb-auto text-3xl md:text-6xl font-black text-white leading-tight text-left">
                      {backgroundTitleText}
                    </h2>
                  ) : (
                    ""
                  )}
                </div>
              )}
              renderPlaceholder={(props) => (
                <h2 className="mb-auto z-20 text-4xl md:text-5xl font-black text-white leading-tight text-left">
                  Title...
                </h2>
              )}
              placeholder="Title..."
              propName="title"
            />
          </div>

          {/* Wrap the content beneath the main title to group it together so we can keep it around the middle of the page. */}
          <div className="mb-auto">
            <Text
              renderBlock={(props) => (
                <h2 className="z-10 text-4xl md:text-5xl font-black text-white leading-tight text-left">
                  {props.children}
                </h2>
              )}
              placeholder="Important Detail..."
              propName="importantDetailHeader"
            />

            {/* Location Subheader */}
            <RichText
              renderBlock={(props) => (
                <p className="z-10  font-[600] text-2xl text-left leading-relaxed text-gray-100">
                  {props.children}
                </p>
              )}
              placeholder="Important Detail..."
              propName="otherDetailSubheader"
              allowedFeatures={[
                types.RichTextFeatures.Bold,
                types.RichTextFeatures.Italic,
                types.RichTextFeatures.Highlight,
                types.RichTextFeatures.Code,
                types.RichTextFeatures.Link,
              ]}
              renderCode={(props) => (
                <code className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-700 rounded">
                  {props.children}
                </code>
              )}
              renderLink={(props) => (
                <Link
                  target="_blank"
                  href={props.href}
                  className="text-gray-200 hover:text-white cursor-pointer"
                >
                  {props.children}
                </Link>
              )}
            />
            {/* Body Text */}
            <RichText
              renderBlock={(props) => (
                <p className="z-10 text-lg mt-5 font-medium text-left leading-relaxed text-gray-100">
                  {props.children}
                </p>
              )}
              placeholder="Subheader..."
              propName="detailBody"
              allowedFeatures={[
                types.RichTextFeatures.Bold,
                types.RichTextFeatures.Italic,
                types.RichTextFeatures.Highlight,
                types.RichTextFeatures.Code,
                types.RichTextFeatures.Link,
              ]}
              renderCode={(props) => (
                <code className="text-sm py-1 px-2 bg-gray-200 rounded">
                  {props.children}
                </code>
              )}
              renderLink={(props) => (
                <Link
                  target="_blank"
                  href={props.href}
                  className="text-gray-200 hover:text-white cursor-pointer"
                >
                  {props.children}
                </Link>
              )}
            />
            {/* CTA Button */}
            <Repeater
              propName="callToActionButtons"
              renderWrapper={(children) => (
                <div className="mt-8 flex flex-wrap gap-4">{children}</div>
              )}
            />
          </div>
        </div>

        {/* RIGHT CONTENT: We use this for any images that we want to display on the right side (hidden on mobile) */}
        {/*  We also check if we have any images to display and only render the container if we do */}
        {/* We need to check if we are in admin mode */}
        {(isAdmin || rightContentImageTop || rightContentImageBottom) && (
          <div className="w-full z-10 flex flex-col items-center justify-center h-screen space-y-4 p-20 pl-40">
            <Image
              imageClassName="max-w-2xl w-full"
              alt=""
              propName="rightContentImageTop"
            />

            <Image
              imageClassName="max-w-2xl w-full"
              alt=""
              propName="rightContentImageBottom"
            />
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute z-[1] bg-black/50 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent w-full h-full"></div>

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
    </div>
  );
};

EventInfoHero.schema = {
  name: "eventInfoHero",
  label: "Event Hero",

  previewImageUrl:
    "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/master/AS1XL-JEwneRW86.png",

  getDefaultProps: () => ({
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    topGradientHeight: 200,
    topGradientZIndex: 1,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 1,
  }),
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
      ],
    },
    {
      groupName: "Image",
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
      name: "callToActionButtons",
      itemType: "button-link",
      itemLabel: "CTA Button",
      max: 1,
    },
  ],
};

export default EventInfoHero;
