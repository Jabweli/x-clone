import Comments from "@/components/Comments";
import Post from "@/components/Post";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SinglePost({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return;
  }
  const authUser = await prisma.user.findUnique({where: {id:userId}, select:{img:true}});
  const postId = (await params).postId;

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: {
      user: { select: {id:true, username: true, displayName: true, img: true } },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id:true, username: true, displayName: true, img: true } },
          _count: { select: { likes: true, rePosts: true, comments: true } },
          likes: { where: { userId: userId }, select: { id: true } },
          comments: { where: { userId: userId }, select: { id: true } },
          rePosts: { where: { userId: userId }, select: { id: true } },
          saves: { where: { userId: userId }, select: { id: true } },
        },
      },
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <>
      {/* Title */}
      <div className="sticky top-0 z-10 px-4 py-2 flex items-center justify-between backdrop-blur-lg bg-bgBlack/80">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-full hover:bg-[#181818] p-2 flex items-center justify-center -ml-2"
          >
            <Image src="/icons/back.svg" alt="" width={20} height={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl pb-0 mb-0">Post</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="border-[1px] border-gray-500 py-1 px-4 rounded-full text-sm"
          >
            Reply
          </Link>
        </div>
      </div>

      {/* post */}
      <Post type="status" post={post} />
      <Comments
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
        authUserImg={authUser?.img as string}
      />
    </>
  );
}
