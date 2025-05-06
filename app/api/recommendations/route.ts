import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as string;

  const { userId } = await auth();
  if (!userId) return;

  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingUserIds = followingIds.map((follow) => follow.followingId);

  let recommendations: any = [];

  if (followingUserIds.length > 0) {
    // Based on followings' followings
    recommendations = await prisma.user.findMany({
      where: {
        id: { not: userId, notIn: followingUserIds },
        followings: { some: { followerId: { in: followingUserIds } } },
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: type === "main" ? 4:3,
      include: {
        _count: { select: { followers: true, followings: true, posts: true } },
        followings: userId ? { where: { followerId: userId } } : undefined,
      },
    });
  }

  // If no recs found yet (e.g., user is new), recommend most followed users
  if (recommendations.length === 0) {
    recommendations = await prisma.user.findMany({
      where: { id: { not: userId, notIn: followingUserIds } },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: type === "main" ? 4:3,
      include: {
        _count: { select: { followers: true, followings: true, posts: true } },
        followings: userId ? { where: { followerId: userId } } : undefined,
      },
    });
  }

  // final fallback: truly random users
  if (recommendations.length === 0) {
    recommendations = await prisma.user.findMany({
      where: { id: { not: userId, notIn: followingUserIds } },
      orderBy: { createdAt: "desc" },
      take: type === "main" ? 4:3,
      include: {
        _count: { select: { followers: true, followings: true, posts: true } },
        followings: userId ? { where: { followerId: userId } } : undefined,
      },
    });
  }

  return Response.json({recommendations});
}