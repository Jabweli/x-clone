import NotFoundUser from "@/components/NotFoundUser";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { BsBalloon } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { RiLink } from "react-icons/ri";
import { GoBriefcase } from "react-icons/go";
import ImageKit from "@/components/ImageKit";
import FollowBtn from "@/components/FollowBtn";
import ProfileTabs from "@/components/ProfileTabs";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId } = await auth();
  if(!userId) return;

  const authUser = await prisma.user.findUnique({where:{id:userId}, select:{username:true}})

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      _count: { select: { followers: true, followings: true, posts: true } },
      followings: userId ? { where: { followerId: userId } } : undefined,
    },
  });

  if (!user) {
    return <NotFoundUser username={username} />;
  }

  return (
    <>
      <div className="sticky top-0 z-10 px-2 py-1 flex gap-8 backdrop-blur-lg bg-bgBlack/80">
        <Link
          href="/"
          className="w-10 h-10 rounded-full hover:bg-[#181818] p-2 flex items-center justify-center"
        >
          <Image src="/icons/back.svg" alt="" width={20} height={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-bold text-xl pb-0 mb-0 capitalize">{user.displayName || user.username}</h1>
          <span className="text-xs text-textGray">
            {user._count.posts} posts
          </span>
        </div>
      </div>

      <div className="relative w-full h-50 bg-[#181818]">
        {/* cover */}
        {user.cover && (
          <ImageKit
            src={user.cover}
            alt=""
            w={600}
            h={200}
            className="w-auto h-full object-cover"
          />
        )}

        {/* avatar */}
        <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-4 border-bgBlack absolute left-4 -bottom-13 bg-[#181818]">
          {user.img && (
            <ImageKit
              src={user.img}
              alt=""
              w={130}
              h={130}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="w-full flex items-center justify-end gap-2 p-2">
        {user.id !== userId ? (
          <>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image src="/icons/more.svg" alt="" width={20} height={20} />
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image src="/icons/explore.svg" alt="" width={20} height={20} />
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image src="/icons/message.svg" alt="" width={20} height={20} />
            </div>
            <FollowBtn userId={user.id} isFollowed={!!user.followings.length} />
          </>
        ) : (
          <Link
            href="/settings/profile"
            className="bg-black border-[1px] border-gray-500 rounded-full py-2 px-4 font-semibold cursor-pointer text-sm"
          >
            Edit profile
          </Link>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 flex flex-col gap-3">
        {/* username & handle */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-textLight capitalize">
            {user.displayName || user.username}
          </h1>
          <span className="text-sm text-textGray">@{user.username}</span>
        </div>

        {user.bio && <p>{user.bio}</p>}

        {/* birthday and date joined */}
        <div className="flex gap-x-3 text-[15px] flex-wrap">
          {user.location && (
            <div className="flex gap-1 items-center">
              <IoLocationOutline size={18} className="text-textGray" />
              <span className="text-textGray">{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex gap-1 items-center">
              <RiLink size={18} className="text-textGray" />
              <a href={user.website} target="_blank" className="text-iconBlue">
                {user.website}
              </a>
            </div>
          )}
          {user.job && (
            <div className="flex gap-1 items-center">
              <GoBriefcase size={17} className="text-textGray" />
              <span className="text-textGray">{user.job}</span>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <BsBalloon size={20} className="text-textGray" />
            <span className="text-textGray">Born December 7, 1994</span>
          </div>
          <div className="flex gap-1 items-center">
            <FaCalendarAlt className="text-textGray" />
            <span className="text-textGray">
              Joined{" "}
              {new Date(user.createdAt.toString()).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* following count */}
        <div className="flex gap-5 text-[15px]">
          <div className="flex gap-1 items-center">
            <span className="font-semibold">{user._count.followings}</span>
            <span className="text-textGray">Following</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-semibold">{user._count.followers}</span>
            <span className="text-textGray">Followers</span>
          </div>
        </div>
      </div>

      <ProfileTabs username={username} authUserName={authUser?.username as string}/>

      {children}
    </>
  );
}
