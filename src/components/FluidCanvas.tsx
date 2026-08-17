import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Extra simulation options merged over the defaults. */
  options?: Record<string, unknown>;
};

export function FluidCanvas({ className = "fluid-canvas", options }: Props) {
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
        // White dye on black: the layer is composited with mix-blend-mode so
        // the white areas act as the reveal mask.
        SPLAT_COLOR: { r: 1, g: 1, b: 1 },
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        SHADING: false,
        BLOOM: false,
        SUNRAYS: false,
        IMMEDIATE: false,
        AUTO: false,
        ...options,
      });
    });

    // The canvas ignores pointer events (content underneath stays clickable),
    // so forward window-level pointer / touch moves to it.
    const splat = (x: number, y: number) => {
      canvas.dispatchEvent(
        new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: false }),
      );
    };
    const onMouse = (e: MouseEvent) => splat(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) splat(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [options]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
