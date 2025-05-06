import Post from "@/components/Post";
import { postInclude } from "@/lib/queries";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function Replies({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return;

  const username = (await params).username;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  const comments = await prisma.post.findMany({
    where: {
      userId: user?.id,
      parentPostId: {
        not: null, // Ensures the post is a comment
      },
    },
    include: {
      parentPost: {
        include: {
          ...postInclude(userId),
        },
      },
      ...postInclude(userId),
    },
  });

  const groupedByParent = comments.reduce((acc, comment) => {
    const parentId = comment.parentPostId!;
    if (!acc[parentId]) {
      acc[parentId] = {
        parentPost: comment.parentPost,
        comments: [],
      };
    }
    acc[parentId].comments.push(comment);
    return acc;
  }, {} as Record<number, { parentPost: (typeof comments)[0]["parentPost"]; comments: typeof comments }>);

  console.log(Object.values(groupedByParent));

  const groupedComments = Object.values(groupedByParent);

  return (
    <div>
      {groupedComments && groupedComments.length > 0 ? (
        groupedComments.map(({ parentPost, comments }) => (
          <div key={parentPost?.id} className="">
            {/* Parent Post */}
            {parentPost && <Post post={parentPost} />}

            {/* User's Comments */}
            <div className="space-y-2dd">
              {comments.map((comment) => (
                <Post key={comment.id} post={comment} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="w-[90%] xsm:w-[70%] xxl:w-[60%] mx-auto mt-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 w-11/12">
          {userId !== user?.id
              ? "No replies yet!"
              : "You've not replied to any posts"}
          </h1>
          <p className="text-textGray">
          {userId !== user?.id
              ? "This user hasn't commented on any posts."
              : "Write a comment to any post, they will show up here."}
            
          </p>
        </div>
      )}
    </div>
  );
}
