"use client";

import { types, Link } from "react-bricks/frontend";

interface ButtonLinkProps {
  text: string;
  href: string;
}

const ButtonLink: types.Brick<ButtonLinkProps> = ({ href, text }) => (
  <Link
    href={href}
    target="_blank"
    className="relative z-10 px-5 py-2 border-[2px] border-white text-white rounded-sm font-semibold transition-all duration-300 ease-in-out transform hover:bg-white hover:text-backgroundBlack hover:scale-105"
  >
    {text}
  </Link>
);

ButtonLink.schema = {
  name: "button-link",
  label: "Button",
  category: "ark-ui",
  hideFromAddMenu: false,
  getDefaultProps: () => ({
    text: "Click Me",
    href: "#",
  }),
  sideEditProps: [
    {
      name: "text",
      label: "Text",
      type: types.SideEditPropType.Text,
    },
    {
      name: "href",
      label: "Link",
      type: types.SideEditPropType.Text,
    },
  ],
};

export default ButtonLink;
