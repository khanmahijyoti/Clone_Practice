# section-02 Specification

## Overview
- **Target file:** `src/components/trysoro/section-02.tsx`
- **Screenshot:** `docs/design-references/trysoro-desktop-full.png`
- **Interaction model:** scroll-driven + hover

## DOM Structure
- Main section class: `max-w-[700px] mx-auto px-2`
- Heading: Soro finds the exact keywords that bring you buyers.

## Computed Styles (exact values from getComputedStyle)

### Container
- display: block
- position: static
- padding: 0px 8px
- margin: 0px 370px 192px
- maxWidth: 700px
- background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box

## States & Behaviors
- Uses transition classes and motion-related utility classes when elements enter viewport.
- Hover states present on buttons/links in this section where applicable.

## Per-State Content (if applicable)
- N/A

## Assets
- See `docs/research/assets-manifest.json` for image/video references.

## Text Content (verbatim)
Soro finds the exact keywords that bring you buyers.Then it writes and publishes daily content to your site.That appears on Google and ChatGPT, growing your traffic.

## Responsive Behavior
- **Desktop (1440px):** Original layout retained.
- **Tablet (768px):** Reduced spacing and some content wraps.
- **Mobile (390px):** Stacked layout with simplified x-axis labels in chart blocks.
- **Breakpoint:** 640px and 1024px observed in inline styles.
