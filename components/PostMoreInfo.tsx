"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { FaTrashCan, FaCode } from "react-icons/fa6";
import { BsPin } from "react-icons/bs";
import { BsStars, BsChat } from "react-icons/bs";
import { IoVolumeMute } from "react-icons/io5";
import { BiBarChart } from "react-icons/bi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { deletePost } from "@/actions/actions";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

const PostMoreInfo = ({
  postId,
  originalUserId,
  username,
}: {
  postId: number;
  originalUserId: string;
  username: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasMounted = useRef(false);
  const postMenuRef = useRef<HTMLDivElement>(null);

  const [state, formAction] = useActionState(deletePost, {
    success: false,
    error: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postMenuRef.current &&
        !postMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (state.success) {
      setIsModalOpen(false);
      toast("Post deleted successfully!", {
        progress: undefined,
        className: "!bg-iconBlue !text-white !text-sm",
      });
    }

    if (state.error) {
      setIsModalOpen(false);
      toast.error(state.error, {
        progress: undefined,
        className: "!bg-red-500 !text-white !text-sm",
      });
    }
  }, [state.success, state.error]);

  const { user } = useUser();

  return (
    <div className="relative">
      <button className="group cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="rounded-full group-hover:bg-iconBlue/10 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              className="fill-textGray group-hover:fill-iconBlue"
              d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          ref={postMenuRef}
          className="absolute top-0 right-0 bg-bgBlack text-textLight rounded-2xl py-3 w-70 shadow-sm shadow-gray-500 z-[999] flex flex-col gap-2"
        >
          {originalUserId === user?.id && (
            <div
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4 text-red-600 w-full"
            >
              <FaTrashCan size={14} />
              <span>Delete</span>
            </div>
          )}
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <BsPin />
            <span>Pin to your profile</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <BsStars />
            <span>Highlight on your profile</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <IoVolumeMute />
            <span>Mute this conversation</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <BsChat />
            <span>Change who can reply</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <BiBarChart />
            <span>View post engagements</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <FaCode />
            <span>Embed post</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <BiBarChart />
            <span>View post analytics</span>
          </div>
          <div className="px-6 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-4">
            <HiOutlineSpeakerphone />
            <span>Request community note</span>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed w-screen h-screen top-0 left-0 z-[9999] bg-[#8bbef121] flex items-center justify-center">
          <div className="rounded-2xl bg-bgBlack w-[330px] h-max mt-6 overflow-hidden z-[9999] p-8">
            <h1 className="text-xl font-bold">Delete post?</h1>
            <p className="text-textGray text-[15px]">
              This can&apos;t be undone and it will be removed from your
              profile, the timeline of any accounts that follow you, and from
              search results.
            </p>
            <form action={formAction} className="mt-4">
              <input
                type="text"
                name="postId"
                value={postId}
                className="hidden"
                readOnly
              />
              <input
                type="text"
                name="username"
                value={username}
                className="hidden"
                readOnly
              />
              <button
                type="submit"
                className="bg-red-500 text-white font-semibold w-full py-3 rounded-full cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="bg-white text-black font-semibold w-full py-3 rounded-full mt-3 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMoreInfo;
