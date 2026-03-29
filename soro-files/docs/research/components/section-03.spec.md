# section-03 Specification

## Overview
- **Target file:** `src/components/trysoro/section-03.tsx`
- **Screenshot:** `docs/design-references/trysoro-desktop-full.png`
- **Interaction model:** scroll-driven + hover

## DOM Structure
- Main section class: `max-w-[1440px] mx-auto md:px-8 px-2`
- Heading: They get clicks. You?

## Computed Styles (exact values from getComputedStyle)

### Container
- display: block
- position: static
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
They get clicks. You?Get visitors online from high-quality articles tailored for your business. No skills needed.
        /* Mobile: show only first and last date (2 dates total) */
        .x-label { 
          display: none;
        }
        .x-label-first { 
          display: block !important;
          transform: translateX(0) !important;
        }
        .x-label-last { 
          display:

## Responsive Behavior
- **Desktop (1440px):** Original layout retained.
- **Tablet (768px):** Reduced spacing and some content wraps.
- **Mobile (390px):** Stacked layout with simplified x-axis labels in chart blocks.
- **Breakpoint:** 640px and 1024px observed in inline styles.
