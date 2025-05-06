"use client";
import React, { useEffect, useState } from "react";
import PostMoreInfo from "./PostMoreInfo";
import Link from "next/link";
import PostInteractions from "./PostInteractions";
import ImageKit from "./ImageKit";
import IKVideo from "./IKVideo";
import { Post as PostType } from "@/app/generated/prisma";
import { format } from "timeago.js";
import { useUser } from "@clerk/nextjs";
import { LuRepeat2 } from "react-icons/lu";
import { formatDate, WithHashtags } from "@/utils/helpers";

type PostWithDetails = PostType & {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    img: string | null;
  };
  rePost?:
    | (PostType & {
        user: {
          id: string;
          username: string;
          displayName: string | null;
          img: string | null;
        };
        _count: { likes: number; rePosts: number; comments: number };
        likes: { id: number }[];
        rePosts: { id: number }[];
        saves: { id: number }[];
      })
    | null;
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Post = ({
  type,
  post,
}: {
  type?: "status" | "comment";
  post: PostWithDetails;
}) => {
  const [time, setTime] = useState("");
  const { user, isLoaded } = useUser();
  const originalPost = post.rePost || post;

  useEffect(() => {
    setTime(format(originalPost.createdAt));
  }, [originalPost.createdAt]);

  
  if (!isLoaded || !user) return null;

  return (
    <div
      className={`px-4 py-2 hover:bg-bgBlack/20 cursor-pointer ${
        type !== "status" ? "border-b-[1px] border-borderGray" : ""
      }`}
      suppressHydrationWarning
    >
      {/* POST TYPE */}
      {type !== "status" && post.rePostId && (
        <div className="flex items-center gap-2 text-textGray mb-2 font-bold text-sm">
          <LuRepeat2 size={18} className="text-textGray" />
          <span>
            {post.user.id === user.id ? "You" : post.user.displayName} reposted
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex gap-2">
        {/* avatar */}
        <div
          className={`w-10 h-10 mt-1 rounded-full overflow-hidden ${
            type === "status" && "hidden"
          }`}
        >
          <ImageKit
            src={originalPost.user.img || "x-clone/general/default-avatar.jpg"}
            alt="avatar"
            w={100}
            h={100}
          />
        </div>

        {/* Post Content */}
        <div className="flex-1">
          {/* top */}
          <div
            className={`${type === "status" && "flex items-center gap-2 mb-4"}`}
          >
            {type === "status" && (
              <ImageKit
                src={
                  originalPost.user.img || "x-clone/general/default-avatar.jpg"
                }
                alt="avatar"
                w={100}
                h={100}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex items-center justify-between w-full">
              <div
                className={`flex items-center gap-x-2 text-[15px] flex-wrap ${
                  type === "status" && "flex-col !items-start"
                }`}
              >
                <Link
                  href={`/${originalPost.user.username}`}
                  className="text-textLight font-bold hover:underline"
                >
                  {originalPost.user.displayName}
                </Link>
                <div className="text-textGray flex gap-1">
                  <Link href="" className="">
                    @{originalPost.user.username}
                  </Link>
                  {type !== "status" && (
                    <span>
                      {" "}
                      <span className="font-bold">·</span>{" "}
                      {time}
                    </span>
                  )}
                </div>
              </div>
              <PostMoreInfo
                postId={originalPost.id}
                originalUserId={originalPost.user.id}
                username={originalPost.user.username}
              />
            </div>
          </div>

          {/* text and media */}
          <div className="flex flex-col gap-3 text-[15px] text-textLight">
            <Link
              href={`/${originalPost.user.username}/status/${originalPost.id}`}
              className="flex flex-col gap-3"
            >
              <div dangerouslySetInnerHTML={{ __html: WithHashtags(originalPost.desc as string) }} />
            </Link>

            {originalPost.img && (
              <ImageKit
                src={originalPost.img}
                alt="post"
                w={originalPost.imgWidth as number}
                h={originalPost.imgHeight as number}
                className={`rounded-2xl max-h-[600px] border border-borderGray ${
                  originalPost.isSensitive ? "blur-lg" : ""
                }`}
              />
            )}

            {originalPost.video && (
              <IKVideo
                path={originalPost.video}
                className={`rounded-2xl border border-borderGray max-h-[600px] ${originalPost.isSensitive ? "blur-lg" : ""}`}
                showControls={true}
              />
            )}

            {type === "status" && (
              <span className="text-textGray text-[15px]">
                {formatDate(originalPost.createdAt)} ·{" "}
                {/* <span className="text-textLight font-semibold">95.6K</span>{" "}
                Views */}
              </span>
            )}
          </div>

          {/* interaction buttons */}
          <div
            className={`${
              type === "status"
                ? "border-y-[1px] border-borderGray my-2 py-1"
                : "mt-2"
            }`}
          >
            <PostInteractions
              postId={originalPost.id}
              count={originalPost._count}
              isLiked={!!originalPost.likes.length}
              isRePosted={!!originalPost.rePosts.length}
              isSaved={!!originalPost.saves.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
