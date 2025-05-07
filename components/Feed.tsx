"use client";

import Post from "./Post";
import InfiniteFeed from "./InfiniteFeed";
import Recommendations from "./Recommendations";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/posts?cursor=${pageParam}&user=${userProfileId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
};

const Feed = ({ userProfileId }: { userProfileId?: string;}) => {

  const {data, isLoading} = useQuery({
    queryKey: ["userposts"],
    queryFn: () => fetchPosts(1, userProfileId)
  })

  if(isLoading) return <LoadingSpinner />

  const posts = data.posts;

  return (
    <>
      {posts && posts.length > 0 ? (
        <>
          {posts.map((post:any, index:number) => (
            <React.Fragment key={post.id}>
              <Post post={post} />
              {index === 4 && <Recommendations type="main" />}{" "}
            </React.Fragment>
          ))}
          <InfiniteFeed userProfileId={userProfileId} />
        </>
      ) : (
        <Recommendations type="main" />
      )}
    </>
  );
};

export default Feed;
