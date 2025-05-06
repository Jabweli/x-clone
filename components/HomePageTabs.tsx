"use client";

interface HomeTabProps {
  activeTab: "for"|"following";
  setActiveTab: (tab: "for"|"following") => void
}

const HomePageTabs = ({activeTab, setActiveTab}:HomeTabProps) => {
 
  return (
    <div className="sticky top-0 font-bold flex justify-between text-white text-sm border-b-[1px] border-borderGray z-10 backdrop-blur-lg bg-bgBlack/80">
      <div className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer text-textGray" onClick={() => setActiveTab("for")}>
        <span className={`pb-4 ${activeTab === "for" && "text-white border-b-4 border-iconBlue"}`}>For you</span>
      </div>

      <div className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer text-textGray" onClick={() => setActiveTab("following")}>
        <span className={`pb-4 ${activeTab === "following" && "text-white border-b-4 border-iconBlue"}`}>Following</span>
      </div>
    </div>
  );
};

export default HomePageTabs;
