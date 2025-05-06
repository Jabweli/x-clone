import Search from "./Search";
import PopularTags from "./PopularTags";
import Recommendations from "./Recommendations";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const RightBar = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  return (
    <div className="">
      <Search />
      <div className="sticky -top-[90%] h-max mb-[60px]">
        <PopularTags type="rightbar"/>

        {followingIds && followingIds.length > 0 ? <Recommendations type="sidebar"/>: "" }
        
        <div className="flex gap-x-3 gap-y-1 flex-wrap text-sm text-textGray mt-3">
          <Link href="" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="" className="hover:underline">
            Cookie Policy
          </Link>
          <Link href="" className="hover:underline">
            Accessibility
          </Link>
          <Link href="" className="hover:underline">
            Ads info
          </Link>
          <Link href="" className="flex gap-1 hover:underline">
            More{" "}
            <Image src="/icons/infoMore.svg" alt="" width={16} height={16} className="w-auto h-auto"/>
          </Link>
          <span>&copy; {new Date().getFullYear()} X corp.</span>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
