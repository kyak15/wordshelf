import BookIcon from "../BookIcon.tsx";

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
