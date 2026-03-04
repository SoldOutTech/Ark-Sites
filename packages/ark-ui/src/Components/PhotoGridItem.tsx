"use client";

import React from "react";
import { types, Link, Image, Text } from "react-bricks/frontend";

interface PhotoGridItemProps {
  backgroundImage: types.IImageSource;
  backgroundImageFadeEnabled: boolean;
  title: string;
  href: string;
}

const PhotoGridItem: types.Brick<PhotoGridItemProps> = ({
  backgroundImageFadeEnabled,
  href,
}) => (
  <div className="flex relative cursor-pointer overflow-hidden">
    <Link
      className="flex flex-col justify-center items-center"
      href={href}
      target="_blank"
    >
      <div className="absolute z-10">
        <Text
          propName="title"
          placeholder="Title..."
          renderBlock={({ children }) => (
            <h2 className="text-center font-bold text-4xl text-white">
              {children}
            </h2>
          )}
        />
      </div>

      {/* Image Overlay Fade */}
      <div
        className={`absolute z-[1] w-full h-full pointer-events-none ${
          backgroundImageFadeEnabled ? "bg-black opacity-40" : ""
        }`}
      ></div>
      <Image
        propName="backgroundImage"
        aspectRatio={1}
        imageClassName="z-0 object-cover aspect-square transition-all duration-500 hover:scale-110"
        alt=""
      />
    </Link>
  </div>
);

PhotoGridItem.schema = {
  name: "photo-grid-item",
  label: "Photo Grid Item",
  category: "ark-ui",
  hideFromAddMenu: true,
  // Defaults when a new brick is added
  getDefaultProps: () => ({
    title: "Title",
    backgroundImageFadeEnabled: true,
    backgroundImage: {
      hashId: "JOkxD0uatJr782j",
      src: "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/original/yekTTlRysGsxkTF.webp",
      srcSet:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-1600.webp 1600w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-1200.webp 1200w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-800.webp 800w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-400.webp 400w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-200.webp 200w",
      type: "image/webp",
      placeholderSrc:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/placeholder/yekTTlRysGsxkTF.jpg",
      fallbackSrc:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/original/yekTTlRysGsxkTF.jpeg",
      fallbackSrcSet:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-1600.jpeg 1600w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-1200.jpeg 1200w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-800.jpeg 800w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-400.jpeg 400w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/yekTTlRysGsxkTF-200.jpeg 200w",
      fallbackType: "image/jpeg",
      height: 3648,
      width: 5472,
      alt: "",
      seoName: "wembley-choir-concert",
      crop: {
        x: 0,
        y: 0,
        width: 5472,
        height: 3648,
      },
      transform: {
        rotate: 0,
        flip: {
          horizontal: false,
          vertical: false,
        },
      },
    },
  }),
  sideEditProps: [
    {
      name: "backgroundImage",
      label: "Background Image",
      type: types.SideEditPropType.Image,
    },
    // Background Image Fade
    {
      name: "backgroundImageFadeEnabled",
      label: "Background Image Fade",
      type: types.SideEditPropType.Boolean,
    },
    {
      name: "href",
      label: "Link",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default PhotoGridItem;
