import { getMasteryInfo } from "@/shared/constants/mastery";

type DetailedWordCardProps = {
  saved_word_id: string;
  text: string;
  saved_definition: string | null;
  saved_part_of_speech: string | null;
  mastery_level: number;
};

export default function DetailedWordCard({
  saved_word_id,
  text,
  saved_definition,
  saved_part_of_speech,
  mastery_level,
}: DetailedWordCardProps) {
  const mastery = getMasteryInfo(mastery_level);
  //   const book = getBookForWord(w.library_book_id);
  return (
    <li
      key={saved_word_id}
      className="group flex items-center gap-2 rounded-lg border border-transparent bg-[var(--surface)] px-2 py-1.5 transition hover:border-[var(--divider)] hover:bg-[var(--background)]"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--primary-text)]">
          {text}
          <span
            className="ml-1.5 rounded px-1.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${mastery.color}22`,
              color: mastery.color,
            }}
          >
            {mastery.label}
          </span>
        </p>
        {saved_part_of_speech && (
          <p className="mt-0.5 text-xs italic text-[var(--secondary-text)]">
            {saved_part_of_speech}
          </p>
        )}
        {saved_definition && (
          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--secondary-text)]">
            {saved_definition}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          className="rounded p-1 text-xs text-[var(--secondary-text)] hover:bg-[var(--divider)] hover:text-[var(--primary-text)]"
        >
          View
        </button>
        <button
          type="button"
          className="rounded p-1 text-xs text-[var(--secondary-text)] hover:bg-[var(--divider)] hover:text-[var(--primary-text)]"
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded p-1 text-xs text-[var(--secondary-text)] hover:bg-[var(--divider)] hover:text-[var(--primary-text)]"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
