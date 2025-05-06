"use client";

import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { LuRepeat2 } from "react-icons/lu";
import { likePost, rePost, savePost } from "@/actions/actions";
import { useOptimistic, useState } from "react";
import { Slide, toast } from "react-toastify";

const PostInteractions = ({
  postId,
  count,
  isLiked,
  isRePosted,
  isSaved,
}: {
  postId: number;
  count: { likes: number; rePosts: number; comments: number };
  isLiked: boolean;
  isRePosted: boolean;
  isSaved: boolean;
}) => {
  const [state, setState] = useState({
    likes: count.likes,
    isLiked: isLiked,
    rePosts: count.rePosts,
    isRePosted: isRePosted,
    isSaved: isSaved,
  });

  const likeAction = async () => {
    setOptimisticCount("like");
    await likePost(postId);
    setState((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const repostAction = async () => {
    setOptimisticCount("repost");
    await rePost(postId);
    setState((prev) => ({
      ...prev,
      rePosts: prev.isRePosted ? prev.rePosts - 1 : prev.rePosts + 1,
      isRePosted: !prev.isRePosted,
    }));
  };

  const saveAction = async () => {
    setOptimisticCount("save");
    await savePost(postId);
    setState((prev) => ({
      ...prev,
      isSaved: !prev.isSaved,
    }));
    toast(!state.isSaved ? "Added to your bookmarks":"Removed from your bookmarks", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "!bg-iconBlue !text-white !text-sm",
      transition: Slide
    });
  };

  const [optimisticCount, setOptimisticCount] = useOptimistic(
    state,
    (prev, type: "like" | "repost" | "save") => {
      switch (type) {
        case "like":
          return {
            ...prev,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            isLiked: !prev.isLiked,
          };
        case "repost":
          return {
            ...prev,
            rePosts: prev.isRePosted ? prev.rePosts - 1 : prev.rePosts + 1,
            isRePosted: !prev.isRePosted,
          };
        case "save":
          return {
            ...prev,
            isSaved: !prev.isSaved,
          };
        default:
          return prev;
      }
    }
  );

  return (
    <div className="text-textGray">
      <div className="flex items-center justify-between">
        {/* comments */}
        <div className="group flex items-center cursor-pointer">
          <div className="rounded-full group-hover:bg-iconBlue/10 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                className="fill-textGray
               group-hover:fill-iconBlue"
                d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
              />
            </svg>
          </div>
          <span className="group-hover:text-iconBlue text-[13px] font-medium -ml-1.5">
            {count.comments}
          </span>
        </div>

        {/* repost */}
        <form
          action={repostAction}
          className="group flex items-center cursor-pointer gap-1"
        >
          <button className="rounded-full group-hover:bg-iconGreen/10 p-2">
            <LuRepeat2
              size={21}
              className={`${
                optimisticCount.isRePosted ? "text-iconGreen" : "text-textGray"
              } group-hover:text-iconGreen`}
            />
          </button>
          <span
            className={`${
              optimisticCount.isRePosted && "text-iconGreen"
            } group-hover:text-iconGreen text-[13px] font-medium -ml-1.5`}
          >
            {optimisticCount.rePosts}
          </span>
        </form>

        {/* like */}
        <form
          action={likeAction}
          className="group flex items-center cursor-pointer"
        >
          <button
            type="submit"
            className="rounded-full group-hover:bg-iconPink/10 p-2"
          >
            {optimisticCount.isLiked ? (
              <FaHeart className="text-iconPink" size={17} />
            ) : (
              <FaRegHeart
                className="text-textGray group-hover:text-iconPink"
                size={17}
              />
            )}
          </button>
          <span
            className={`${
              optimisticCount.isLiked ? "text-iconPink" : ""
            } group-hover:text-iconPink text-[13px] font-medium -m-1`}
          >
            {optimisticCount.likes}
          </span>
        </form>

        {/* Bookmark and share */}
        <div className="flex items-center">
          <form action={saveAction}>
            <button
              type="submit"
              className="group cursor-pointer rounded-full hover:bg-iconBlue/10 p-2"
            >
              {optimisticCount.isSaved ? (
                <FaBookmark className="text-iconBlue" size={17} />
              ) : (
                <FaRegBookmark
                  className="text-textGray group-hover:text-iconBlue"
                  size={17}
                />
              )}
            </button>
          </form>
          <div className="group cursor-pointer rounded-full hover:bg-iconBlue/10 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                className="fill-textGray group-hover:fill-iconBlue"
                d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInteractions;
