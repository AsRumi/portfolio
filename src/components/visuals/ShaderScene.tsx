"use client";

// The only module in the app that imports three.js / react-three-fiber.
//
// It is deliberately tiny and has no logic beyond mapping our theme colors onto
// ShaderGradient's prop surface. Everything else — lazy loading, the reduced
// motion check, the crossfade between palettes, and the failure fallback — lives
// in ShaderBackdrop, which loads this file via next/dynamic with ssr disabled.
// Keeping the split means the ~600KB three.js bundle never enters the server
// render path or the initial client chunk.
//
// PACKAGE NOTE: this uses `@shadergradient/react` (v2.x), not the older
// `shadergradient` (v1.3.5) package. They export the same two components with
// the same prop names, but v1.3.5 is a Framer-targeted build in which
// `reflection`, `lightType`, `envPreset` and `brightness` are declared in the
// type definitions yet never read by the compiled code — setting them there
// does nothing at all. v2.x actually wires them up, which is what makes the
// shine below possible.

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

type Props = {
  /** Three gradient stops, warmest/lightest → darkest. */
  colors: [string, string, string];
  /** false → renders one static frame (honors prefers-reduced-motion). */
  animate: boolean;
  /**
   * 0–1 glossiness. Maps to `roughness: 1 - reflection` on the material and
   * also drives the shader's Fresnel term, so higher values both sharpen the
   * specular glints and widen the glancing-angle shimmer.
   */
  reflection?: number;
};

export default function ShaderScene({
  colors,
  animate,
  reflection = 0.5,
}: Props) {
  const [color1, color2, color3] = colors;

  return (
    <ShaderGradientCanvas
      // pixelDensity 1 (rather than devicePixelRatio) is the single biggest win
      // for frame rate here. The gradient is a soft, low-frequency image, so
      // rendering it at 1x and letting the browser upscale is visually free
      // while roughly quartering the fragment work on retina displays.
      pixelDensity={1}
      fov={45}
      // Without this the canvas sits over the whole hero and swallows drags,
      // which would let a visitor accidentally orbit the camera and would also
      // interfere with selecting the headline. Purely a safety measure — the
      // gradient is decorative and should never take input.
      pointerEvents="none"
      style={{ width: "100%", height: "100%" }}
    >
      <ShaderGradient
        control="props"
        // waterPlane = a large subdivided plane displaced by noise. Rotated to a
        // shallow angle it reads as drifting atmosphere rather than a surface,
        // which is what we want sitting behind mountain silhouettes. It also has
        // a dedicated Fresnel path in the shader, so it's the geometry that
        // benefits most from `reflection` below.
        type="waterPlane"
        animate={animate ? "on" : "off"}
        // Camera framing. cDistance/cameraZoom are tuned together so the plane
        // overfills the viewport at every aspect ratio — no visible plane edge.
        cAzimuthAngle={180}
        cPolarAngle={80}
        cDistance={2.8}
        cameraZoom={9.1}
        // Plane orientation. The -60° roll is what tilts the color bands into a
        // diagonal sweep instead of flat horizontal stripes.
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={50}
        rotationY={0}
        rotationZ={-60}
        // ── Noise field ──────────────────────────────────────────────────────
        // These three are the "how much is it moving and how creased is it"
        // controls, and they are the ones most worth re-tuning by eye.
        //
        // uSpeed: drift rate. NOT a JS time scale — uTime advances at real
        //   time and uSpeed scales the noise inside the shader. 0.1 is the
        //   library's own documented minimum; below it the field moves so
        //   little per frame that the gradient reads as a static image. This
        //   was set to 0.05 and looked broken, so treat 0.1 as the floor.
        // uStrength: displacement depth, i.e. how pronounced each fold is.
        //   Doubles as the motion budget: if the folds are too shallow there is
        //   nothing whose movement the eye can actually track.
        // uDensity: how many folds fit across the plane. This is the honest
        //   dial for "fewer folds" — lowering it calms the surface without
        //   flattening it to the point that motion disappears. The library
        //   default is 1.3; 1.0 is visibly calmer while still legibly moving.
        uSpeed={0.1}
        uStrength={1.3}
        uDensity={1.0}
        // Both zero on purpose. These drive a sine twist (`sin(uv.y *
        // uFrequency + t) * uAmplitude`) that belongs to the `plane` geometry;
        // on waterPlane it just adds a rolling shear we don't want.
        uFrequency={0}
        uAmplitude={0}
        color1={color1}
        color2={color2}
        color3={color3}
        // ── Shine ────────────────────────────────────────────────────────────
        // '3d' is a local ambient + point light rig. The alternative, 'env',
        // lights the surface with an HDR environment map, and it was tried
        // here and reverted: env reflections only break into glints where the
        // surface is creased, and this plane is deliberately smooth (see
        // uDensity above). On a near-flat surface the env map reflects as a
        // single broad wash, which flattened the palette into a desaturated
        // haze — it cost the sunset its amber and returned no sparkle. It also
        // fetches three HDR maps at runtime from a third-party host.
        //
        // reflection still earns its place: on waterPlane it drives a Fresnel
        // term, so the surface brightens at glancing angles as the swells move.
        lightType="3d"
        reflection={reflection}
        // Now meaningful — it was inert in the previous package. Held at 1.0
        // rather than the library's 1.2 default because the new specular
        // highlight adds brightness of its own, and the gradient sits beneath
        // white hero copy that needs to stay legible.
        brightness={1.0}
        // Off. This is the library's sparkle, but it is all-or-nothing — the
        // `grainBlending` prop is typed and never read in either package
        // version — and at full strength it is a dense halftone dither that
        // buries the gradient in static rather than glinting on it. Turning it
        // on is a one-word change if a heavier texture is ever wanted, but it
        // cannot be made subtle from here.
        grain="off"
        // Off on purpose: enableTransition plays a camera fly-in on mount, which
        // would fight the hero's own staggered entrance timing.
        enableTransition={false}
        zoomOut={false}
        toggleAxis={false}
      />
    </ShaderGradientCanvas>
  );
}
