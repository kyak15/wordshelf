import { type ReactNode } from "react";

type TextVariant = "body" | "small" | "caption";

type TextColor = "primary" | "secondary" | "muted" | "accent" | "success";

type TextAs = "p" | "span" | "div";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  as?: TextAs;
  className?: string;
  children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
  body: "text-base leading-relaxed",
  small: "text-sm leading-normal",
  caption: "text-xs leading-normal",
};

const colorClass: Record<TextColor, string> = {
  primary: "text-[var(--primary-text)]",
  secondary: "text-[var(--secondary-text)]",
  muted: "text-[var(--secondary-text)] opacity-80",
  accent: "text-[var(--accent)]",
  success: "text-[var(--success)]",
};

export default function Text({
  variant = "body",
  color = "primary",
  as: Component = "p",
  className = "",
  children,
}: TextProps) {
  const combined = [
    variantClass[variant],
    colorClass[color],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={combined}>{children}</Component>;
}
