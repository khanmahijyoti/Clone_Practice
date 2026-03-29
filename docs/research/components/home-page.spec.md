# HomePage Specification

## Overview
- **Target file:** `src/app/[[...slug]]/page.tsx`
- **Screenshot:** `docs/design-references/f4-desktop-full.png`
- **Interaction model:** scroll-driven + hover + time-driven

## DOM Structure
- Framer-generated app wrapper with section blocks and animated elements.

## Computed Styles (exact values from getComputedStyle)
- Body backgroundColor: rgb(8, 11, 12)
- Body color: rgb(0, 0, 0)
- Body fontFamily: sans-serif

## States & Behaviors
- Section entries animate with transforms and opacity changes.
- Interactive controls include hover transitions and links.

## Per-State Content
- N/A

## Assets
- Mirrored pages: `public/mirror/index.html`, `public/mirror/lite/index.html`, `public/mirror/download/index.html`, `public/mirror/docs/index.html`, `public/mirror/wiki/index.html`
- Favicons/manifest references:
  - https://framerusercontent.com/images/50hrX7rnwBlg1EBGAALDrF145U.svg
  - https://framerusercontent.com/images/PUsiMGliBRvQ9dJtPq4oY0G5Jms.svg

## Text Content (verbatim)
- GD&T Analysis Platformfor Engineering Drawings
- F4 analyzes GD&T for production readiness without relying on AI for analysis
- Features
- GD&T analyzed for clarity, manufacturability, and inspectability
- GD&T Analysis
- GD&T Tolerance Analysis
- GD&T Definitions
- GD&T Exports
- Best viewer for all — Best analysis platform for top teams
- FAQ
- You asked.We answered
- Accelerate
- design validation

## Responsive Behavior
- **Desktop (1440px):** Full multi-section layout.
- **Mobile (390px):** Condensed stacked layout.
- **Breakpoint:** managed by Framer runtime CSS and media queries.
