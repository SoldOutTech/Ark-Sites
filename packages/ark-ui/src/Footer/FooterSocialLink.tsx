"use client";

import blockNames from "../blockNames";
import React from "react";
import { Text, types, Link, Image } from "react-bricks/frontend";

interface FooterSocialLinkProps {
  linkPath: string;
  image: types.IImageSource;
}

const FooterSocialLink: types.Brick<FooterSocialLinkProps> = ({
  linkPath,
  image,
}) => {
  return (
    <Link
      href={linkPath}
      target="_blank"
      className="opacity-70 hover:opacity-100 ease-in-out duration-300 transition-opacity"
    >
      <Image
        source={image}
        readonly
        alt="Social Media Icon"
        imageClassName="w-[25px] object-contain"
      />
    </Link>
  );
};

FooterSocialLink.schema = {
  name: blockNames.FooterSocialLink,
  label: "Link",
  category: "layout",
  hideFromAddMenu: true,
  // tags: [],

  // Defaults when a new brick is added
  getDefaultProps: () => ({
    linkPath: "http://youtube.com/",
    image: {
      hashId: "GmNBHtA-NMRfIQh",
      src: "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/original/efdpM9tiU89xDab.webp",
      srcSet:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-1600.webp 1600w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-1200.webp 1200w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-800.webp 800w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-400.webp 400w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-200.webp 200w",
      type: "image/webp",
      placeholderSrc:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/placeholder/efdpM9tiU89xDab.jpg",
      fallbackSrc:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/original/efdpM9tiU89xDab.png",
      fallbackSrcSet:
        "https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-1600.png 1600w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-1200.png 1200w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-800.png 800w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-400.png 400w,\nhttps://assets.reactbricks.com/k_nYc5liEhSJoo6/images/src_set/efdpM9tiU89xDab-200.png 200w",
      fallbackType: "image/png",
      height: 2239,
      width: 2241,
      alt: "London ICC Logo",
      seoName: "licclogolarge",
      crop: {
        x: 107,
        y: 0,
        width: 2241,
        height: 2239,
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

  // Sidebar Edit controls for props
  sideEditProps: [
    {
      name: "image",
      label: "Image",
      type: types.SideEditPropType.Image,
    },
    {
      name: "linkPath",
      label: "Link to...",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default FooterSocialLink;
