"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { PawPrint } from "lucide-react";

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Raw mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springy followers — feel free to tune stiffness/damping
  const springConfig = { stiffness: 350, damping: 28, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate on desktop (pointer: fine, width >= 768)
    const mediaQuery = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset so the paw centre aligns with the actual pointer tip
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDesktop, mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        // mix-blend-mode: difference makes the white icon invert whatever
        // is underneath it — dark on light, light on dark.
        mixBlendMode: "difference",
      }}
      animate={{
        scaleX: isClicking ? -0.7 : -1,
        scaleY: isClicking ? 0.7 : 1
      }}
      transition={{ type: "spring", stiffness: 1300, damping: 25 }}
    >
      <PawPrint
        size={32}
        color="white"
        strokeWidth={1.8}
        style={{ display: "block" }}
      />
    </motion.div>
  );
}
