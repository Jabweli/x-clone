import { menuList } from "@/constants/menuList";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImageKit from "./ImageKit";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import UserInfo from "./UserInfo";

const LeftBar = async () => {
  const {userId} = await auth();

  // if(!userId) return;

  const user = await prisma.user.findUnique({where: {id: userId as string}})

  return (
    <div className="h-screen xxl:w-[270px] sticky top-0 flex flex-col justify-between pt-1 pb-3 px-2 overflow-hiddenddd">
      {/* LOGO */}
      <div className="flex flex-col gap-1 items-center xxl:items-start text-[18px]">
        <Link href="/" className="p-3 rounded-full hover:bg-[#181818]">
          <Image src="/icons/logo.svg" alt="logo" width={24} height={24} />
        </Link>

        {/* MENU LIST */}
        <div className="flex flex-col">
          {menuList.map((item) => (
            <Link
              href={item.title === "Profile" ? `/${user?.username}` : item.link}
              key={item.id}
              className="p-3 flex rounded-full hover:bg-[#181818] items-center gap-4"
            >
              <ImageKit
                src={`x-clone/icons/${item.icon}`}
                alt={item.title}
                w={25}
                h={25}
              />
              <span className="hidden xxl:inline">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center xxl:hidden"
        >
          <Image src="/icons/post.svg" alt="post" width={24} height={24} />
        </Link>
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full font-bold py-3 px-24 hidden xxl:block"
        >
          Post
        </Link>
      </div>

      {/* USER */}
      {
        user && <UserInfo username={user.username} displayName={user.displayName} img={user.img}/>
      }
      
    </div>
  );
};

export default LeftBar;
