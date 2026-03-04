"use client";

import {
  Text,
  RichText,
  Image,
  useAdminContext,
  Repeater,
} from "react-bricks/frontend";
import React, { useRef, useState } from "react";
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
  FontWeight,
} from "../Components/Text";
import {
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

interface TimelineProps {
  // Gradient overlay
  topGradientEndColour: ArkUIColourValue;
  topGradientHeight: number;
  bottomGradientEndColour: ArkUIColourValue;
  bottomGradientHeight: number;

  // Layout
  backgroundColour: ArkUIColourValue;
  padding: string;
  maxWidth: MaxWLevel;
  animateOnScroll?: boolean;
}

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
  "full" = "max-w-full",
}

// Function to convert text alignment to flex-box justification
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

const Timeline: types.Brick<TimelineProps> = ({
  // Gradient overlay
  topGradientEndColour = ArKUIColours.TRANSPARENT.value,
  topGradientHeight,
  bottomGradientEndColour = ArKUIColours.TRANSPARENT.value,
  bottomGradientHeight,

  // Layout
  padding,
  maxWidth = MaxWLevel["9xl"],
  animateOnScroll = false,
  backgroundColour,
}) => {
  let { isAdmin } = useAdminContext();

  let shouldAnimateOnScroll = animateOnScroll && !isAdmin;

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

  const animatableScrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: animatableScrollRef,
    offset: ["start end", "end end"],
  });

  const verticalBarScale = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: easeIn,
  });

  const revealOnScrollVerticalLine = (
    <motion.div
      ref={animatableScrollRef}
      className=" opacity-5 md:opacity-100"
      style={{
        width: "7px",
        height: "100%",
        scaleY: verticalBarScale,
        transformOrigin: "top",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        zIndex: 0,
      }}
    ></motion.div>
  );

  const staticVerticalLine = (
    <div
      ref={animatableScrollRef}
      className=" opacity-5 md:opacity-100"
      style={{
        width: "7px",
        height: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        zIndex: 0,
      }}
    ></div>
  );

  return (
    <div
      style={{ backgroundColor: backgroundColour.color }}
      className={`w-full relative ${padding} flex-col flex justify-center items-center content-center space-y-40`}
    >
      {/* Gradient Overlays */}
      {gradientOverlays}

      {/* Timeline Items */}
      <div className="z-10 relative w-full space-y-40 md:p-0 p-10">
        <Repeater
          itemProps={{ animateOnScroll: shouldAnimateOnScroll }}
          propName="timelineItems"
        />
      </div>

      {/* Left Timeline Item */}

      {/* Main Vertical Line */}
      {shouldAnimateOnScroll ? revealOnScrollVerticalLine : staticVerticalLine}
    </div>
  );
};

Timeline.schema = {
  name: "timeline",
  label: "Vertical Timeline",

  getDefaultProps: () => ({
    backgroundColour: ArKUIColours.BLACK.value,
    animateOnScroll: false,
  }),
  repeaterItems: [
    {
      name: "timelineItems",
      itemType: "timeline-item",
      itemLabel: "Timeline Item",
      min: 0,
    },
  ],
  // Sidebar Edit controls for props
  sideEditProps: [
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
              { value: "p-60", label: "Big Padding" },
              { value: "p-40", label: "Medium Padding" },
              { value: "p-20", label: "Regular Padding" },
              { value: "p-10", label: "Small Padding" },
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

export default Timeline;
