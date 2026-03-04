"use client";

import { Text, RichText, Image, useAdminContext } from "react-bricks/frontend";
import React, { useRef, useState } from "react";
import { types } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "../colors"
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
import { motion, AnimatePresence } from "framer-motion";

enum TimelineItemAlignment {
  left = "left",
  right = "right",
}

interface TimelineItemProps {
  colour?: ArkUIColourValue;
  cutoutTextColour?: ArkUIColourValue;
  alignment: TimelineItemAlignment;
  animateOnScroll?: boolean;
}

const TimelineItem: types.Brick<TimelineItemProps> = ({
  colour = ArKUIColours.WHITE.value,
  cutoutTextColour = ArKUIColours.BLACK.value,
  alignment = TimelineItemAlignment.right,
  animateOnScroll = false,
}) => {
  const rightAlignedItem = (
    <div
      style={{
        width: "100%",
        top: "0",
        left: "0",
        position: "relative",
        zIndex: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Empty Space */}
      <div className="md:w-[50%]"></div>

      {/* Label Line */}
      <div
        style={{
          flexGrow: "1",
          maxWidth: "150px",
          minWidth: "0px",
          height: "5px",
          backgroundColor: "white",
          opacity: 0.5,
        }}
        className="hidden md:flex"
      ></div>

      {/* Text Content */}
      <div className="ml-4">
        <BodyText
          colour={colour}
          cutoutTextColour={cutoutTextColour}
          placeholder="Small Header"
          propName="smallHeader"
          textAlignment={TextAlignment.left}
        />
        <HeaderText
          showBackgroundTitleText={false}
          textColour={colour}
          placeholder="Main Title"
          propName="Main Title"
          headerLevel={HeaderLevel.h4}
          fontWeight={FontWeight.bold}
          alignment={TextAlignment.left}
        />
        <BodyText
          colour={colour}
          placeholder="Caption"
          propName="caption"
          fontWeight={FontWeight.medium}
          textAlignment={TextAlignment.left}
        />
        {/* <p>London, England</p>
  <p>London International Christian Church</p> */}
      </div>
    </div>
  );

  const leftAlignedItem = (
    <div
      style={{
        width: "100%",
        top: "0",
        right: "0",
        position: "relative",
        zIndex: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Text Content */}
      <div className="mr-4 ml-auto">
        <BodyText
          colour={colour}
          cutoutTextColour={cutoutTextColour}
          placeholder="Small Header"
          propName="smallHeader"
          textAlignment={TextAlignment.right}
        />
        <HeaderText
          showBackgroundTitleText={false}
          textColour={colour}
          placeholder="Main Title"
          propName="Main Title"
          headerLevel={HeaderLevel.h4}
          fontWeight={FontWeight.bold}
          alignment={TextAlignment.right}
        />
        <BodyText
          colour={colour}
          placeholder="Caption"
          propName="caption"
          fontWeight={FontWeight.medium}
          textAlignment={TextAlignment.right}
        />
        {/* <p>London, England</p>  */}
        {/* <p>London International Christian Church</p> */}
      </div>

      {/* Label Line */}
      <div
        style={{
          height: "5px",
          flexGrow: "1",
          //   width: '100%',
          minWidth: "0px",
          maxWidth: "150px",
          backgroundColor: "white",
          opacity: 0.5,
          position: "relative",
          right: "0",
        }}
        className="hidden md:flex"
      ></div>
      {/* Empty Space */}
      <div className=" md:w-[50%]"></div>
    </div>
  );
  const getElement = (alignment: TimelineItemAlignment) => {
    switch (alignment) {
      case TimelineItemAlignment.left:
        return leftAlignedItem;
      case TimelineItemAlignment.right:
        return rightAlignedItem;
      default:
        return leftAlignedItem;
    }
  };

  const animatedElement = (
    <motion.div
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      viewport={{
        // once: true,
        margin: "0px 0px -200px 0px",
      }}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {getElement(alignment)}
    </motion.div>
  );

  const nonAnimatedElement = getElement(alignment);

  return animateOnScroll ? animatedElement : nonAnimatedElement;
};

TimelineItem.schema = {
  name: "timeline-item",
  label: "Timeline Item",

  getDefaultProps: () => ({}),
  sideEditProps: [
    {
      groupName: "Colour",
      props: [
        {
          name: "colour",
          label: "Text Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.BLACK,
              ArKUIColours.WHITE,
              ArKUIColours.GREEN,
              ArKUIColours.YELLOW,
              ArKUIColours.TRANSPARENT,
            ],
          },
        },
        ,
        {
          name: "cutoutTextColour",
          label: "Cutout Text Colour",
          helperText:
            "The colour of the text itself when highlighted. The background colour will always match the rest of the text.",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.BLACK,
              ArKUIColours.WHITE,
              ArKUIColours.GREEN,
              ArKUIColours.YELLOW,
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
          name: "alignment",
          label: "Alignment",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Radio,
            options: [
              {
                value: TimelineItemAlignment.left,
                label: "Left",
              },
              {
                value: TimelineItemAlignment.right,
                label: "Right",
              },
            ],
          },
        },
      ],
    },
  ],
};

export default TimelineItem;
