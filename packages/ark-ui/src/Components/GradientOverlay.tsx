"use client";

import React from "react";

export enum GradientOverlayPosition {
  top = "top",
  bottom = "bottom",
}
interface GradientOverlayProps {
  direction: GradientOverlayPosition;
  tailwindColour: string;
  height?: number;
  zIndex?: number;
  topOffset?: number;
}

export const GradientFadeOverlay: React.FC<GradientOverlayProps> = ({
  direction,
  tailwindColour,
  height = 200,
  zIndex = 10,
  topOffset,
}) => {
  switch (direction) {
    case GradientOverlayPosition.top:
      return (
        <div
          style={{
            // top: `${topOffset}px`,
            height: `${height}px`,
            zIndex: `${zIndex}`,
            background: `linear-gradient(to top, transparent, ${tailwindColour})`,
          }}
          className={`absolute z-[${zIndex}] top-0 left-0 right-0 `}
        ></div>
      );
    case GradientOverlayPosition.bottom:
      return (
        <div
          style={{
            top: `${topOffset}px`,
            height: `${height}px`,
            zIndex: `${zIndex}`,
            background: `linear-gradient(to bottom, transparent, ${tailwindColour})`,
          }}
          className={`absolute z-[${zIndex}] bottom-0 left-0 right-0 `}
        ></div>
      );
  }
};
