"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Post from "@/components/Post";
import { IoIosLock } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

const fetchLikedPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/likedposts`);
  return res.json();
};

export default function Likes() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const params = useParams();
  const pageUsername = params.username as string;

  useEffect(() => {
    if (isLoaded && user?.username !== pageUsername) {
      router.replace(`/${pageUsername}`);
    }
  }, [isLoaded, user, pageUsername, router]);

  if (!isLoaded || user?.username !== pageUsername) return null;

  const { data, isLoading, error } = useQuery({
    queryKey: ["likedposts"],
    queryFn: () => fetchLikedPosts(),
  });

  if (isLoading) return <LoadingSpinner />;
  const likedPosts = data.likedPosts;

  return (
    <>
      {likedPosts && likedPosts.length > 0 ? (
        <>
          <div className="m-1 bg-[#02113D] text-sm rounded-md px-4 py-3 flex gap-3 items-center">
            <IoIosLock size={18} />
            <span>Your likes are private. Only you can see them.</span>
          </div>
          {likedPosts.map((likedPost: any) => (
            <Post key={likedPost.id} post={likedPost.post} />
          ))}
        </>
      ) : (
        <>
          {error ? (
            <h1>Something went wrong</h1>
          ) : (
            <div className="w-[90%] xsm:w-[70%] xxl:w-[60%] mx-auto mt-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 w-11/12">
                You have not liked any posts!
              </h1>
              <p className="text-textGray">
                When you like any posts, they will show up here.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
