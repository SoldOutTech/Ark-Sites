"use client";

import React, { useRef } from "react";
import { Text, RichText, Link, types } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "../colors";

interface HeaderTextProps {
  textColour: ArkUIColourValue;
  showBackgroundTitleText: boolean;
  backgroundTitleTextSize?: TextSize;
  backgroundTitleText?: string;
  propName: string;
  placeholder: string;
  headerLevel: HeaderLevel;
  fontWeight?: FontWeight;
  alignment?: TextAlignment;
  classNames?: string;
}

// Enum for font weight in tailwind classes
export enum FontWeight {
  normal = "font-normal",
  medium = "font-medium",
  semibold = "font-semibold",
  bold = "font-bold",
}

export enum HeaderLevel {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
}

// eunm for background text size which is also responsive
export enum TextSize {
  xs = "text-xs",
  sm = "text-sm",
  md = "text-md",
  base = "text-base",
  lg = "text-lg",
  xl = "text-xl",
  "2xl" = "text-2xl",
  "3xl" = "text-3xl",
  "4xl" = "text-4xl",
  "5xl" = "text-5xl",
  "6xl" = "text-6xl",
  "7xl" = "text-7xl",
  "8xl" = "text-8xl",
  "9xl" = "text-9xl",
}

export enum TextAlignment {
  left = "text-left",
  center = "text-center",
  right = "text-right",
}

// Converts the header level to tailwind class names for both regular size and medium screen sizes
const getHeaderClassName = ({
  level,
  fontWeight,
}: {
  level: HeaderLevel;
  fontWeight?: FontWeight;
}) => {
  switch (level) {
    case HeaderLevel.h1:
      return `text-4xl md:text-6xl ${fontWeight ?? "font-black"}`;
    case HeaderLevel.h2:
      return `text-3xl md:text-5xl ${fontWeight ?? "font-black"}`;
    case HeaderLevel.h3:
      return `text-2xl md:text-3xl ${fontWeight ?? "font-normal"}`;
    case HeaderLevel.h4:
      return `text-xl md:text-2xl ${fontWeight ?? "font-normal"}`;
  }
};

export const HeaderText: React.FC<HeaderTextProps> = ({
  textColour = ArKUIColours.WHITE.value,
  showBackgroundTitleText,
  backgroundTitleTextSize = TextSize["6xl"],
  backgroundTitleText,
  propName,
  placeholder,
  classNames = "",
  headerLevel = HeaderLevel.h2,
  fontWeight,
  alignment = TextAlignment.left,
}) => (
  <Text
    renderBlock={(props) => (
      <div className="relative">
        <h2
          className={`z-10 mb-auto ${getHeaderClassName({
            level: headerLevel,
            fontWeight,
          })} ${
            textColour.textClassName
          } leading-tight ${alignment} ${classNames}`}
        >
          {props.children}
        </h2>
        {/* Background Text */}
        {showBackgroundTitleText ? (
          <h2
            className={`absolute md:-top-6 opacity-0 md:opacity-5 md:-left-20 z-10 mb-auto ${backgroundTitleTextSize} font-black text-white leading-tight ${alignment} ${classNames}`}
          >
            {backgroundTitleText}
          </h2>
        ) : (
          ""
        )}
      </div>
    )}
    renderPlaceholder={(props) => (
      <h2
        className={`z-10 mb-auto ${getHeaderClassName({
          level: headerLevel,
          fontWeight,
        })} text-white leading-tight text-left`}
      >
        {placeholder}
      </h2>
    )}
    propName={propName}
  />
);

interface BodyTextProps {
  colour: ArkUIColourValue;

  // Used when 'highlight' is enabled and we want to cutout the text from the highlight background.
  cutoutTextColour?: ArkUIColourValue;
  textAlignment?: TextAlignment;
  textSize?: TextSize;
  fontWeight?: FontWeight;
  placeholder: string;
  propName: string;
  classNames?: string;
}

export const BodyText: React.FC<BodyTextProps> = ({
  colour,
  cutoutTextColour,
  textSize = TextSize.base,
  fontWeight = FontWeight.medium,
  textAlignment = TextAlignment.center,
  placeholder,
  propName,
  classNames = "",
}) => (
  <RichText
    propName={propName}
    placeholder="Body..."
    renderBlock={({ children }) => (
      <div>
        <p
          className={`${textSize} ${fontWeight} ${textAlignment} leading-relaxed ${colour.textClassName} ${classNames} mb-4 last:mb-0`}
        >
          {children}
        </p>
      </div>
    )}
    renderPlaceholder={({ children }) => (
      <div>
        <p
          className={`${textSize} ${fontWeight} ${textAlignment} leading-relaxed ${colour.textClassName} ${classNames} mb-4 last:mb-0`}
        >
          {placeholder}
        </p>
      </div>
    )}
    allowedFeatures={[
      types.RichTextFeatures.Bold,
      types.RichTextFeatures.Italic,
      types.RichTextFeatures.Highlight,
      types.RichTextFeatures.Code,
      types.RichTextFeatures.Link,
    ]}
    renderHighlight={(props) => (
      <span
        className={`${fontWeight} text-xs ${textAlignment} ${
          cutoutTextColour
            ? cutoutTextColour.textClassName
            : colour.textClassName
        } ${classNames} ${colour.bgClassName} p-1 rounded-md mx-1`}
      >
        {props.children}
      </span>
    )}
    renderLink={(props) => (
      <Link
        target="_blank"
        href={props.href}
        className={`${colour.textClassName} opacity-60 hover:opacity-100 transition-all cursor-pointer`}
      >
        {props.children}
      </Link>
    )}
  />
);
