type SimpleWordCardProps = {
  id: string;
  text: string;
  definition: string | null;
};

export default function SimpleWordCard({
  id,
  text,
  definition,
}: SimpleWordCardProps) {
  return (
    <li
      key={id}
      className="rounded-lg border border-[var(--divider)] bg-[var(--background)] px-3 py-2"
    >
      <p className="font-medium text-[var(--primary-text)]">{text}</p>
      {definition && (
        <p className="mt-0.5 line-clamp-2 text-sm text-[var(--secondary-text)]">
          {definition}
        </p>
      )}
    </li>
  );
}
