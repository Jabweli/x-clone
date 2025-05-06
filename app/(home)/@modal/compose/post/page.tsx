"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import ImageEditor from "@/components/ImageEditor";
import { addPost } from "@/actions/actions";

const PostModal = () => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        router.back();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [router]);

  const handleChangeMedia = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    // auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set to scrollHeight
    }
  };

  const previewImageURL = file ? URL.createObjectURL(file) : null;

  const [state, formAction, isPending] = useActionState(addPost, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) {
      setValue("");
      setFile(null);
      setSettings({
        type: "original",
        sensitive: false,
      });
      router.back();
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="fixed w-screen h-screen top-0 left-0 z-20 bg-[#8bbef121] flex justify-center"
    >
      <div
        ref={modalRef}
        className={`relative py-3 px-3 md:rounded-2xl bg-black w-full h-full md:w-[600px] md:mt-12 overflow-hidden ${previewImageURL ? "md:max-h-[520px]" : "md:h-max"}`}
      >
        {/* top */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer rounded-full hover:bg-[#181818] p-2 -ml-2"
          >
            <Image src="/icons/close.svg" alt="" width={20} height={20} />
          </button>
          <Link
            href=""
            className="text-blue-500 text-[15px] font-semibold cursor-pointer"
          >
            Drafts
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex gap-2 mt-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/general/avatar.png"
                alt="avatar"
                width={100}
                height={100}
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

              {file?.type.includes("image") && previewImageURL && (
                <div className="relative w-full rounded-xldd  max-h-[355px]">
                  <Image
                    src={previewImageURL}
                    alt="Preview"
                    width={600}
                    height={600}
                    className={`w-full rounded-xl mb-6 ${
                      settings.type === "original"
                        ? "h-full object-contain"
                        : settings.type === "square"
                        ? "aspect-square object-cover"
                        : "aspect-video object-cover"
                    }`}
                  />
                  <div
                    className="absolute top-2 left-2 bg-black/70 py-1 px-4 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50"
                    onClick={() => setIsEditorOpen(true)}
                  >
                    Edit
                  </div>
                  <div
                    className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50"
                    onClick={() => setFile(null)}
                  >
                    <Image
                      src="/icons/close.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              )}

              {file?.type.includes("video") && previewImageURL && (
                <div className="relative">
                  <video src={previewImageURL} controls />
                  <div
                    className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-black/50"
                    onClick={() => setFile(null)}
                  >
                    <Image
                      src="/icons/close.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              )}
              {isEditorOpen && previewImageURL && (
                <ImageEditor
                  onClose={() => setIsEditorOpen(false)}
                  previewURL={previewImageURL}
                  settings={settings}
                  setSettings={setSettings}
                />
              )}
            </div>
          </div>
        </div>

        {/* icons */}
        <div className="absolutedd bottom-0dd left-0dd w-full flex items-center justify-between gap-4 flex-wrap border-t-[1px] border-borderGray py-2dd px-4dd z-50 bg-bgBlackdd pt-2 mt-1">
          <div className="flex items-center gap-4dd w-full xxsm:flex-1">
            <input
              type="file"
              name="file"
              id="modalImageInput"
              className="hidden"
              onChange={handleChangeMedia}
              accept="image/*, video/*"
            />
            <label htmlFor="modalImageInput">
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
              <Image src="/icons/schedule.svg" alt="" width={20} height={20} />
            </div>
            <div className="hover:bg-iconBlue/10 p-2 rounded-full cursor-pointer">
              <Image src="/icons/location.svg" alt="" width={20} height={20} />
            </div>
          </div>
          <div className="flex justify-end w-full xxsm:flex-1">
            <button
              type="submit"
              className="bg-white text-black text-sm py-2 px-6 rounded-full font-bold disabled:bg-white/50 self-end cursor-pointer"
            >
              {isPending ? "Posting" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostModal;
