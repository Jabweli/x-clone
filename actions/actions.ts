"use server";

import prisma from "@/lib/prisma";
import { imagekit } from "@/utils/utils";
import { auth } from "@clerk/nextjs/server";
import { UploadResponse } from "@imagekit/next";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// follow user action
export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({ where: { id: existingFollow.id } });
  } else {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
  }
};

// like or unlike post action
export const likePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }
};

// repost or un-repost post action
export const rePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const user = await prisma.user.findUnique({where: {id: userId}});

  const existingRepost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  });

  if (existingRepost) {
    await prisma.post.delete({ where: { id: existingRepost.id } });
    revalidatePath(`/${user?.username}`)
    revalidatePath("/")
  } else {
    await prisma.post.create({
      data: {
        userId: userId,
        rePostId: postId,
      },
    });
  }
};

// save or unsave post action
export const savePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    await prisma.savedPosts.delete({ where: { id: existingSavedPost.id } });
  } else {
    await prisma.savedPosts.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }
  revalidatePath("/bookmarks");
};

const uploadFile = async (
  file: File,
  uploadType: "post" | "profile",
  transformation?: string,
): Promise<UploadResponse> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: buffer, // required
        fileName: file.name, // required
        folder: uploadType === "post" ? "/x-clone/posts" : "/x-clone/users",
        ...(file.type.includes("image") && {
          transformation: {
            pre: transformation,
          },
        }),
      },
      function (error, result) {
        if (error) reject(error);
        else resolve(result as UploadResponse);
      }
    );
  });
};

// add post action
export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const file = formData.get("file") as File;
  const desc = formData.get("desc") as string;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType") as string;

  if ((!file || file.size === 0) && (!desc || desc.trim() === "")) {
    return { success: false, error: true };
  }

  const Post = z.object({
    desc: z.string().optional(),
    isSensitive: z.boolean().optional(),
  });

  const validateFields = Post.safeParse({
    desc: desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validateFields.success) {
    return { success: false, error: true };
  }

  let img = "";
  let imgFileId = "";
  let imgHeight = 0;
  let imgWidth = 0;
  let video = "";
  let videoFileId = "";
  let fileType = "";

  const transformation = `w-600,${
    imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
  }`;


  if (file.size) {
    const result: UploadResponse = await uploadFile(file, "post", transformation);

    if (result.fileType === "image") {
      img = result.filePath as string;
      imgFileId = result.fileId as string;
      imgHeight = result.height as number;
      imgWidth = result.width as number;
    } else {
      video = result.filePath as string;
      videoFileId = result.fileId as string;
    }

    fileType = result.fileType as string;
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        ...validateFields.data,
        userId,
        img,
        imgFileId,
        imgHeight,
        imgWidth,
        video,
        videoFileId,
        fileType,
      },
    });


    // 🟡 Extract hashtags
    const hashtags = (desc?.match(/#[\w]+/g) || []).map((tag) =>
      tag.toLowerCase().replace("#", "")
    );

    // 🟡 Upsert hashtags and create links
    for (const tag of hashtags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { tag },
        update: {},
        create: { tag },
      });

      await prisma.postHashtag.create({
        data: {
          postId: newPost.id,
          hashtagId: hashtag.id,
        },
      });
    }

    revalidatePath("/");

    return { success: true, error: false };
  } catch (_error) {
    return { success: false, error: true };
  }
};

