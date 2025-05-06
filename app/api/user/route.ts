import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
const { userId } = await auth();
  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({where:{id:userId}, select:{img:true}})
  if(!user) return;

  return Response.json({ user  });
}
