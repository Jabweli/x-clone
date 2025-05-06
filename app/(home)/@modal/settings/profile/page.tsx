import EditProfileModal from "@/components/EditProfileModal";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function page() {
  const { userId } = await auth();

  if (!userId) return;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      displayName: true,
      username:true,
      bio: true,
      location: true,
      website: true,
      job: true,
      img: true,
      cover: true,
    },
  });

  return <EditProfileModal user={user}/>;
}
