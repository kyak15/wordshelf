import Image from "next/image";
import Link from "next/link";
import FeaturesCarousel from "./components/molecules/FeaturesCarousel";

const FEATURES = [
  {
    id: "home",
    title: "Your reading hub",
    description:
      "See what you’re currently reading, track progress, and keep your streak going. Your vocabulary journey starts on the home screen.",
    image: "/home.PNG",
    imageAlt: "WordVault home screen",
  },
  {
    id: "books",
    title: "Save words from your books",
    description:
      "Add books to your library and capture new words as you read. Every word stays tied to the book so you never lose context.",
    image: "/book.PNG",
    imageAlt: "WordVault book and words",
  },
  {
    id: "word-lookup",
    title: "Look up words as you read",
    description:
      "Look up definitions while you read and save words straight to your book. Build your vocabulary in context.",
    image: "/word.PNG",
    imageAlt: "WordVault word lookup and save to book",
  },
  {
    id: "flashcards",
    title: "Review with smart flashcards",
    description:
      "Practice with spaced repetition. Review words when they’re due and watch your mastery grow over time.",
    image: "/flashcards.PNG",
    imageAlt: "WordVault flashcards",
  },
  {
    id: "flashcard-game",
    title: "Play the flashcard game",
    description:
      "Review your saved words with a quick, focused game. Flip cards, rate yourself, and level up your mastery.",
    image: "/flashcard.PNG",
    imageAlt: "WordVault flashcard game",
  },
  {
    id: "stats",
    title: "Track your progress",
    description:
      "Streaks, milestones, and activity heatmaps. See how much you’ve learned and stay motivated.",
    image: "/stats.PNG",
    imageAlt: "WordVault stats",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-10 border-b border-divider bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative size-8 overflow-hidden rounded-lg bg-surface ring-1 ring-divider">
                <Image
                  src="/wordvault_icon.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-base font-semibold text-primary-text">
                WordVault
              </span>
            </div>
            <a
              href="#features"
              className="hidden text-sm text-secondary-text hover:text-primary-text sm:block"
            >
              How it works
            </a>
          </div>
          <Link
            href="/auth/signin/google"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero - centered, no image */}
      <section className="border-b border-divider bg-surface/30 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            WordVault - Vocabulary app
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-text sm:text-4xl">
            Learn every word
            <br />
            <span className="text-secondary-text">you read.</span>
          </h1>
          <p className="mt-4 text-sm text-secondary-text sm:text-base">
            Save words from your books, review with flashcards, and build your
            vocabulary for good.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-text px-5 text-sm font-medium text-surface transition hover:opacity-90"
              aria-label="Download on the App Store (coming soon)"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-primary-text underline decoration-accent/60 underline-offset-2 hover:decoration-accent"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features - carousel with larger screenshot & description */}
      <main id="features" className="px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mx-auto max-w-5xl text-center text-lg font-semibold text-primary-text sm:text-xl">
          How it works
        </h2>
        <div className="mx-auto mt-10 max-w-5xl">
          <FeaturesCarousel features={FEATURES} />
        </div>
      </main>

      {/* Footer - minimal like MFP */}
      <footer className="border-t border-divider bg-surface/30 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs text-secondary-text">
            Already have an account?{" "}
            <Link
              href="/auth/signin/google"
              className="font-medium text-primary-text underline decoration-accent/60 underline-offset-2 hover:decoration-accent"
            >
              Sign in
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
