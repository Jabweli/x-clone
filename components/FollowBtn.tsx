"use client";

import { followUser } from "@/actions/actions";
import { useOptimistic, useState } from "react";

const FollowBtn = ({
  userId,
  isFollowed,
}: {
  userId: string;
  isFollowed: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [state, setState] = useState(isFollowed);

  const formAction = async () => {
    switchOptimisticFollow("");
    await followUser(userId);
    setState((prev) => !prev);
  };

  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  const buttonText = optimisticFollow
    ? isHovered
      ? "Unfollow"
      : "Following"
    : "Follow";

  const baseClasses =
    "border-[1px] border-gray-500 rounded-full w-[100px] py-2 px-4 font-semibold cursor-pointer text-sm transition-colors duration-200";

  const followedClasses = isHovered
    ? "bg-red-500/10 text-red-500 border-red-500"
    : "bg-black text-white";

  const notFollowedClasses = "bg-white text-black";

  return (
    <form action={formAction}>
      <button
        type="submit"
        className={`${baseClasses} ${
          optimisticFollow ? followedClasses : notFollowedClasses
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default FollowBtn;
