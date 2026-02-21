type ThumbnailSize = "small" | "medium" | "large";

interface BookThumbnailProps {
  uri?: string | null;
  size?: ThumbnailSize;
}

const sizeConfig: Record<ThumbnailSize, { width: number; height: number }> = {
  small: { width: 48, height: 72 },
  medium: { width: 64, height: 96 },
  large: { width: 96, height: 144 },
};

function BookIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neutral-400"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

export default function BookThumbnail({
  uri,
  size = "medium",
}: BookThumbnailProps) {
  const dimensions = sizeConfig[size];

  if (!uri) {
    return (
      <div
        className="flex items-center justify-center rounded bg-neutral-200 dark:bg-neutral-700"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <BookIcon size={dimensions.width * 0.5} />
      </div>
    );
  }

  return (
    <img
      src={uri}
      alt=""
      className="rounded object-cover"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  );
}
