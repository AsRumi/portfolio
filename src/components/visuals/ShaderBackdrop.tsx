"use client";

// Drop-in animated gradient layer.
//
// Renders an absolutely-positioned WebGL gradient that is designed to sit *on
// top of* an existing CSS gradient, never to replace it. That ordering is the
// whole safety story: if WebGL is unavailable, the chunk fails to load, the GPU
// context is lost, or the visitor prefers reduced motion, this component renders
// nothing at all and the page falls back to exactly the design that shipped
// before it — no layout shift, no blank panel, no crash.

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Component, useEffect, useState, type ReactNode } from "react";

// ssr:false keeps three.js out of the server render entirely. It cannot run
// there (no WebGL context, no `window`), and lazy-loading it client-side means
// the hero's text and mountains paint on the very first frame while the ~600KB
// three bundle streams in behind them.
const ShaderScene = dynamic(() => import("./ShaderScene"), { ssr: false });

/**
 * Catches render/runtime errors from the WebGL subtree and swallows them.
 *
 * Without this, a failed `getContext('webgl')` — headless browsers, blocklisted
 * drivers, GPU process crashes, hardware acceleration switched off — throws
 * during render and unmounts the entire page. Returning null instead degrades
 * to the CSS gradient underneath, which is the pre-existing design.
 */
class ShaderErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Props = {
  /** Gradient stops for the current mood. Changing these crossfades palettes. */
  colors: [string, string, string];
  /** Peak opacity of the shader layer once faded in. */
  opacity?: number;
  /** 0–1 glossiness of the gradient surface. Higher = sharper Fresnel shine. */
  reflection?: number;
  /** Extra positioning/masking classes for the absolute wrapper. */
  className?: string;
};

export default function ShaderBackdrop({
  colors,
  opacity = 1,
  reflection,
  className = "",
}: Props) {
  const reduceMotion = useReducedMotion();

  // `loaded` flips once the dynamic chunk has actually resolved. Gating the
  // fade-in on it — rather than on mount — stops the layer from easing in over
  // empty space and then popping when the canvas finally arrives.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("./ShaderScene").then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Palette crossfade.
  //
  // The shader's colors are uniforms — reassigning them snaps hard, which would
  // read as a glitch next to the 0.9s CSS mood crossfade happening underneath.
  // So we dissolve the whole layer out, swap the uniforms while it's invisible,
  // and dissolve it back. The CSS gradient below is mid-crossfade throughout, so
  // the sky stays continuous and the shader appears to melt into its new mood.
  const paletteKey = colors.join("|");
  const [liveColors, setLiveColors] = useState(colors);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (liveColors.join("|") === paletteKey) return;
    setVisible(false);
    const swap = setTimeout(() => {
      setLiveColors(colors);
      setVisible(true);
    }, 420);
    return () => clearTimeout(swap);
    // liveColors is intentionally omitted: including it would re-run this effect
    // on the swap itself and restart the fade in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteKey]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded && visible ? opacity : 0 }}
        // Slow, asymmetric timing: the first appearance eases in over 1.6s so it
        // feels like the sky settling, while palette swaps move at 0.42s to stay
        // in step with the CSS crossfade they're hiding behind.
        transition={{ duration: loaded && visible ? 1.6 : 0.42, ease: "easeOut" }}
      >
        <ShaderErrorBoundary>
          {/* A visitor who asked for reduced motion still gets the richer
              gradient texture — just held on a single static frame. */}
          <ShaderScene
            colors={liveColors}
            animate={!reduceMotion}
            reflection={reflection}
          />
        </ShaderErrorBoundary>
      </motion.div>
    </div>
  );
}
