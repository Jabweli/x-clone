import { postInclude } from "@/lib/queries";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get("cursor");
  const LIMIT = 10;

  const { userId } = await auth();
  if (!userId) return Response.json({ posts: [] });

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  const whereCondition = {
    userId: { in: followingIds },
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

  // revalidatePath("/");

  const totalPosts = await prisma.post.count({ where: whereCondition });
  const hasMore = totalPosts > Number(page) * LIMIT;

  return Response.json({ posts, hasMore });
}
