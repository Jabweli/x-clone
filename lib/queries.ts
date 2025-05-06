import prisma from "./prisma";

export const postInclude = (userId: string) => ({
  user: {
    select: { id: true, username: true, displayName: true, img: true },
  },
  _count: { select: { likes: true, rePosts: true, comments: true } },
  likes: { where: { userId }, select: { id: true } },
  rePosts: { where: { userId }, select: { id: true } },
  saves: { where: { userId }, select: { id: true } },
});

export const fetchPostsQuery = async (
  userId: string,
  userProfileId: string
) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  // Get users followed by *my followers*
  const extendedFollowing = await prisma.follow.findMany({
    where: {
      followerId: { in: followingIds },
    },
    select: { followingId: true },
  });

  const extendedFollowingIds = extendedFollowing.map((f) => f.followingId);

  const userAndNetworkIds = Array.from(
    new Set([userId, ...followingIds, ...extendedFollowingIds])
  );

  const whereCondition = userProfileId
    ? { parentPostId: null, userId: userProfileId }
    : {
        parentPostId: null,
        userId: { in: userAndNetworkIds },
      };

  let posts;

  if (userAndNetworkIds.length <= 1) {
    posts = await prisma.post.findMany({
      where: { parentPostId: null },
      orderBy: { createdAt: "desc" },
      include: {
        rePost: {
          include: postInclude(userId),
        },
        ...postInclude(userId),
      },
      take: 10,
      skip: 0,
    });
  } else {
    posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        rePost: {
          include: postInclude(userId),
        },
        ...postInclude(userId),
      },
      take: 10,
      skip: 0,
    });
  }

  return posts;
};
