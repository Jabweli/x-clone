"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const tabs = [
  { label: "Posts", path: "" },
  { label: "Replies", path: "/with_replies" },
  { label: "Highlights", path: "/highlights", hidden:true },
  { label: "Articles", path: "/articles", hidden:true },
  { label: "Media", path: "/media" },
  { label: "Likes", path: "/likes" },
];

export default function ProfileTabs({ username, authUserName }: { username: string; authUserName:string; }) {
  const pathname = usePathname();


  return (
    <div className="font-bold flex justify-between text-white text-sm border-b-[1px] border-borderGray z-10 backdrop-blur-lg overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabs.map((tab) => {
        const href = `/${username}${tab.path}`;
        const isActive = pathname === href;
        const isAuthUser = (tab.label === "Likes" || tab.label === "Highlights" || tab.label === "Articles") && (username !== authUserName) ? "hidden" : tab.hidden ? "hidden md:flex":"flex";

        return (
          <div
            key={tab.label}
            className={`pt-4 items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer relative ${isAuthUser}`}
          >
            <Link
              href={href}
              className={`pb-4 whitespace-nowrap ${isActive ? "text-white":"text-textGray"}`}
            >
              {tab.label}
            </Link>
            {isActive && <div className="bg-iconBlue w-[60px] h-1 rounded-full absolute bottom-0"/>}
          </div>
        );
      })}
    </div>
  );
}
