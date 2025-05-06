import CustomTabs from "@/components/CustomTabs";
import React from "react";
import { TbSettings } from "react-icons/tb";

const tabs = [
  { label: "All", path: "" },
  { label: "Verified", path: "/verified" },
  { label: "Mentions", path: "/mentions" },
];

export default function NotificationLayout({children}:{children:React.ReactNode}) {
  return (
    <div>
      <div className="sticky top-0 w-full bg-bgBlackdd backdrop-blur-lg border-[1px] border-borderGray z-20">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <TbSettings size={20} />
        </div>

        <CustomTabs tabs={tabs} path="notifications" />
      </div>
      {children}
    </div>
  );
}
