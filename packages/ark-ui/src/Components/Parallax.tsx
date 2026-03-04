"use client";

import React from "react";
import { ScrollParallax } from "react-just-parallax";
import { types, Image } from "react-bricks";

// Rest of your code

enum CoverMode {
  COVER = "object-cover",
  CONTAIN = "object-contain",
  FILL = "object-fill",
  NONE = "object-none",
  SCALE_DOWN = "object-scale-down",
}

interface ParallaxBackgroundImageProps {
  parallaxEnabled?: boolean;
  parallaxStrength?: number;
  easing?: number;
  image: types.IImageSource;
  zIndex?: number;
  isAbsolutelyPositioned?: boolean;
  alt?: string;
  coverMode?: CoverMode;
}

export const ParallaxBackgroundImage: types.Brick<
  ParallaxBackgroundImageProps
> = ({
  parallaxEnabled = true,
  parallaxStrength = 0.5,
  easing = 0.9,
  zIndex = 0,
  isAbsolutelyPositioned = true,
  alt = "Background Image",
  coverMode = CoverMode.COVER,
  image,
}) => (
  <ScrollParallax
    zIndex={zIndex}
    strength={parallaxEnabled ? parallaxStrength : 0}
    shouldPause
    lerpEase={easing}
    isAbsolutelyPositioned={isAbsolutelyPositioned}
  >
    <Image
      source={image}
      readonly
      imageClassName={`${coverMode} relative z-[${zIndex}] h-full w-full`}
      alt={alt}
    />
  </ScrollParallax>
);

// export const ParallaxBackgroundImage = dynamic(
//   () => Promise.resolve(ParallaxBackgroundImageSSR),
//   {
//     ssr: false,
//   }
// )

ParallaxBackgroundImage.schema = {
  name: "parallaxBackgroundImage",
  label: "Parallax Background Image",
};
