"use client";

import React from "react";
import {
  types,
  Link,
  Image,
  Text,
  RichText,
  Repeater,
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

interface HeroProfileProps {
  // Profile
  profileMarginTop: number;

  // Profile Foreground Image
  profileForegroundImage: types.IImageSource;
  profileForegroundImageWidth: number;
  profileForegroundImageHeight: number;
  profileForegroundImageLeftOffset: number;
  profileForegroundImageTopOffset: number;
  profileForegroundImageRightOffset: number;
  profileForegroundImageBottomOffset: number;

  // Foreground Parallax
  profileForegroundImageParallaxEnabled: boolean;
  profileForegroundImageParallaxStrength: number;
  profileForegroundImageParallaxEasing: number;

  // Profile Background Image
  profileBackgroundImage: types.IImageSource;

  // Background Image
  heroBackgroundImage: types.IImageSource;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;

  // Gradient
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;
}

const HeroProfile: types.Brick<HeroProfileProps> = ({
  // Profile
  profileMarginTop,
  // Profile Foreground Image
  profileForegroundImage,
  profileForegroundImageWidth = "500",
  profileForegroundImageHeight = "500",
  profileForegroundImageLeftOffset = "0",
  profileForegroundImageTopOffset = "0",
  profileForegroundImageRightOffset,
  profileForegroundImageBottomOffset,

  // Foreground Parallax
  profileForegroundImageParallaxEnabled,
  profileForegroundImageParallaxStrength,
  profileForegroundImageParallaxEasing,

  // Profile Background image
  profileBackgroundImage,

  // Background Image
  heroBackgroundImage,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,

  // Gradient
  topGradientEndColour,
  topGradientZIndex,
  topGradientHeight,
  bottomGradientZIndex,
  bottomGradientHeight,
  bottomGradientEndColour,
}) => {
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
        source={heroBackgroundImage}
        quality={99}
        readonly
        imageClassName="object-cover absolute top-0 left-0 z-0 h-full w-full"
        alt="Background Image"
      />
    </ScrollParallax>
  );

  let backgroundGradientOverlays = (
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

  let foregroundImageContent = (
    <ScrollParallax
      zIndex={10}
      // lerpEase={0.9}
      // strength={-0.08}
      strength={
        profileForegroundImageParallaxEnabled
          ? profileForegroundImageParallaxStrength
          : 0
      }
      lerpEase={profileForegroundImageParallaxEasing}
      shouldPause
      isAbsolutelyPositioned={true}
    >
      <Image
        imageStyle={{
          width: `${profileForegroundImageWidth}px`,
          height: `${profileForegroundImageHeight}px`,
          left: `${profileForegroundImageLeftOffset}px`,
          right: `${profileForegroundImageRightOffset}px`,
          bottom: `${profileForegroundImageBottomOffset}px`,
          top: `${profileForegroundImageTopOffset}px`,
        }}
        source={profileForegroundImage}
        readonly
        imageClassName="z-10 object-cover absolute"
        alt="Profile Foreground Image"
      />
    </ScrollParallax>
  );

  return (
    <div className="min-w-screen min-h-screen flex flex-col justify-center items-center relative">
      {/* Gradient Overlays */}
      {backgroundGradientOverlays}

      {/* Image Content Container */}
      <div
        style={{
          marginTop: `${profileMarginTop}em`,
        }}
        className="flex flex-col cursor-pointer rounded-full lg:rounded-none overflow-y-hidden justify-center items-center m-5 relative z-10"
      >
        {/* Profile Image */}
        {foregroundImageContent}

        <Image
          source={profileBackgroundImage}
          readonly
          imageClassName="z-[5] w-[500px] object-cover rounded-full aspect-square"
          alt="Profile Background Image"
        />
      </div>

      {/* Subheading Wrapper - Used to add a fade behind the content */}
      <div className="w-screen relative z-[10] flex flex-col items-center bg-backgroundBlack">
        <GradientFadeOverlay
          zIndex={topGradientZIndex}
          height={topGradientHeight}
          topOffset={-topGradientHeight}
          direction={GradientOverlayPosition.bottom}
          tailwindColour={
            topGradientEndColour ? topGradientEndColour.color : ""
          }
        />

        {/* Subheading Content */}
        <div className="mt-3 max-w-lg  p-5 z-10 relative lg:top-[-100px]">
          <RichText
            propName="subheadingTitle"
            placeholder="Title..."
            renderPlaceholder={() => (
              <h2 className="text-center text-xl text-white">Title...</h2>
            )}
            renderBlock={({ children }) => (
              <h2 className="text-center  text-xl text-white">{children}</h2>
            )}
          />
          {/* Spacer */}
          <div className="w-full h-3"></div>
          <RichText
            renderBlock={(props) => (
              <p className="z-10 text-sm font-medium text-center leading-relaxed text-gray-100">
                {props.children}
              </p>
            )}
            placeholder="Body text..."
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
        </div>
      </div>
      {/* Background Image */}
      {backgroundImageWithParallax}
    </div>
  );
};

HeroProfile.schema = {
  name: "profile-hero",
  label: "Large Profile Hero",
  category: "ark-ui",
  // Defaults when a new brick is added
  getDefaultProps: () => ({
    // GRADIENT
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    topGradientHeight: 200,
    topGradientZIndex: 10,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 10,

    // Profile
    profileMarginTop: 0,
    profileForegroundImageWidth: 500,
    profileForegroundImageHeight: 500,
    profileForegroundImageLeftOffset: 0,
    profileForegroundImageTopOffset: 0,

    // Parallax
    profileForegroundImageParallaxEnabled: true,
    profileForegroundImageParallaxStrength: -0.08,
    profileForegroundImageParallaxEasing: 0.9,
  }),
  sideEditProps: [
    {
      groupName: "Profile Foreground",
      props: [
        {
          name: "profileForegroundImage",
          label: "Profile Image Foreground",
          helperText: "Displayed on the profile item's foreground.",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 100,
            maxWidth: 5120,
          },
        },
        {
          name: "profileForegroundImageWidth",
          label: "Profile Image Foreground Width",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageHeight",
          label: "Profile Image Foreground Height",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageLeftOffset",
          label: "Profile Image Foreground Left Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageRightOffset",
          label: "Profile Image Foreground Right Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageTopOffset",
          label: "Profile Image Foreground Top Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageBottomOffset",
          label: "Profile Image Foreground Bottom Offset (px)",
          type: types.SideEditPropType.Number,
        },
        // Profile Foreground Image parallax
        {
          name: "profileForegroundImageParallaxEnabled",
          label: "Profile Image Foreground Parallax",
          type: types.SideEditPropType.Boolean,
        },
        {
          name: "profileForegroundImageParallaxStrength",
          label: "Profile Image Foreground Parallax Strength (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageParallaxEasing",
          label: "Profile Image Foreground Parallax Easing",
          type: types.SideEditPropType.Number,
          helperText:
            "The higher this value, the quicker the parallax will react to scroll / mouse movement.",
        },
      ],
    },
    {
      groupName: "Profile Background",
      props: [
        {
          name: "profileBackgroundImage",
          label: "Profile Image Background",
          helperText: "Displayed on the profile item's background.",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 100,
            maxWidth: 5120,
            aspectRatio: 1,
          },
        },
      ],
    },
    {
      groupName: "Background",
      props: [
        {
          name: "heroBackgroundImage",
          label: "Background Image",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 100,
            maxWidth: 5120,
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
    {
      groupName: "Layout",
      props: [
        {
          name: "profileMarginTop",
          label: "Profile Margin Top (em)",
          type: types.SideEditPropType.Number,
        },
      ],
    },
  ],
};

export default HeroProfile;
