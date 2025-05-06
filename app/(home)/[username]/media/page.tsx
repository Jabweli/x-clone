import ImageKit from "@/components/ImageKit";
import VideoWithBadge from "@/components/VideoWithBadge";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function Media({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return;

  const username = (await params).username;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  const userMedia = await prisma.post.findMany({
    where: {
      userId: user?.id,
      parentPost: null,
      OR: [{ img: { not: null } }, { video: { not: null } }],
    },
    select: { img: true, video: true, fileType: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-1">
      {userMedia && userMedia.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {userMedia.map((media, index) => (
            <div key={`${media.fileType}-${index}`} className="aspect-square">
              {media.fileType === "image" ? (
                <ImageKit
                  src={media.img as string}
                  w={200}
                  h={200}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {media.video && (
                    <VideoWithBadge path={media.video as string} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[90%] xsm:w-[70%] xxl:w-[60%] mx-auto mt-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 w-11/12">
            {userId !== user?.id
              ? "Nothing to see here yet"
              : "Lights, camera … attachments!"}
          </h1>
          <p className="text-textGray">
            {userId !== user?.id
              ? "This user has not shared any photos or videos."
              : "When you post photos or videos, they will show up here."}
          </p>
        </div>
      )}
    </div>
  );
}
