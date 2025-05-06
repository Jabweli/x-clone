import Link from "next/link";
import React from "react";
import MoreButton from "./MoreButton";

const PopularTags = ({ type }: { type?: "main" | "rightbar" }) => {
  return (
    <div className={`flex flex-col gap-4 ${type === "rightbar" && "mt-3"}`}>
      {/* Subscribe */}
      {type === "rightbar" && (
        <div className="flex flex-col gap-2 border border-borderGray rounded-xl p-4">
          <h1 className="font-bold text-[20px]">Subscribe to Premium</h1>
          <p className="text-textLight text-sm">
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </p>
          <Link
            href="/"
            className="py-2 px-4 bg-iconBlue w-max rounded-full font-semibold text-sm"
          >
            Subscribe
          </Link>
        </div>
      )}

      {/* what's happening */}
      <div
        className={`flex flex-col gap-2 overflow-hidden border-borderGray ${
          type === "rightbar" ? "border rounded-xl" : "border-b-[1px]"
        }`}
      >
        {type === "rightbar" && (
          <div className="px-4 pt-4">
            <h1 className="font-bold text-[20px]">What&apos;s happening</h1>
          </div>
        )}
        <Link
          href=""
          className="flex justify-between pl-4 pr-2 py-2 items-start hover:bg-[#191919]/40"
        >
          <div>
            <span className="text-textGray text-[13px]">
              Trending in Uganda
            </span>
            <h2 className="text-textLight">Accident</h2>
            <span className="text-textGray text-[13px]">38.8K posts</span>
          </div>
          <MoreButton />
        </Link>
        <Link
          href=""
          className="flex justify-between pl-4 pr-2 py-2 items-start hover:bg-[#191919]/40"
        >
          <div>
            <span className="text-textGray text-[13px]">
              Trending in Uganda
            </span>
            <h2 className="text-textLight">MHRISP</h2>
          </div>
          <MoreButton />
        </Link>
        <Link
          href=""
          className="flex justify-between pl-4 pr-2 py-2 items-start hover:bg-[#191919]/40"
        >
          <div>
            <span className="text-textGray text-[13px]">Music . Trending</span>
            <h2 className="text-textLight">Wizkid</h2>
            <span className="text-textGray text-[13px]">115K posts</span>
          </div>
          <MoreButton />
        </Link>
        <Link
          href=""
          className="flex justify-between pl-4 pr-2 py-2 items-start hover:bg-[#191919]/40"
        >
          <div>
            <span className="text-textGray text-sm">Trending in Uganda</span>
            <h2 className="text-textLight">Jinja</h2>
            <span className="text-textGray text-sm">2,194 posts</span>
          </div>
          <MoreButton />
        </Link>

        {type === "rightbar" && (
          <Link
            href=""
            className="text-blue-600 text-sm py-3 px-4 hover:bg-[#191919]/40"
          >
            Show more
          </Link>
        )}
      </div>
    </div>
  );
};

export default PopularTags;
