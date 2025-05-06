"use client";
import { addPost } from "@/actions/actions";
import Image from "next/image";
import React, {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import ImageEditor from "./ImageEditor";
import ImageKit from "./ImageKit";

const WritePost = ({userImg}:{userImg:string}) => {
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

  const [state, formAction, isPending] = useActionState(addPost, {
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
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // reset height
      }
    }
  }, [state.success]);

  return (
    <form action={formAction}>
      <div
        className="p-4 flex gap-2 border-b-[1px] border-borderGray"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <ImageKit
            src={userImg || "x-clone/general/default-avatar.jpg"}
            alt="avatar"
            w={100}
            h={100}
          />
        </div>

        {/* text area */}
        <div className="flex-1">
          <div className="w-full">
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
            {/* Actual editable div */}
            <textarea
              ref={textareaRef}
              name="desc"
              value={value}
              onChange={handleChange}
              rows={1}
              className="w-full text-xl resize-none overflow-hidden p-2 rounded-md outline-0"
              placeholder="What's happening?"
            />
          </div>

          <div
            className="relative w-full rounded-xl overflow-hidden mb-3"
          >
            {media?.type.includes("image") && previewURL && (
              <Image
                src={previewURL}
                alt="Preview"
                width={600}
                height={600}
                className={`w-full rounded-2xl ${
                  settings.type === "original"
                    ? "h-full object-contain"
                    : settings.type === "square"
                    ? "aspect-square object-cover"
                    : "aspect-video object-cover"
                }`}
              />
            )}
            <div className="absolute top-2 left-2 bg-black/70 py-1 px-4 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50" onClick={() => setIsEditorOpen(true)}>
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
            <div className="relative w-full">
              <video src={previewURL} controls className="w-full h-full rounded-2xl"/>
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

          <div className="flex items-center justify-between gap-4 flex-wrap pt-3">
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
                <Image src="/icons/poll.svg" alt="" width={20} height={20} />
              </div>
              <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                <Image src="/icons/emoji.svg" alt="" width={20} height={20} />
              </div>
              <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
                <Image
                  src="/icons/schedule.svg"
                  alt=""
                  width={20}
                  height={20}
                />
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
                // disabled={text == "" || media == null}
                className="bg-white text-black text-sm py-2 px-4 rounded-full font-bold disabled:bg-white/50 disabled:cursor-not-allowed self-end cursor-pointer"
              >
                {isPending ? "Posting" : "Post"}
              </button>
            </div>
          </div>
          {state.error && (
            <span className="text-xs text-red-500">Something went wrong</span>
          )}
        </div>
      </div>
    </form>
  );
};

export default WritePost;
