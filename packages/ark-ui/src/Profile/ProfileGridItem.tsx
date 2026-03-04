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
import { ArKUIColours, ArkUIColourValue } from "../colors";

interface ProfileGridItemProps {
  // Profile Foreground Image
  profileImage: types.IImageSource;
  profileForegroundImageWidth: number;
  profileForegroundImageHeight: number;
  profileForegroundImageLeftOffset: number;
  profileForegroundImageTopOffset: number;
  profileForegroundImageRightOffset: number;
  profileForegroundImageBottomOffset: number;

  // Background
  backgroundImage: types.IImageSource;
  backgroundColour: ArkUIColourValue;
}

const ProfileGridItem: types.Brick<ProfileGridItemProps> = ({
  // Profile Foreground Image
  profileImage,
  profileForegroundImageWidth,
  profileForegroundImageHeight,
  profileForegroundImageLeftOffset,
  profileForegroundImageTopOffset,
  profileForegroundImageRightOffset,
  profileForegroundImageBottomOffset,

  // Background
  backgroundImage,
  backgroundColour,
}) => {
  let imageContentContainer = (
    <div
      style={{
        backgroundColor: backgroundColour ? backgroundColour.color : "none",
      }}
      className="flex flex-col w-52 h-52 max-w-sm cursor-pointer rounded-full overflow-y-hidden justify-center items-center m-5 relative z-10"
    >
      {/* Profile Image Gradient Overlays */}
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
  );
  return (
    <div className="flex flex-col cursor-pointer justify-center items-center overflow-hidden m-5">
      {/* <Image
        // propName="profileImage"
        readonly
        source={profileImage}
        // aspectRatio={1}
        imageClassName="w-40 z-0 object-cover rounded-full aspect-square"
        alt=""
      /> */}

      {imageContentContainer}

      <div className="mt-3">
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

        {/* Row of icons */}
        <div className="flex mt-2 flex-row space-x-2 items-center justify-center fill-white">
          <Repeater propName="icons" />
        </div>
      </div>
    </div>
  );
};

ProfileGridItem.schema = {
  name: "profile-grid-item",
  label: "Profile Grid Item",
  category: "ark-ui",
  hideFromAddMenu: true,
  // Defaults when a new brick is added
  getDefaultProps: () => ({}),
  sideEditProps: [
    {
      groupName: "Profile Foreground Image",
      props: [
        {
          name: "profileImage",
          label: "Profile Foreground Image",
          type: types.SideEditPropType.Image,
          imageOptions: {
            aspectRatio: 1,
            quality: 100,
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
          label: "Profile Image Foreground Left Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageTopOffset",
          label: "Profile Image Foreground Top Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageRightOffset",
          label: "Profile Image Foreground Right Offset",
          type: types.SideEditPropType.Number,
        },
        {
          name: "profileForegroundImageBottomOffset",
          label: "Profile Image Foreground Bottom Offset",
          type: types.SideEditPropType.Number,
        },
      ],
    },
    {
      groupName: "Background",
      props: [
        {
          name: "backgroundImage",
          label: "Background Image",
          type: types.SideEditPropType.Image,
          imageOptions: {
            quality: 100,
          },
        },
        {
          name: "backgroundColour",
          label: "Background Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.YELLOW,
              ArKUIColours.WHITE,
              ArKUIColours.PURPLE,
              ArKUIColours.ROSE,
              ArKUIColours.TEAL,
            ],
          },
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

export default ProfileGridItem;
