"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react'
import LoadingSpinner from './LoadingSpinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post';


const fetchPosts = async (pageParam: number,) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/following?cursor=${pageParam}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
};

const Following = () => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["followings"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 2 : undefined,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (status === "pending") return <LoadingSpinner />;

  const followingPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={followingPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="text-center text-sm text-textGray mt-4">Loading...</div>
      }
      endMessage={<></>
      }
    >
      {followingPosts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </InfiniteScroll>
  )
}

export default Following