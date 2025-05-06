import Image from "next/image";
import React from "react";

export default function Mentions() {
  return (
    <div className="border-b-[1px] border-borderGray">
      <div className="w-full h-[175px]">
        <Image
          src="/general/illustration.png"
          alt=""
          width={600}
          height={175}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl text-white font-bold">Control which conversations you&apos;re mentioned in</h1>
        <p className="text-textGray text-[15px]">
        Use the action menu — those three little dots on a post — to untag yourself and leave a conversation. <span className="text-white underline font-bold">Learn more</span>
        </p>
      </div>
    </div>
  );
}
