"use client"
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";

export default function Articles() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const params = useParams();
  const pageUsername = params.username as string;

  useEffect(() => {
    if (isLoaded && user?.username !== pageUsername) {
      router.replace(`/${pageUsername}`);
    }
  }, [isLoaded, user, pageUsername, router]);

  if (!isLoaded || user?.username !== pageUsername) return null;

  return (
    <div className="p-4">
      <div className="w-[90%] xsm:w-[70%] xxl:w-[60%] mx-auto mt-4">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Write Articles on X</h1>
        <p className="text-textGray">You must be subscribed to Premium+ to write Articles on X</p>
        <button className="bg-white text-black mt-6 py-3 lg:py-4 px-8 rounded-full font-bold">Upgrade to Premium+</button>
      </div>
    </div>
  );
}
