"use client"
import Link from "next/link";
import React from "react";
import ImageKit from "./ImageKit";
import FollowBtn from "./FollowBtn";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

const fetchUsers = async (type:"main"|"sidebar"|undefined) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/recommendations?type=${type}`)
  return res.json();
}

const Recommendations = ({ type }: { type?: "main" | "sidebar" }) => {

  const {data, isLoading} = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => fetchUsers(type)
  })

  if(isLoading) return <LoadingSpinner />

  const recommendations = data.recommendations;


  return (
    <div
      className={`flex flex-col gap-2 ${
        type === "sidebar" ? "border border-borderGray rounded-xl mt-4" : "border-b-[1px] border-borderGray"
      }`}
    >
      <div className="px-4 pt-4">
        <h1 className="font-bold text-[22px]">Who to follow</h1>
      </div>
      {recommendations.map((user: any) => (
        <div
          key={user.id}
          className="flex justify-between px-4 py-2 items-center hover:bg-[#191919]/40 cursor-pointer"
        >
          <div className="flex gap-2">
            <div className="w-[45px] h-[45px]">
              <ImageKit
                src={user.img || "x-clone/general/default-avatar.jpg"}
                alt={user.displayName || ""}
                w={50}
                h={50}
                className="rounded-full w-full h-full"
              />
            </div>
            <div className="flex-1 text-[15px]">
              <Link
                href={`/${user.username}`}
                className="text-textLight capitalize hover:underline"
              >
                {user.displayName || user.username}
              </Link>
              <p className="text-textGray">@{user.username}</p>
              {type === "main" && <p>{user.bio}</p>}
            </div>
          </div>
          <FollowBtn userId={user.id} isFollowed={!!user.followings.length} />
        </div>
      ))}

      <Link
        href=""
        className="text-blue-600 text-sm py-3 px-4 hover:bg-[#191919]/40 flex flex-col justify-center"
      >
        Show more
      </Link>
    </div>
  );
};

export default Recommendations;
