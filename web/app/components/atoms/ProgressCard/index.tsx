import LoadingSpinner from "../LoadingSpinner";

type ProgressCardProps = {
  streak: number;
  title: string;
  loading?: boolean;
};

export default function ProgressCard({
  streak,
  title,
  loading,
}: ProgressCardProps) {
  return (
    <div className="rounded-xl bg-[var(--background)] p-3 text-center">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="text-2xl font-bold text-[var(--accent)]">{streak}</p>
          <p className="text-xs text-[var(--secondary-text)]">{title}</p>{" "}
        </>
      )}
    </div>
  );
}
