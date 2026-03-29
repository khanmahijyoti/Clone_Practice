# section-05 Specification

## Overview
- **Target file:** `src/components/trysoro/section-05.tsx`
- **Screenshot:** `docs/design-references/trysoro-desktop-full.png`
- **Interaction model:** scroll-driven + hover

## DOM Structure
- Main section class: `max-w-[1200px] flex flex-col gap-0 mx-auto px-4 transition-all duration-1000 ease-out opacity-100 translate-y-0`
- Heading: 100% of SEO work fully automated

## Computed Styles (exact values from getComputedStyle)

### Container
- display: flex
- position: static
- padding: 0px 16px
- margin: 0px 120px 192px
- maxWidth: 1200px
- background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box

## States & Behaviors
- Uses transition classes and motion-related utility classes when elements enter viewport.
- Hover states present on buttons/links in this section where applicable.

## Per-State Content (if applicable)
- N/A

## Assets
- See `docs/research/assets-manifest.json` for image/video references.

## Text Content (verbatim)
Unlimited blog post and content ideas100% of SEO work fully automatedFinds Best KeywordsIt goes beyond simple content generation. Our AI learns what to write to get you visible.Learns Your ContentUnderstands your tone and voice. So every content piece feels like it came from you.Knows Your AudienceLearns about your customer's mindset and pain points, then builds content they care about.

## Responsive Behavior
- **Desktop (1440px):** Original layout retained.
- **Tablet (768px):** Reduced spacing and some content wraps.
- **Mobile (390px):** Stacked layout with simplified x-axis labels in chart blocks.
- **Breakpoint:** 640px and 1024px observed in inline styles.
