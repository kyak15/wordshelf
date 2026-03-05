import { Dispatch, SetStateAction } from "react";

export type DropDownFilterOption = {
  value: string;
  label: string;
};

type DropDownFilterProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  options: DropDownFilterOption[];
  allOptionValue?: string;
  allOptionLabel?: string;
  className?: string;
};

export default function DropDownFilter({
  value,
  setValue,
  options,
  allOptionValue,
  allOptionLabel,
  className = "relative ml-1",
}: DropDownFilterProps) {
  return (
    <div className={className}>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="appearance-none rounded-full border border-[var(--divider)] bg-[var(--surface)] px-3 py-1 pr-7 text-xs font-medium text-[var(--primary-text)] focus:border-[var(--accent)] focus:outline-none"
      >
        {allOptionValue != null && allOptionLabel != null && (
          <option value={allOptionValue}>{allOptionLabel}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--secondary-text)]">
        ▾
      </span>
    </div>
  );
}
