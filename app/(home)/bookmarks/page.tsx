import Post from "@/components/Post";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Bookmarks() {
  const {userId} = await auth();
  if(!userId) return;


  const savedPosts = await prisma.post.findMany({
    where: {
      saves: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id:true, username: true, displayName: true, img: true } },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
    },
  });

  return (
    <>
      <div className="sticky top-0 z-10 px-4 py-2 flex items-center justify-between backdrop-blur-lg bg-bgBlack/80">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-full hover:bg-[#181818] p-2 flex items-center justify-center -ml-2"
          >
            <Image src="/icons/back.svg" alt="" width={20} height={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl pb-0 mb-0">Bookmarks</h1>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 border border-borderGray px-4 py-3 rounded-full">
          <Image src="/icons/explore.svg" alt="" width={16} height={16} />
          <input
            type="text"
            placeholder="Search bookmarks"
            className="placeholder:text-textLight text-sm"
          />
        </div>        
      </div>
      {
        savedPosts && savedPosts.length > 0 ?  (
          savedPosts.map(post => (
            <Post key={post.id} post={post}/>
          ))
        ) : (<div className="mt-6 w-[60%] mx-auto">
          <h1 className="text-xl lg:text-3xl font-bold">Save posts for later</h1>
          <p className="text-textGray mt-2 text-[15">Bookmark posts to easily find them again in the future.</p>
        </div>)
      }
    </>
  );
}
