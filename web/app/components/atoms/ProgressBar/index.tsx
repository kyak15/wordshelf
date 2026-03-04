type ProgressBarProps = {
  numerator: number;
  denominator: number;
  height?: number;
  className?: string;
};

export default function ProgressBar({
  numerator = 0,
  denominator,
  height = 8,
  className = "",
}: ProgressBarProps) {
  const progress =
    denominator > 0 ? Math.min(Math.max(numerator / denominator, 0), 1) : 0;
  const percentage = Math.round(progress * 100);

  return (
    <div
      className={`overflow-hidden rounded-full bg-[var(--divider)] ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${percentage}%`}
    >
      <div
        className="h-full rounded-full bg-[var(--success)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
