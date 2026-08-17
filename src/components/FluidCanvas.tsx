import { useEffect, useRef } from "react";

export function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = ref.current;
    if (!canvas) return;

    import("webgl-fluid").then((mod) => {
      if (cancelled) return;
      const WebGLFluid = (mod.default ?? mod) as (
        c: HTMLCanvasElement,
        o?: Record<string, unknown>,
      ) => void;
      WebGLFluid(canvas, {
        TRIGGER: "hover",
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 0.97,
        VELOCITY_DISSIPATION: 0.85,
        PRESSURE: 0.3,
        PRESSURE_ITERATIONS: 20,
        CURL: 0,
        SPLAT_RADIUS: 0.45,
        SPLAT_FORCE: 600,
        COLORFUL: false,
        // White dye on black, inverted in CSS so it reads as thick black goo
        // over the light page.
        SPLAT_COLOR: { r: 1, g: 1, b: 1 },
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        SHADING: false,
        BLOOM: false,
        SUNRAYS: false,
        IMMEDIATE: false,
        AUTO: false,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <canvas ref={ref} className="fluid-canvas" aria-hidden="true" />;
}
