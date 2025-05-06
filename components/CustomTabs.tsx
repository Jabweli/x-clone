"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const CustomTabs = ({tabs, path}:{tabs:any, path:string}) => {
  const pathname = usePathname();
  return (
    <div className="flex items-center overflow-hidden">
      {tabs.map((tab:any) => {
        const href = `/${path}${tab.path}`;
        const isActive = pathname === href;

        return (
          <div
            key={tab.label}
            className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer relative text-[15px] px-8"
          >
            <Link
              href={href}
              className={`pb-4 whitespace-nowrap ${
                isActive ? "text-white font-bold" : "text-textGray"
              }`}
            >
              {tab.label}
            </Link>
            {isActive && (
              <div className="bg-iconBlue w-[60px] h-1 rounded-full absolute bottom-0" />
            )}
          </div>
        );
      })}
    </div>
  )
}

export default CustomTabs