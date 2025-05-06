import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFoundUser({ username }: { username: string }) {
  return (
    <div className="">
      <div className="sticky top-0 z-10 px-2 py-1 flex items-center gap-8 backdrop-blur-lg bg-bgBlack/80">
        <Link
          href="/"
          className="w-10 h-10 rounded-full hover:bg-[#181818] p-2 flex items-center justify-center"
        >
          <Image src="/icons/back.svg" alt="" width={20} height={20} />
        </Link>
        <h1 className="font-bold text-xl pb-0 mb-0">Profile</h1>
      </div>
      {/* COVER & PROFILE IMAGE */}
      <div className="relative w-full h-50 bg-[#181818]">
        <div className="absolute w-[140px] h-[140px] bg-[rgb(24,24,24)] rounded-full -bottom-14 left-5 border-4 border-bgBlack overflow-hidden"></div>
      </div>

      <div className="mt-18 px-4">
        <h1 className="text-xl">@{username}</h1>

        <div className="h-70 w-[60%] mx-auto flex flex-col items-centerdd justify-center">
          <h1 className="text-3xl font-bold">
            This account doesn&apos;t exist
          </h1>
          <span className="text-textGray text-[15px]">
            Try searching for another.
          </span>
        </div>
      </div>
    </div>
  );
}
