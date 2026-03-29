import type { SVGProps } from "react";

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 9L11 13L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckSquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="0.5" y="0.5" width="12.51" height="12.5" rx="1.5" stroke="currentColor" />
      <path d="M5.37928 8.15898L10.2392 3.2991L10.8843 3.94422L5.37928 9.44922L2.82031 6.89025L3.46543 6.24514L5.37928 8.15898Z" fill="currentColor" />
    </svg>
  );
}

export function LogoFaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <circle cx="11.5" cy="13" r="2" fill="white" />
      <circle cx="20.5" cy="13" r="2" fill="white" />
      <path d="M10 20C11.5 22 13.7 23 16 23C18.3 23 20.5 22 22 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
