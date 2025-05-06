import Image from "next/image";
import React from "react";
import { FaCropSimple } from "react-icons/fa6";
import { RiFlag2Line } from "react-icons/ri";

interface ImageEditorProps {
  onClose: () => void;
  previewURL: string | null;
  settings: {
    type: "original" | "wide" | "square";
    sensitive: boolean;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      type: "original" | "wide" | "square";
      sensitive: boolean;
    }>
  >;
}

const ImageEditor = ({
  onClose,
  previewURL,
  settings,
  setSettings,
}: ImageEditorProps) => {
  const handleChangeType = (type: "original" | "wide" | "square") => {
    setSettings((prev) => ({
      ...prev,
      type,
    }));
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-20 bg-[#8bbef121] flex justify-center">
      <div className="rounded-2xl bg-black w-[600px] h-max mt-6 overflow-hidden z-[9999]">
        {/* header */}
        <div className="flex items-center justify-between py-2 px-4 ">
          <div className="flex items-center gap-8">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full hover:bg-[#181818] p-2 -ml-2"
            >
              <Image src="/icons/back.svg" alt="" width={20} height={20} />
            </button>
            <h1 className="text-xl font-semibold">Crop media</h1>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="bg-white text-black text-[15px] font-semibold px-4 py-1 rounded-full cursor-pointer hover:bg-gray-200"
          >
            Save
          </button>
        </div>

        {/* toggle buttons */}
        <div className="font-bold flex justify-between text-white text-sm border-b-[1px] border-borderGray z-10 backdrop-blur-lg bg-bgBlack/80">
          <div className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer">
            <span className="pb-4 border-b-2 border-iconBlue">
              <FaCropSimple color="#ffffff" size={16} />
            </span>
          </div>

          <div className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer text-textGray">
            <span className="pb-4">ALT</span>
          </div>
          <div className="pt-4 flex items-center justify-center flex-1 hover:bg-[#181818] cursor-pointer text-textGray">
            <span className="pb-4">
              <RiFlag2Line size={16} />
            </span>
          </div>
        </div>

        {/* Image Preview */}
        <div className="w-[600px] h-[370px] py-4 px-4 bg-[#181818] flex items-center justify-center">
          {previewURL && (
            <div
              className={`relative ${
                settings.type === "square"
                  ? "w-[300px] aspect-square" // fixed square size
                  : "w-full h-full"
              }`}
            >
              <Image
                src={previewURL}
                alt="Preview"
                fill
                className={`w-full ${
                  settings.type === "original"
                    ? "h-full object-contain"
                    : settings.type === "square"
                    ? "aspect-square object-cover"
                    : "aspect-video object-cover"
                }`}
              />
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center justify-between gap-8">
            <div
              className="rounded-full p-2 hover:bg-iconBlue/10 cursor-pointer"
              onClick={() => handleChangeType("original")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "original"
                      ? "fill-iconBlue"
                      : "fill-[#e7e9ea]"
                  }`}
                  d="M3 7.5C3 6.119 4.119 5 5.5 5h13C19.881 5 21 6.119 21 7.5v9c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 19 3 17.881 3 16.5v-9zM5.5 7c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
            </div>
            <div
              className="rounded-full p-2 hover:bg-iconBlue/10 cursor-pointer"
              onClick={() => handleChangeType("wide")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "wide"
                      ? "fill-iconBlue"
                      : "fill-[#e7e9ea]"
                  }`}
                  d="M3 9.5C3 8.119 4.119 7 5.5 7h13C19.881 7 21 8.119 21 9.5v5c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 17 3 15.881 3 14.5v-5zM5.5 9c-.276 0-.5.224-.5.5v5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-5c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
            </div>
            <div
              className="rounded-full p-2 hover:bg-iconBlue/10 cursor-pointer"
              onClick={() => handleChangeType("square")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "square"
                      ? "fill-iconBlue"
                      : "fill-[#e7e9ea]"
                  }`}
                  d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
            </div>
          </div>
          <div className="cursor-pointer">
            <input
              id="sensitive"
              type="checkbox"
              checked={settings.sensitive}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  sensitive: e.target.checked,
                }))
              }
            />{" "}
            <label htmlFor="sensitive" className="text-sm text-textLight">
              Sensitive
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
