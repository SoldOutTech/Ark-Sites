"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faWhatsapp,
  faYoutube,
  faSpotify,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faLocationDot,
  faGlobe as faLink,
} from "@fortawesome/free-solid-svg-icons";
import { types, Link, Image, Text, RichText } from "react-bricks/frontend";

enum IconType {
  instagram = "instagram",
  facebook = "facebook",
  youtube = "youtube",
  spotify = "spotify",
  apple = "apple",
  phone = "phone",
  whatsapp = "whatsapp",
  faLocationDot = "faLocationDot",
  link = "link",
}
interface IconLinkProps {
  href?: string;
  iconType?: IconType;
}

const resolveIcon = (iconType: IconType) => {
  switch (iconType) {
    case IconType.instagram:
      return faInstagram;
    case IconType.facebook:
      return faFacebook;
    case IconType.youtube:
      return faYoutube;
    case IconType.spotify:
      return faSpotify;
    case IconType.apple:
      return faApple;
    case IconType.phone:
      return faPhone;
    case IconType.whatsapp:
      return faWhatsapp;
    case IconType.faLocationDot:
      return faLocationDot;
    case IconType.link:
      return faLink;
  }
};

const IconLink: types.Brick<IconLinkProps> = ({ href, iconType }) => (
  <div className="w-8 h-8 flex justify-center items-center">
    <Link
      href={href}
      target="_blank"
      className="flex flex-col opacity-50 hover:opacity-100 transition-opacity duration-300"
    >
      <FontAwesomeIcon
        color="white"
        className="w-6 h-6"
        icon={resolveIcon(iconType ?? IconType.instagram)}
        size="2x"
      />
    </Link>
  </div>
);

IconLink.schema = {
  name: "icon-link",
  label: "Icon",
  category: "ark-ui",
  hideFromAddMenu: true,
  // Defaults when a new brick is added
  getDefaultProps: () => ({
    iconType: IconType.instagram,
  }),
  sideEditProps: [
    {
      name: "iconType",
      label: "Icon Type",
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Select,
        options: [
          { value: IconType.instagram, label: "Instagram" },
          { value: IconType.facebook, label: "Facebook" },
          { value: IconType.youtube, label: "Youtube" },
          { value: IconType.spotify, label: "Spotify" },
          { value: IconType.apple, label: "Apple" },
          { value: IconType.phone, label: "Phone" },
          { value: IconType.whatsapp, label: "Whatsapp" },
          { value: IconType.faLocationDot, label: "Location" },
          { value: IconType.link, label: "Link" },
        ],
      },
    },
    {
      name: "href",
      label: "Link",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default IconLink;
