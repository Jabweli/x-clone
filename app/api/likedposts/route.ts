import { postInclude } from "@/lib/queries";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const likedPosts = await prisma.like.findMany({
    where: { userId: userId },
    include: {
      post: {
        include: {
          ...postInclude(userId),
        },
      },
    },
  });

  return Response.json({likedPosts});
}
