import { Dispatch } from "react";

type FilterButtonProps = {
  id: string;
  color: string | null;
  isActive: boolean;
  count: number;
  label: string;
  setStatusFilter: Dispatch<React.SetStateAction<string>>;
};

export default function FilterButton({
  id,
  color,
  isActive,
  count,
  label,
  setStatusFilter,
}: FilterButtonProps) {
  return (
    <button
      key={id}
      type="button"
      onClick={() => setStatusFilter(id)}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--divider)] px-2.5 py-1 text-xs font-medium transition ${
        isActive
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--primary-text)]"
          : "bg-[var(--surface)] text-[var(--primary-text)] hover:bg-[var(--divider)]"
      }`}
    >
      {color != null && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span>{label}</span>
      <span className="font-semibold">{count}</span>
    </button>
  );
}
