import CustomTabs from '@/components/CustomTabs';
import React from 'react'
import { IoSettingsOutline, IoSearchOutline } from "react-icons/io5";

export default function ExploreLayout({children}:{children:React.ReactNode}) {
  const tabs = [
    { label: "For You", path: "" },
    { label: "Trending", path: "/tabs/trending" },
    { label: "News", path: "/tabs/news" },
    { label: "Sports", path: "/tabs/sports" },
    { label: "Entertainment", path: "/tabs/entertainment" },
  ];

  return (
    <div>
      <div className="border-b-[1px] border-borderGray sticky top-0 backdrop-blur-lg bg-bgBlack/80">
        <div className="flex justify-between items-center px-4 py-1 gap-8">
          <div className="flex items-center gap-2 border border-borderGray px-4 py-3 rounded-full flex-1">
            <IoSearchOutline className="text-textGray" />
            <input
              type="text"
              placeholder="Search"
              className="placeholder:text-textLight text-sm"
            />
          </div>
          <IoSettingsOutline />
        </div>
        <CustomTabs tabs={tabs} path="explore" />
      </div>
      {children}
    </div>
  )
}
