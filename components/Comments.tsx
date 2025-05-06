"use client";
import Image from "next/image";
import React, {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import Post from "./Post";
import { Post as PostType } from "@/app/generated/prisma";
import ImageKit from "./ImageKit";
import ImageEditor from "./ImageEditor";
import { addComment } from "@/actions/actions";

type CommentsWithDetails = PostType & {
  user: {
    id:string;
    username: string;
    displayName: string | null;
    img: string | null;
  };
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({
  comments,
  postId,
  username,
  authUserImg,
}: {
  comments: CommentsWithDetails[];
  postId: number;
  username: string;
  authUserImg:string
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    // auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set to scrollHeight
    }
  };

  const handleChangeMedia = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMedia(file);
    }
  };

  const previewURL = media ? URL.createObjectURL(media) : null;

  const [state, formAction, isPending] = useActionState(addComment, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) {
      setValue("");
      setMedia(null);
      setSettings({
        type: "original",
        sensitive: false,
      });
    }
  }, [state.success]);

  return (
    <div>
      <form
        action={formAction}
        className="px-4 pb-4 flex gap-2 border-b-[1px] border-borderGray"
      >
        {/* avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <ImageKit
            src={authUserImg || "x-clone/general/default-avatar.jpg"}
            alt="avatar"
            w={100}
            h={100}
          />
        </div>

        {/* text area */}
        <div className="flex-1">
          {value && (
            <p className="text-sm text-textGray mb-2">
              Replying to <span className="text-blue-500">@{username}</span>
            </p>
          )}

          <div className="w-full">
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="username" value={username} />
            <input
              type="hidden"
              name="isSensitive"
              value={settings.sensitive ? "true" : "false"}
            />
            <input
              type="hidden"
              name="imgType"
              value={settings.type}
              readOnly
            />
            <textarea
              ref={textareaRef}
              name="desc"
              value={value}
              onChange={handleChange}
              rows={1}
              className="w-full text-lg resize-none overflow-hidden p-2 rounded-md outline-0"
              placeholder="Post your replay"
            />
          </div>

          <div
            className="relative w-full rounded-xl overflow-hidden mb-3"
            onClick={() => setIsEditorOpen(true)}
          >
            {media?.type.includes("image") && previewURL && (
              <Image
                src={previewURL}
                alt="Preview"
                width={600}
                height={600}
                className={`w-full ${
                  settings.type === "original"
                    ? "h-full object-contain"
                    : settings.type === "square"
                    ? "aspect-square object-cover"
                    : "aspect-video object-cover"
                }`}
              />
            )}
            <div className="absolute top-2 left-2 bg-black/70 py-1 px-4 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50">
              Edit
            </div>
            <div
              className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50"
              onClick={() => setMedia(null)}
            >
              <Image src="/icons/close.svg" alt="" width={16} height={16} />
            </div>
          </div>
          {media?.type.includes("video") && previewURL && (
            <div className="relative">
              <video src={previewURL} controls />
              <div
                className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50"
                onClick={() => setMedia(null)}
              >
                <Image src="/icons/close.svg" alt="" width={16} height={16} />
              </div>
            </div>
          )}
          {isEditorOpen && previewURL && (
            <ImageEditor
              onClose={() => setIsEditorOpen(false)}
              previewURL={previewURL}
              settings={settings}
              setSettings={setSettings}
            />
          )}

          {/* icons */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center w-full xxsm:flex-1">
              <input
                type="file"
                name="file"
                id="file"
                className="hidden"
                onChange={handleChangeMedia}
                accept="image/*, video/*"
              />
              <label htmlFor="file">
                <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                  <Image src="/icons/image.svg" alt="" width={20} height={20} />
                </div>
              </label>
              <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                <Image src="/icons/gif.svg" alt="" width={20} height={20} />
              </div>
              <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                <Image src="/icons/emoji.svg" alt="" width={20} height={20} />
              </div>
              <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                <Image
                  src="/icons/location.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="flex justify-end w-full xxsm:flex-1">
              <button
                type="submit"
                disabled={isPending}
                className="bg-white text-black text-sm py-2 px-4 rounded-full font-bold disabled:bg-white/50 disabled:cursor-not-allowed self-end cursor-pointer"
              >
                {isPending ? "Posting" : "Reply"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <Post type="comment" post={comment} />
        </div>
      ))}
    </div>
  );
};

export default Comments;
