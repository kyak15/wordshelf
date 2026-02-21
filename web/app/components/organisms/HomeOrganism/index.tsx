import HomeTopCard from "../../molecules/HomeTopCard/HomeTopCard";

export default function HomeOrganism() {
  return (
    <div className="flex flex-col">
      {/* currently reading and recently added words card */}
      <HomeTopCard />
      
      <div> {/* 3 stats cards  */}</div>
    </div>
  );
}
