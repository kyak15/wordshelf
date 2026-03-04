type EmptyHomeDataProps = {
  text: string;
};

export default function EmptyHomeData({ text }: EmptyHomeDataProps) {
  return (
    <section className="flex flex-col">
      <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-4">
        <p className="text-sm text-[var(--secondary-text)]">{text}</p>
      </div>
    </section>
  );
}
