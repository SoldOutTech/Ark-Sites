"use client";

import { useEffect, useRef, useState } from "react";

interface CollapsibleProps {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  isOpen,
  children,
  duration = 500,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Handle expand/collapse logic
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scrollHeight = el.scrollHeight;

    if (isOpen) {
      // EXPAND
      setShouldAnimate(true);
      setHeight(`${scrollHeight}px`);

      const timeout = setTimeout(() => {
        setHeight("auto"); // let it grow naturally
        setShouldAnimate(false);
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      // COLLAPSE
      if (height === "auto") {
        setHeight(`${scrollHeight}px`); // set fixed height first
      }

      setShouldAnimate(true);

      // Double tick: force layout → collapse
      setTimeout(() => {
        requestAnimationFrame(() => {
          setHeight("0px");
        });
      }, 10);
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      style={{
        height,
        overflow: "hidden",
        transition: shouldAnimate
          ? `height ${duration}ms ease-in-out`
          : undefined,
      }}
    >
      {children}
    </div>
  );
};
