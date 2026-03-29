# section-04 Specification

## Overview
- **Target file:** `src/components/trysoro/section-04.tsx`
- **Screenshot:** `docs/design-references/trysoro-desktop-full.png`
- **Interaction model:** scroll-driven + hover

## DOM Structure
- Main section class: `relative max-w-[1440px] mx-auto px-8`
- Heading: 3 steps to get started

## Computed Styles (exact values from getComputedStyle)

### Container
- display: block
- position: relative
- padding: 0px 32px
- margin: 0px 0px 192px
- maxWidth: 1440px
- background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box

## States & Behaviors
- Uses transition classes and motion-related utility classes when elements enter viewport.
- Hover states present on buttons/links in this section where applicable.

## Per-State Content (if applicable)
- N/A

## Assets
- See `docs/research/assets-manifest.json` for image/video references.

## Text Content (verbatim)
3 steps to get started1. Add your websiteDrop your website link and Soro will learn your site in minutes.2. Get contentOur SEO autopilot delivers fresh content ideas every day.3. Publish & grow trafficLaunch 10x more SEO content that ranks on Google and ChatGPT.

## Responsive Behavior
- **Desktop (1440px):** Original layout retained.
- **Tablet (768px):** Reduced spacing and some content wraps.
- **Mobile (390px):** Stacked layout with simplified x-axis labels in chart blocks.
- **Breakpoint:** 640px and 1024px observed in inline styles.
