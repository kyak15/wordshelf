"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export type FeatureSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const AUTO_ADVANCE_MS = 3000;

export default function FeaturesCarousel({
  features,
}: {
  features: FeatureSlide[];
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      setIndex((i + features.length) % features.length);
    },
    [features.length],
  );

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (isPaused || features.length <= 1) return;
    const id = setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [index, isPaused, features.length, goTo]);

  if (features.length === 0) return null;

  const current = features[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        {/* Copy */}
        <div className="min-w-0 flex-1 text-center md:text-left">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-primary-text sm:text-3xl">
            {current.title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-secondary-text sm:text-lg">
            {current.description}
          </p>
        </div>

        {/* Screenshot */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-[220px] sm:max-w-[260px]">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-divider">
              <div className="aspect-[9/19] w-full">
                <Image
                  key={current.id}
                  src={current.image}
                  alt={current.imageAlt}
                  width={260}
                  height={549}
                  className="h-full w-full object-cover object-top"
                  sizes="(max-width: 640px) 220px, 260px"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="flex size-10 items-center justify-center rounded-full border border-divider bg-surface text-primary-text transition-colors hover:border-accent/50 hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            aria-label="Previous feature"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Feature slides"
          >
            {features.map((_, i) => (
              <button
                key={features[i].id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to feature ${i + 1}`}
                onClick={() => goTo(i)}
                className={`size-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
                  i === index
                    ? "bg-accent scale-110"
                    : "bg-divider hover:bg-secondary-text/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="flex size-10 items-center justify-center rounded-full border border-divider bg-surface text-primary-text transition-colors hover:border-accent/50 hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            aria-label="Next feature"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
