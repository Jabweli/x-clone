"use client";
import React, { useState } from "react";
import ImageKit from "./ImageKit";
import { SignOutButton } from "@clerk/nextjs";

const UserInfo = ({
  username,
  displayName,
  img,
}: {
  img: string | null;
  displayName: string | null;
  username: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative flex items-center justify-between rounded-full hover:bg-[#181818] p-3 text-sm cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          <ImageKit
            src={img || "x-clone/general/default-avatar.jpg"}
            alt={username}
            w={40}
            h={40}
          />
        </div>
        <div className="hidden xxl:block">
          <p className="font-semibold text-sm capitalize">{displayName || username}</p>
          <span className="text-textGray text-xs">@{username}</span>
        </div>
      </div>
      <div className="hidden xxl:block cursor-pointer">
        <ImageKit
          src="x-clone/icons/infoMore.svg"
          alt="info-more"
          w={24}
          h={24}
        />
      </div>

      {isOpen && (
        <div className="absolute -top-30 left-0 xxl:-left-5dd bg-bgBlack text-white rounded-2xl py-3 w-70 xxl:w-[300px] shadow-sm shadow-gray-500 z-[999]">
          <div className="px-6 py-3 hover:bg-[#181818] cursor-pointer">
            Add an existing account
          </div>
          <SignOutButton>
            <div className="px-6 py-3 hover:bg-[#181818] cursor-pointer">
              Log out @{username}
            </div>
          </SignOutButton>
          <div className="absolute w-3 h-3 bg-bgBlack rotate-45 bottom-[-5px] left-6 xxl:left-1/2 xxl:-translate-x-1/2 shadow-sm shadow-gray-500" />
        </div>
      )}
    </div>
  );
};

export default UserInfo;
