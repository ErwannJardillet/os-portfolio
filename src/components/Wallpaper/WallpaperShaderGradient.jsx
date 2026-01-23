import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/**
 * Fond d'écran ShaderGradient (plein écran) à placer derrière l'UI.
 * - Ne capture jamais les interactions (pointer-events: none)
 * - Se pilote via props (couleurs, vitesse, intensité, etc.)
 */



export default function WallpaperShaderGradient({
  // Mesh
  type = "plane",
  animate = "on",
  uSpeed = 0.25,
  uStrength = 3.2,
  uFrequency = 4.8,
  // Colors (évite le duo violet/bleu par défaut)
  color1 = "#52ff89",
  color2 = "#dbba95",
  color3 = "#d0bce1",
  // Light / feel
  lightType = "3d",
  brightness = 1.0,
  grain = "on",
  grainBlending = 0.35,
  // Camera
  cDistance = 3.6,
  cPolarAngle = 90,
  cAzimuthAngle = 0,
  // Canvas perf
  pixelDensity = 1.25,
  fov = 45,
  // Optional lazy-load controls
  lazyLoad = false,
  threshold = 0.1,
  rootMargin = "0px",
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={pixelDensity}
        fov={fov}
        lazyLoad={lazyLoad}
        threshold={threshold}
        rootMargin={rootMargin}
      >
<ShaderGradient
  animate="on"
  axesHelper="on"
  bgColor1="#000000"
  bgColor2="#000000"
  brightness={0.7}
  cAzimuthAngle={180}
  cDistance={3.7}
  cPolarAngle={115}
  cameraZoom={5.2}
  color1="#5606ff"
  color2="#e04cfe"
  color3="#000000"
  destination="onCanvas"
  embedMode="off"
  envPreset="city"
  format="gif"
  fov={50}
  frameRate={10}
  gizmoHelper="hide"
  grain="on"
  lightType="3d"
  pixelDensity={1.4}
  positionX={-0.5}
  positionY={0.1}
  positionZ={0}
  range="disabled"
  rangeEnd={40}
  rangeStart={0}
  reflection={0.1}
  rotationX={-30}
  rotationY={0}
  rotationZ={235}
  shader="defaults"
  type="waterPlane"
  uAmplitude={4}
  uDensity={2.7}
  uFrequency={5.5}
  uSpeed={0.3}
  uStrength={1.2}
  uTime={0.2}
  wireframe={false}
/>
      </ShaderGradientCanvas>
    </div>
  );
}
