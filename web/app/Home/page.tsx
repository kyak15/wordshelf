"use client";
import GreetingBanner from "../components/molecules/GreetingBanner";
import CurrentlyReadingSection from "../components/molecules/CurrentlyReadingSection";
import RecentWordsSection from "../components/molecules/RecentWordsSection";
import HomeProgressSection from "../components/molecules/HomeProgressSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <GreetingBanner />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        <CurrentlyReadingSection />
        <RecentWordsSection />
      </div>
      <HomeProgressSection />
    </div>
  );
}
