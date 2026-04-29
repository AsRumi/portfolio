"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left";
  hover?: boolean;
};

export default function FadeInView({
  children,
  delay = 0.1,
  className,
  direction = "up",
  hover = false,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...(direction === "up" ? { y: 36 } : { x: -28 }) }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
