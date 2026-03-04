"use client";

import { Text, RichText, useAdminContext } from "react-bricks/frontend";
import React, { useState } from "react";
import { types } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "../colors";
import {
  GradientFadeOverlay,
  GradientOverlayPosition,
} from "../Components/GradientOverlay";
import {
  gradientBottomEndColourProps,
  gradientTopEndColourProps,
} from "../Layout/LayoutSideProps";
import {
  BodyText,
  HeaderLevel,
  HeaderText,
  TextAlignment,
  TextSize,
} from "../Components/Text";
import { Collapsible } from "../Collapsible/Collapsible";
import { motion } from "framer-motion";

// Enum Tailwind max width levels
enum MaxWLevel {
  xs = "max-w-xs",
  sm = "max-w-sm",
  md = "max-w-md",
  lg = "max-w-lg",
  xl = "max-w-xl",
  "2xl" = "max-w-2xl",
  "3xl" = "max-w-3xl",
  "4xl" = "max-w-4xl",
  "5xl" = "max-w-5xl",
  "6xl" = "max-w-6xl",
  "7xl" = "max-w-7xl",
  "8xl" = "max-w-8xl",
  "9xl" = "max-w-9xl",
  full = "max-w-full",
}

const getAlignmentClass = (alignment: TextAlignment) => {
  switch (alignment) {
    case TextAlignment.left:
      return "items-start";
    case TextAlignment.center:
      return "items-center";
    case TextAlignment.right:
      return "items-end";
  }
};

const CollapsibleTextBlock: types.Brick<any> = (props) => {
  const {
    bodyTextColour,
    headingTextColour,
    backgroundColour,
    backgroundTitleText,
    backgroundTitleTextSize,
    textAlignment,
    showHeader = true,
    showSubheader = true,
    showBody = true,
    topGradientEndColour = ArKUIColours.TRANSPARENT.value,
    topGradientHeight,
    bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
    bottomGradientHeight,
    padding,
    maxWidth = MaxWLevel["9xl"],
    animateOnScroll = false,
  } = props;

  const [bodyExpanded, setBodyExpanded] = useState(false);
  const { isAdmin } = useAdminContext();
  const shouldShowBody = showBody && (bodyExpanded || isAdmin);
  const contentLayoutClassNames = `w-full z-10 ${maxWidth} flex-col justify-center ${getAlignmentClass(
    textAlignment
  )}`;

  const content = (
    <div className={contentLayoutClassNames}>
      <button
        className="opacity-80 hover:opacity-100 transition-all"
        disabled={isAdmin}
        onClick={() => setBodyExpanded(!bodyExpanded)}
      >
        {showHeader && (
          <HeaderText
            propName="title"
            placeholder="Title text..."
            showBackgroundTitleText={true}
            backgroundTitleTextSize={backgroundTitleTextSize}
            backgroundTitleText={backgroundTitleText}
            headerLevel={HeaderLevel.h2}
            textColour={headingTextColour}
            alignment={textAlignment}
          />
        )}

        {showSubheader && (
          <HeaderText
            showBackgroundTitleText={false}
            propName="subtitle"
            placeholder="Subtitle text..."
            headerLevel={HeaderLevel.h3}
            backgroundTitleText={""}
            textColour={headingTextColour}
            alignment={textAlignment}
          />
        )}
      </button>

      <Collapsible isOpen={shouldShowBody}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
        >
          <div className="mt-9">
            <BodyText
              propName="body"
              placeholder="Body text..."
              colour={bodyTextColour}
              textAlignment={textAlignment}
            />
          </div>
        </motion.div>
      </Collapsible>
    </div>
  );

  return (
    <div
      style={{ backgroundColor: backgroundColour.color }}
      className={`w-full relative ${padding} flex-col flex justify-center items-center content-center`}
    >
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

      {animateOnScroll && !isAdmin ? (
        <motion.div
          className={contentLayoutClassNames}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true, margin: "0px 0px -200px 0px" }}
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

CollapsibleTextBlock.schema = {
  name: "collapsible",
  label: "Collapsible Text Section",
  getDefaultProps: () => ({
    backgroundColour: ArKUIColours.BLACK.value,
    bodyTextColour: ArKUIColours.WHITE.value,
    showHeader: true,
    showSubheader: true,
    showBody: true,
    textAlignment: TextAlignment.center,
    animateOnScroll: false,
  }),
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
        // Header Background Text
        {
          name: "backgroundTitleText",
          label: "Background Title Text",
          type: types.SideEditPropType.Text,
        },
        // Background title text size using BackgroundTextSize enum
        {
          name: "backgroundTitleTextSize",
          label: "Background Title Text Size",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              {
                value: TextSize["9xl"],
                label: "9xl",
              },
              {
                value: TextSize["8xl"],
                label: "8xl",
              },
              {
                value: TextSize["7xl"],
                label: "7xl",
              },
              {
                value: TextSize["6xl"],
                label: "6xl",
              },
              {
                value: TextSize["5xl"],
                label: "5xl",
              },
              {
                value: TextSize["4xl"],
                label: "4xl",
              },
              {
                value: TextSize["3xl"],
                label: "3xl",
              },
              {
                value: TextSize["2xl"],
                label: "2xl",
              },
              {
                value: TextSize["xl"],
                label: "xl",
              },
              {
                value: TextSize["lg"],
                label: "lg",
              },
              {
                value: TextSize["md"],
                label: "md",
              },
              {
                value: TextSize["sm"],
                label: "sm",
              },
              {
                value: TextSize["xs"],
                label: "xs",
              },
            ],
          },
        },

        // Show Headers
        {
          name: "showHeader",
          label: "Show Header",
          type: types.SideEditPropType.Boolean,
        },
        // Show subheader
        {
          name: "showSubheader",
          label: "Show Subheader",
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
              { value: "lg:p-60 p-20", label: "Big Padding" },
              { value: "lg:p-40 p-16", label: "Medium Padding" },
              { value: "lg:p-20 p-10", label: "Regular Padding" },
              { value: "lg:p-10 p-8", label: "Small Padding" },
              { value: "p-0", label: "No Padding" },
            ],
          },
        },
        // Max width
        {
          name: "maxWidth",
          label: "Max Width",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: MaxWLevel.full, label: "Full" },
              { value: MaxWLevel["9xl"], label: "9xl" },
              { value: MaxWLevel["8xl"], label: "8xl" },
              { value: MaxWLevel["7xl"], label: "7xl" },
              { value: MaxWLevel["6xl"], label: "6xl" },
              { value: MaxWLevel["5xl"], label: "5xl" },
              { value: MaxWLevel["4xl"], label: "4xl" },
              { value: MaxWLevel["3xl"], label: "3xl" },
              { value: MaxWLevel["2xl"], label: "2xl" },
              { value: MaxWLevel.xl, label: "xl" },
              { value: MaxWLevel.lg, label: "lg" },
              { value: MaxWLevel.md, label: "md" },
              { value: MaxWLevel.sm, label: "sm" },
              { value: MaxWLevel.xs, label: "xs" },
            ],
          },
        },
        // Text alignment
        {
          name: "textAlignment",
          label: "Text Alignment",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "text-left", label: "Left" },
              { value: "text-center", label: "Center" },
              { value: "text-right", label: "Right" },
            ],
          },
        },
        {
          name: "animateOnScroll",
          label: "Animate On Scroll",
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

export default CollapsibleTextBlock;
