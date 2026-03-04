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
import blockNames from "../blockNames";
import { ScrollParallax } from "react-just-parallax";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "../Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "../Layout/LayoutSideProps";
import { ArKUIColours, ArkUIColourValue } from "../colors";

interface IconHeroProfileProps {
  profileImage: types.IImageSource;
  profileForegroundImageWidth: number;
  profileForegroundImageHeight: number;
  profileForegroundImageLeftOffset: number;
  profileForegroundImageTopOffset: number;
  profileForegroundImageRightOffset: number;
  profileForegroundImageBottomOffset: number;
  backgroundImage: types.IImageSource;
  backgroundColour: ArkUIColourValue;
  heroBackgroundImage: types.IImageSource;
  backgroundImageParallaxEnabled: boolean;
  backgroundImageParallaxStrength: number;
  topGradientEndColour: types.IColor;
  topGradientHeight: number;
  topGradientZIndex: number;
  bottomGradientEndColour: types.IColor;
  bottomGradientHeight: number;
  bottomGradientZIndex: number;
  padding: string;
}

const IconHeroProfile: types.Brick<IconHeroProfileProps> = ({
  profileImage,
  profileForegroundImageWidth,
  profileForegroundImageHeight,
  profileForegroundImageLeftOffset,
  profileForegroundImageTopOffset,
  profileForegroundImageRightOffset,
  profileForegroundImageBottomOffset,
  backgroundImage,
  backgroundColour = ArKUIColours.TRANSPARENT.value,
  heroBackgroundImage,
  backgroundImageParallaxEnabled,
  backgroundImageParallaxStrength,
  topGradientEndColour,
  topGradientHeight,
  topGradientZIndex,
  bottomGradientEndColour,
  bottomGradientHeight,
  bottomGradientZIndex,
  padding,
}) => {
  return (
    <div
      className={`min-w-screen min-h-screen flex flex-col justify-center items-center relative bg-backgroundBlack ${padding}`}
    >
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

      <div
        style={{ backgroundColor: backgroundColour.color }}
        className="flex flex-col w-52 h-52 max-w-sm cursor-pointer rounded-full overflow-y-hidden justify-center items-center m-5 relative z-10"
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
          source={profileImage}
          readonly
          imageClassName="z-10 object-contain absolute"
          alt="Profile Foreground Image"
        />
        <Image
          source={backgroundImage}
          readonly
          imageClassName="z-[5] w-[500px] object-cover rounded-full aspect-square"
          alt="Profile Background Image"
        />
      </div>

      <div className="mt-3 max-w-lg p-5 z-10 relative">
        <Text
          propName="title"
          placeholder="Title..."
          renderPlaceholder={() => (
            <h2 className="text-center font-bold text-lg text-white">
              Title...
            </h2>
          )}
          renderBlock={({ children }) => (
            <h2 className="text-center font-bold text-lg text-white">
              {children}
            </h2>
          )}
        />
        <RichText
          renderBlock={(props) => (
            <p className="z-10 text-md font-medium text-center leading-relaxed text-gray-100">
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
        <div className="flex mt-2 flex-row space-x-2 items-center justify-center fill-white">
          <Repeater propName="icons" />
        </div>
      </div>

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
          readonly
          quality={99}
          imageClassName="object-cover relative z-0 h-full"
          alt="Background"
        />
      </ScrollParallax>
    </div>
  );
};

IconHeroProfile.schema = {
  name: "icon-profile-hero",
  label: "Icon Profile Hero",
  category: "ark-ui",
  getDefaultProps: () => ({
    profileForegroundImageWidth: 500,
    profileForegroundImageHeight: 500,
    profileForegroundImageLeftOffset: 0,
    profileForegroundImageTopOffset: 0,
    topGradientEndColour: ArKUIColours.TRANSPARENT.value,
    bottomGradientEndColour: ArKUIColours.TRANSPARENT.value,
    topGradientHeight: 200,
    topGradientZIndex: 1,
    bottomGradientHeight: 200,
    bottomGradientZIndex: 1,
  }),
  sideEditProps: [
    {
      groupName: "Images",
      props: [
        {
          name: "profileImage",
          label: "Profile Foreground Image",
          type: types.SideEditPropType.Image,
        },
        {
          name: "backgroundImage",
          label: "Profile Background Image",
          type: types.SideEditPropType.Image,
        },
        {
          name: "heroBackgroundImage",
          label: "Hero Background Image",
          type: types.SideEditPropType.Image,
        },
      ],
    },
    {
      groupName: "Layout",
      props: [
        {
          name: "padding",
          label: "Padding",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "lg:p-60 p-8", label: "Big Padding" },
              { value: "lg:p-40 p-6", label: "Medium Padding" },
              { value: "lg:p-20 p-4", label: "Regular Padding" },
              { value: "lg:p-10 p-2", label: "Small Padding" },
              { value: "lg:p-0 p-0", label: "No Padding" },
            ],
          },
        },
      ],
    },
    {
      groupName: "Styling",
      props: [
        {
          name: "backgroundColour",
          label: "Background Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.YELLOW,
              ArKUIColours.WHITE,
              ArKUIColours.BLACK,
              ArKUIColours.PURPLE,
              ArKUIColours.GREEN,
              ArKUIColours.ROSE,
              ArKUIColours.TEAL,
            ],
          },
        },
      ],
    },
    {
      groupName: "Offsets",
      props: [
        {
          name: "profileForegroundImageWidth",
          label: "Profile Image Width (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageHeight",
          label: "Profile Image Height (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageLeftOffset",
          label: "Left Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageRightOffset",
          label: "Right Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageTopOffset",
          label: "Top Offset (px)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageBottomOffset",
          label: "Bottom Offset (px)",
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
      name: "icons",
      itemType: blockNames.IconLink,
      itemLabel: "Icon Link",
      min: 0,
    },
  ],
};

export default IconHeroProfile;
