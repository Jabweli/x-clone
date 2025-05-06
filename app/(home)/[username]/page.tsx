import Feed from "@/components/Feed";
import prisma from "@/lib/prisma";
import NotFoundUser from "@/components/NotFoundUser";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    return <NotFoundUser username={username} />;
  }

  return (
    <>
      <Feed userProfileId={user.id} />
    </>
  );
}
