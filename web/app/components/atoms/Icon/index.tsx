import type { SVGProps } from "react";

const ICONS = {
  lightning: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  "arrow-right": (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const defaultSize = 24;

export default function Icon({
  name,
  size = defaultSize,
  className = "",
  ...rest
}: IconProps) {
  const Svg = ICONS[name];
  if (!Svg) return null;
  return <Svg width={size} height={size} className={className} {...rest} />;
}
