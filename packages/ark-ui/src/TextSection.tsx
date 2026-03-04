"use client";

import {
  Text,
  RichText,
  Image,
  useAdminContext,
  Repeater,
} from "react-bricks/frontend";
import React, { useRef } from "react";
import { types } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "./colors";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "./Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "./Layout/LayoutSideProps";
import { HeaderLevel, HeaderText, TextAlignment } from "./Components/Text";
import { motion } from "framer-motion";

interface TextSectionProps {
  bodyTextColour: ArkUIColourValue;
  headingTextColour: ArkUIColourValue;
  backgroundColour: types.IColor;

  showHeaders: boolean;
  showBody: boolean;
  buttonLinks?: types.RepeaterItems[];

  // Image Content
  headingImage?: types.IImageSource;
  headingImageWidth?: number;
  headingImageHeight?: number;

  // Gradient overlay
  topGradientEndColour: ArkUIColourValue;
  topGradientHeight: number;
  bottomGradientEndColour: ArkUIColourValue;
  bottomGradientHeight: number;

  // Layout
  padding: string;
  animateOnScroll?: boolean;
}

const TextSection: types.Brick<TextSectionProps> = ({
  // Text Content
  bodyTextColour,
  headingTextColour,
  backgroundColour,
  showHeaders = true,
  showBody = true,
  buttonLinks,

  // Image Content
  headingImage,
  headingImageWidth,
  headingImageHeight,

  // Gradient overlay
  topGradientEndColour = ArKUIColours.TRANSPARENT.value,
  topGradientHeight,
  bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
  bottomGradientHeight,

  // Layout
  padding,
  animateOnScroll,
}) => {
  const resolveTextClassName = (colour?: ArkUIColourValue) =>
    colour?.textClassName || (colour?.className || "").replace(/^bg-/, "text-");

  let gradientOverlays = (
    <>
      <GradientFadeOverlay
        zIndex={0}
        height={topGradientHeight}
        direction={GradientOverlayPosition.top}
        tailwindColour={topGradientEndColour.color}
      />
      <GradientFadeOverlay
        zIndex={0}
        height={bottomGradientHeight}
        direction={GradientOverlayPosition.bottom}
        tailwindColour={bottomGradientEndColour.color}
      />
    </>
  );

  let bodyTextElement = (
    <RichText
      renderBlock={(props) => (
        <p
          style={{
            color: bodyTextColour?.color || undefined,
          }}
          className={`${resolveTextClassName(
            bodyTextColour
          )} z-10 text-lg lg:text-xl text-center leading-relaxed mt-2 font-medium max-w-3xl`}
        >
          {props.children}
        </p>
      )}
      renderPlaceholder={(props) => <p>{props.children}</p>}
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
          )} opacity-75 hover:opacity-100 cursor-pointer transition-opacity`}
        >
          {props.children}
        </a>
      )}
    />
  );

  let headingImageElement = (
    <Image
      imageStyle={{
        width: headingImageWidth ? `${headingImageWidth}rem` : "100%",
        height: headingImageHeight ? `${headingImageHeight}rem` : "100%",
      }}
      propName="headingImage"
      source={headingImage}
      alt="Heading Image"
      imageClassName="w-full h-full mb-12 object-cover"
    />
  );

  let content = (
    <>
      {headingImage && headingImageElement}

      {showHeaders ? (
        <>
          <HeaderText
            showBackgroundTitleText={false}
            propName="title"
            placeholder="Title text..."
            headerLevel={HeaderLevel.h2}
            backgroundTitleText=""
            textColour={headingTextColour}
            alignment={TextAlignment.center}
          />
          <HeaderText
            showBackgroundTitleText={false}
            propName="subtitle"
            placeholder="Subtitle text..."
            headerLevel={HeaderLevel.h3}
            backgroundTitleText=""
            textColour={headingTextColour}
            alignment={TextAlignment.center}
          />
        </>
      ) : (
        ""
      )}

      {showBody ? bodyTextElement : ""}
      <Repeater
        propName="buttonLinks"
        renderWrapper={(children) => (
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {children}
          </div>
        )}
      />
    </>
  );

  let { isAdmin } = useAdminContext();
  let shouldAnimateOnScroll = animateOnScroll && !isAdmin;

  return (
    <div
      style={{ backgroundColor: backgroundColour.color }}
      className={`relative ${padding} text-center flex-col flex justify-center content-center items-center`}
    >
      {/* Gradient Overlays */}
      {gradientOverlays}

      {shouldAnimateOnScroll ? (
        <motion.div
          className="flex flex-col justify-center items-center"
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          viewport={{
            once: true,
            margin: "0px 0px -200px 0px",
          }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </div>
  );
};

TextSection.schema = {
  name: "textSection",
  label: "Text Section",
  previewImageUrl: "/bricks-preview-images/textSection.png",

  getDefaultProps: () => ({
    backgroundColour: ArKUIColours.BLACK.value,
    bodyTextColour: ArKUIColours.WHITE.value,
    showHeaders: true,
    showBody: true,
    animateOnScroll: false,
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
      groupName: "Text",
      props: [
        // Header text colour
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
        // Body text colour
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
        // Show Headers
        {
          name: "showHeaders",
          label: "Show Headers",
          type: types.SideEditPropType.Boolean,
        },
        // Show Body
        {
          name: "showBody",
          label: "Show Body",
          type: types.SideEditPropType.Boolean,
        },
      ],
    },
    // Image Content
    {
      groupName: "Image",
      props: [
        {
          name: "headingImage",
          label: "Heading Image",
          type: types.SideEditPropType.Image,
        },
        {
          name: "headingImageWidth",
          label: "Heading Image Width (rem)",
          type: types.SideEditPropType.Number,
        },
        {
          name: "headingImageHeight",
          label: "Heading Image Height (rem)",
          type: types.SideEditPropType.Number,
        },
      ],
    },
    {
      groupName: "Background",
      props: [
        {
          name: "backgroundColour",
          label: "Background Colour",
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
        // Animate on Scroll
        {
          name: "animateOnScroll",
          label: "Animate on Scroll",
          type: types.SideEditPropType.Boolean,
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
        gradientBottomEndColourProps,
        {
          name: "bottomGradientHeight",
          label: "Bottom Gradient Height (px)",
          type: types.SideEditPropType.Number,
        },
      ],
    },
  ],
};

export default TextSection;
