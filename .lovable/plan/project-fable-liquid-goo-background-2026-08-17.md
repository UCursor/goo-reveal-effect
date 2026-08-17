# Project Fable + Liquid Goo Background

Port your Project Fable site into this TanStack Start app and layer the liquid goo effect from Liquid Reveal behind the whole page.

## What gets built

**Single page at `/`** with the same sections and copy as your `index.html`:
- Fixed topbar: logo slot (top-left) + Contacts / About / Socials links (top-right) with smooth scroll and the flash-highlight pulse on the target section
- Hero: giant "Fable" title + "Building the Modern Web" tagline with the hover/active scale interactions
- Video stage: blurred full-bleed backdrop video + rounded floating video window that drifts toward the viewport center on scroll/mouse (same easing loop as your script)
- About section with the split-emphasis paragraph
- Socials section: "Want to work with us?" / "Reach Out Using Our Socials" / Discord–Github
- Footer: GitHub icon link, © 2026 Project Fable, Discord invite link

**Liquid goo background** ported from Liquid Reveal:
- `FluidCanvas` component using the `webgl-fluid` WebGL simulation, hover-triggered, white dye on black inverted via CSS so it reads as thick black goo
- Mounted once in the page shell as a fixed full-viewport layer behind all content, so the goo follows the cursor across every section
- Client-only (no SSR) and pointer-events-none so links and buttons still work; the video stage sits above it with its own background

## Assets

Left as empty placeholders for you to fill in later via GitHub:
- `public/Images/Logo.png` (logo + favicon)
- `public/Videos/Silk.webm`
- `public/Icons/github.svg`

The markup will reference these exact paths, so dropping the real files in makes them appear with no code change. Until then the logo/icon slots render as blank boxes and the video stage shows its black background. Send the screenshot of your file routes if the paths should differ.

## Technical notes

- Styles from `style.css` move into `src/styles.css` as design tokens + component classes (Inter, black/white selection styling, smooth scroll); no hardcoded color utilities in components.
- `webgl-fluid` added as a dependency, plus its local type declaration.
- Lenis smooth scroll included via the `lenis` npm package with the same lerp ramp near the video stage.
- Route `head()` gets Fable-specific title, description, og and twitter tags.
- Responsive: the 620px hero title scales with viewport so it doesn't break on mobile.
