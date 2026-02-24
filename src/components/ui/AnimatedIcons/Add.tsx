"use client";

import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { motion, useAnimation } from "motion/react";

import { cn } from "@/lib/utils";

export interface PlusIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PlusIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  hover?: boolean; // ✅ add hover prop
}

const PlusIcon = forwardRef<PlusIconHandle, PlusIconProps>(({ onMouseEnter, onMouseLeave, className, size = 28, hover, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && !hover) {
        controls.start("animate");
      }
      onMouseEnter?.(e);
    },
    [controls, onMouseEnter, hover]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && !hover) {
        controls.start("normal");
      }
      onMouseLeave?.(e);
    },
    [controls, onMouseLeave, hover]
  );

  // ✅ external hover prop control
  useEffect(() => {
    if (hover) {
      controls.start("animate");
    } else if (hover === false) {
      controls.start("normal");
    }
  }, [hover]);

  return (
    <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        variants={{
          normal: { rotate: 0 },
          animate: { rotate: 180 },
        }}
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </motion.svg>
    </div>
  );
});

PlusIcon.displayName = "PlusIcon";

export { PlusIcon };
