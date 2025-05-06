"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import LoadingSpinner from "./LoadingSpinner";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/posts?cursor=${pageParam}&user=${userProfileId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
};

const InfiniteFeed = ({
  userProfileId,
}: {
  userProfileId?: string;
}) => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId),
    initialPageParam: 2,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 2 : undefined,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (status === "pending") return <LoadingSpinner />;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="text-center text-sm text-textGray mt-4">Loading...</div>
      }
      endMessage={<></>
      }
    >
      {allPosts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
