import { type ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingColor = "primary" | "secondary" | "accent" | "success";

interface HeadingProps {
  level?: HeadingLevel;
  color?: HeadingColor;
  className?: string;
  children: ReactNode;
}

const colorClass: Record<HeadingColor, string> = {
  primary: "text-[var(--primary-text)]",
  secondary: "text-[var(--secondary-text)]",
  accent: "text-[var(--accent)]",
  success: "text-[var(--success)]",
};

const levelClass: Record<HeadingLevel, string> = {
  1: "text-3xl font-bold tracking-tight",
  2: "text-2xl font-bold tracking-tight",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold uppercase tracking-wide",
};

function headingClassName(
  level: HeadingLevel,
  color: HeadingColor,
  className: string,
) {
  return [colorClass[color], levelClass[level], className]
    .filter(Boolean)
    .join(" ");
}

export default function Heading({
  level = 2,
  color = "primary",
  className = "",
  children,
}: HeadingProps) {
  const cn = headingClassName(level, color, className);

  switch (level) {
    case 1:
      return <h1 className={cn}>{children}</h1>;
    case 2:
      return <h2 className={cn}>{children}</h2>;
    case 3:
      return <h3 className={cn}>{children}</h3>;
    case 4:
      return <h4 className={cn}>{children}</h4>;
    case 5:
      return <h5 className={cn}>{children}</h5>;
    case 6:
      return <h6 className={cn}>{children}</h6>;
  }
}
