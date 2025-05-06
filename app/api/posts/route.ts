import { postInclude } from "@/lib/queries";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const userProfileId = searchParams.get("user") as string;
  const page = searchParams.get("cursor");

  const LIMIT = 10;

  const { userId } = await auth();
  if (!userId) return Response.json({ posts: [] });


  const whereCondition = userProfileId !== "undefined"
  ? { parentPostId: null, userId: userProfileId }
  : {
      parentPostId: null,
    };


  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: {
      rePost: {
        include: postInclude(userId),
      },
      ...postInclude(userId),
    },
    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT,
  });


  // const following = await prisma.follow.findMany({
  //   where: { followerId: userId },
  //   select: { followingId: true },
  // });

  // const followingIds = following.map((f) => f.followingId);

  // // Get users followed by *my followers*
  // const extendedFollowing = await prisma.follow.findMany({
  //   where: {
  //     followerId: { in: followingIds },
  //   },
  //   select: { followingId: true },
  // });

  // const extendedFollowingIds = extendedFollowing.map((f) => f.followingId);

  // const userAndNetworkIds = Array.from(
  //   new Set([userId, ...followingIds, ...extendedFollowingIds])
  // );

  // const whereCondition = userProfileId !== "undefined"
  //   ? { parentPostId: null, userId: userProfileId }
  //   : {
  //       parentPostId: null,
  //       userId: { in: userAndNetworkIds },
  //     };

  // let posts;

  // if (userAndNetworkIds.length <= 1) {
  //   posts = await prisma.post.findMany({
  //     where: { parentPostId: null },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       rePost: {
  //         include: postInclude(userId),
  //       },
  //       ...postInclude(userId),
  //     },
  //     take: LIMIT,
  //     skip: (Number(page) - 1) * LIMIT,
  //   });
  // } else {
  //   posts = await prisma.post.findMany({
  //     where: whereCondition,
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       rePost: {
  //         include: postInclude(userId),
  //       },
  //       ...postInclude(userId),
  //     },
  //     take: LIMIT,
  //     skip: (Number(page) - 1) * LIMIT,
  //   });
  // }

  const totalPosts = await prisma.post.count({ where: whereCondition });
  const hasMore = totalPosts > Number(page) * LIMIT;

  return Response.json({ posts, hasMore });
}
