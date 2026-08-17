import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { FluidCanvas } from "@/components/FluidCanvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fable — Building the Modern Web" },
      {
        name: "description",
        content:
          "Fable is a web design and development studio building fast, expressive modern web experiences.",
      },
      { property: "og:title", content: "Fable — Building the Modern Web" },
      {
        property: "og:description",
        content:
          "Fable is a web design and development studio building fast, expressive modern web experiences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll with the extra lerp ramp near the video stage.
  useEffect(() => {
    let raf = 0;
    let destroy: (() => void) | undefined;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ smoothWheel: true, lerp: 0.08 });
      destroy = () => lenis.destroy();

      const loop = (time: number) => {
        const stage = stageRef.current;
        if (stage) {
          const rect = stage.getBoundingClientRect();
          const distance = Math.abs(
            rect.top + rect.height / 2 - window.innerHeight / 2,
          );
          const influence = Math.min(
            1,
            Math.max(0, 1 - distance / (window.innerHeight * 1.5)),
          );
          lenis.options.lerp = 0.08 + influence * 0.18;
        }
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      destroy?.();
    };
  }, []);

  // Video window drifts toward the viewport centre.
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const update = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const cursorX = window.innerWidth / 2 - centerX;
      const cursorY = window.innerHeight / 2 - centerY;
      const influence = Math.max(
        0,
        1 -
          Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) /
            (window.innerHeight * 1.5),
      );
      targetX = cursorX * (0.12 + influence * 0.18);
      targetY = cursorY * (0.12 + influence * 0.18);
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      const el = windowRef.current;
      if (el) {
        el.style.transform = `translate(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${currentY.toFixed(2)}px))`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("mousemove", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("mousemove", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.remove("flash-highlight");
    void (target as HTMLElement).offsetWidth;
    target.classList.add("flash-highlight");
    setTimeout(() => target.classList.remove("flash-highlight"), 200);
  };

  return (
    <div className="fable">
      <ClientOnly>
        <FluidCanvas />
      </ClientOnly>

      <div className="topbar">
        <div className="top-left">
          <img className="logo" src="/Images/Logo.png" alt="Fable" width={38} />
        </div>
        <div className="top-right">
          <a
            href="#footer"
            className="TRT"
            onClick={(e) => handleNavClick(e, "#footer")}
          >
            Contacts
          </a>
          <a
            href="#about"
            className="TRT"
            onClick={(e) => handleNavClick(e, "#about")}
          >
            About
          </a>
          <a
            href="#socials"
            className="TRT"
            onClick={(e) => handleNavClick(e, "#socials")}
          >
            Socials
          </a>
        </div>
      </div>

      <div className="Content">
        <h1 className="Title">Fable</h1>
        <p className="Description">Building the Modern Web</p>
      </div>

      <div className="video-stage" ref={stageRef} aria-label="Featured video section">
        <video
          className="Video video-backdrop"
          src="/Videos/Silk.webm"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="video-window" ref={windowRef}>
          <video
            className="Video video-foreground"
            src="/Videos/Silk.webm"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      <section className="About" id="about">
        <p className="AboutTitle">About Us:</p>
        <p className="AboutDescription">
          <span className="AboutSpan">I am a Developer Who is</span> dedicated to
          creating innovative Web experiences.
        </p>
      </section>

      <section id="socials" className="socials-section">
        <p className="WorkTitle">Want to work with us?</p>
        <p className="WorkDn">Reach Out Using Our Socials</p>
        <p className="WorkDb">Discord/Github</p>
      </section>

      <footer id="footer">
        <div className="Footer">
          <a
            href="https://github.com/UCursor"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github-link"
          >
            <img
              src="/Icons/github.svg"
              alt="GitHub"
              className="SocialIcon github-icon"
            />
          </a>
          <p className="FooterText">© 2026 Project Fable. All rights reserved.</p>
          <a
            href="https://discord.gg/rK7eqVp53k"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link discord-link"
          >
            <p className="discord">Join our Discord</p>
          </a>
        </div>
      </footer>
    </div>
  );
}