// add comment action
export const addComment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const file = formData.get("file") as File;
  const desc = formData.get("desc") as string;
  const postId = formData.get("postId");
  const username = formData.get("username");
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType") as string;

  if ((!file || file.size === 0) && (!desc || desc.trim() === "")) {
    return { success: false, error: true };
  }

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().optional(),
    isSensitive: z.boolean().optional(),
  });

  const validateFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc: desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validateFields.success) {
    return { ...prevState, error: true };
  }

  let img = "";
  let imgFileId = "";
  let imgHeight = 0;
  let imgWidth = 0;
  let video = "";
  let videoFileId = "";
  let fileType = "";

  const transformation = `w-600,${
    imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
  }`;

  if (file.size) {
    const result: UploadResponse = await uploadFile(file, "post", transformation);

    if (result.fileType === "image") {
      img = result.filePath as string;
      imgFileId = result.fileId as string;
      imgHeight = result.height as number;
      imgWidth = result.width as number;
    } else {
      video = result.filePath as string;
      videoFileId = result.fileId as string;
    }

    fileType = result.fileType as string;
  }

  try {
    await prisma.post.create({
      data: {
        ...validateFields.data,
        userId,
        img,
        imgFileId,
        imgHeight,
        imgWidth,
        video,
        videoFileId,
        fileType,
      },
    });

    revalidatePath(`/${username}/status/${postId}`);

    return { success: true, error: false };
  } catch (_error: any) {
    return { success: false, error: true };
  }
};

type DeletePostResult = {
  success: boolean;
  error: string;
};

// Deleted post
export const deletePost = async (
  prevState: DeletePostResult,
  formData: FormData
): Promise<DeletePostResult> => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated!" };

  const postId = formData.get("postId");
  const username = formData.get("username");

  const post = await prisma.post.findFirst({
    where: { id: Number(postId), userId: userId },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (post.userId !== userId) return { success: false, error: "Forbidden" };

  try {
    const deletedPost = await prisma.post.delete({
      where: { id: Number(postId), userId: userId },
    });

    if (deletedPost && deletedPost.fileType === "image") {
      imagekit.deleteFile(deletedPost.imgFileId as string);
    } else if (deletedPost && deletedPost.fileType === "video") {
      imagekit.deleteFile(deletedPost.videoFileId as string);
    }

    revalidatePath(`/${username}`);
    return { success: true, error: "" };
  } catch (_error) {
    return { success: false, error: "Failed to delete post" };
  }
};


// Edit User Profile
export const editProfile = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const profileId = formData.get("profileId") as string;
  const username = formData.get("username") as string;
  const displayName = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const website = formData.get("website") as string;
  const job = formData.get("job") as string;
  const profileImg = formData.get("profile") as File;
  const cover = formData.get("cover") as File;

  if (userId !== profileId) return { success: false, error: true };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { img: true, cover: true, imgFileId: true, coverFileId: true },
  });
  if (!user) return { success: false, error: true };

  const profileData = z.object({
    bio: z.string().optional(),
    displayName: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    job: z.string().optional(),
  });

  const validateFields = profileData.safeParse({
    bio: bio,
    displayName: displayName,
    location: location,
    website: website,
    job: job,
  });

  if (!validateFields.success) {
    return { success: false, error: true };
  }

  let img = user.img;
  let coverImg = user.cover;
  let imgFileId = user.imgFileId;
  let coverFileId = user.coverFileId;

  if (profileImg.size > 0) {
    // if new image is uploaded, delete old from imagekit
    if (imgFileId) {
      imagekit.deleteFile(imgFileId as string, (error, result) => {
        if (error) console.log(error);
        else console.log(result);
      });
    }

    const transformation = "w-130,h-130";

    const result: UploadResponse = await uploadFile(
      profileImg,
      "profile",
      transformation
    );

    if (result.fileType === "image") {
      img = result.filePath as string;
      imgFileId = result.fileId as string;
    }
  }

  if (cover.size > 0) {
    // if new image is uploaded, delete old from imagekit
    if (coverFileId) {
      imagekit.deleteFile(coverFileId as string, (error, result) => {
        if (error) console.log(error);
        else console.log(result);
      });
    }
    const transformation = "w-600,h-200";

    const result: UploadResponse = await uploadFile(
      cover,
      "profile",
      transformation
    );

    if (result.fileType === "image") {
      coverImg = result.filePath as string;
      coverFileId = result.fileId as string;
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...validateFields.data,
        img: img,
        cover: coverImg,
        imgFileId,
        coverFileId,
      },
    });
    revalidatePath(`/${username}`);
    return { success: true, error: false };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true };
  }
};
