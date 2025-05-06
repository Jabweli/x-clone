"use client";

import { editProfile } from "@/actions/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";
import { TbCameraPlus } from "react-icons/tb";
import ImageKit from "./ImageKit";

type ProfileProps = {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  job: string | null;
  img: string | null;
  cover: string | null;
} | null;

export default function EditProfileModal({ user }: { user: ProfileProps }) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [job, setJob] = useState("");

  useEffect(() => {
    setName(user?.displayName as string);
    setBio(user?.bio as string);
    setLocation(user?.location as string);
    setWebsite(user?.website as string);
    setJob(user?.job as string);
  }, []);

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

  const handleChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setProfileImage(image);
    }
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const cover = e.target.files[0];
      setCover(cover);
    }
  };

  const previewImageURL = profileImage
    ? URL.createObjectURL(profileImage)
    : null;
  const previewCoverURL = cover ? URL.createObjectURL(cover) : null;

  const [state, formAction, isPending] = useActionState(editProfile, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if(state.success){
        router.back();
    }

    if(state.error){
        alert("Error updating profile");
    }
  }, [state.success])

  return (
    <form
      action={formAction}
      className="fixed w-screen h-screen top-0 left-0 z-20 bg-[#8bbef121] flex justify-center"
    >
      <div
        ref={modalRef}
        className="relative md:rounded-2xl bg-black w-full h-full md:w-[600px] md:mt-12 overflow-hidden md:max-h-[520px] backdrop-blur-lg"
      >
        <div className="overflow-y-auto h-full custom-scroll pb-6">
          {/* top */}
          <div className="sticky flex items-center justify-between w-full top-0 left-0 p-2 z-50 bg-black">
            <div className="flex items-center gap-6">
              <div
                className="w-10 h-10 hover:bg-[#181818] p-2 rounded-full flex items-center justify-center"
                onClick={() => router.back()}
              >
                <IoClose size={22} />
              </div>
              <h1 className="text-xl font-bold">Edit profile</h1>
            </div>
            <button
              type="submit"
              className="bg-white py-1 px-5 rounded-full text-bgBlack text-[15px] font-semibold cursor-pointer text-sm"
            >
              {isPending ? "Saving":"Save"}
            </button>
          </div>

          {/* body */}
          <div className="mt-1">
            {/* COVER & PROFILE IMAGE */}
            <div className="relative w-full h-50">
              {previewCoverURL ? (
                <Image
                  src={previewCoverURL}
                  alt="avatar"
                  width={600}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ): user?.cover && (
                <ImageKit
                  src={user?.cover}
                  w={600}
                  h={200}
                  alt={`${user?.displayName} cover`}
                  className="w-full h-full object-cover"
                />
              )}


              <input
                type="file"
                name="cover"
                id="cover"
                className="hidden"
                onChange={handleCoverChange}
              />
              <div className="flex items-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <label htmlFor="cover">
                  <div className="w-10 h-10 rounded-full p-2 bg-[#181818]/40  hover:bg-[#181818]/50 flex items-center justify-center  cursor-pointer">
                    <TbCameraPlus size={23} className="text-textLight" />
                  </div>
                </label>
                {previewCoverURL && (
                  <div
                    className="w-10 h-10 rounded-full p-2 bg-[#181818]/40  hover:bg-[#181818]/50 flex items-center justify-center z-20 cursor-pointer"
                    onClick={() => setCover(null)}
                  >
                    <IoClose size={23} className="text-white/90" />
                  </div>
                )}
              </div>

              <div className="absolute w-[112px] h-[112px] bg-[#181818] rounded-full -bottom-12 left-5 border-3 border-bgBlack overflow-hidden">
                <div className="w-full h-full relative">
                  {previewImageURL ? (
                    <Image
                      src={previewImageURL}
                      alt="avatar"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ): user?.img && (
                    <ImageKit
                      src={user?.img}
                      w={600}
                      h={200}
                      alt={`${user?.displayName} cover`}
                    />
                  )}
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="hidden"
                    onChange={handleChangeProfile}
                  />
                  <label htmlFor="profile">
                    <div className="w-10 h-10 rounded-full p-2 bg-[#181818]/40 flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer">
                      <TbCameraPlus size={19} className="text-textLight" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* INPUTS */}
            <div className="flex flex-col gap-6 mt-16 px-5">
              <input type="text" name="profileId" value={user?.id} className="hidden" readOnly/>
              <input type="text" name="username" value={user?.username} className="hidden" readOnly/>
              <div className="border-[1px] border-borderGray rounded-sm p-2 pt-1">
                <label htmlFor="name" className="text-textGray text-sm">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full pb-1 outline-0 border-0"
                  defaultValue={name}
                />
              </div>

              <div className="border-[1px] border-borderGray rounded-sm p-2 pt-1">
                <label htmlFor="bio" className="text-textGray text-sm">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  defaultValue={bio}
                  className="w-full pb-1 outline-0 border-0 resize-none"
                />
              </div>

              <div className="border-[1px] border-borderGray rounded-sm p-2 pt-1">
                <label htmlFor="location" className="text-textGray text-sm">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  defaultValue={location}
                  className="w-full pb-1 outline-0 border-0"
                />
              </div>

              <div className="border-[1px] border-borderGray rounded-sm p-2 pt-1">
                <label htmlFor="website" className="text-textGray text-sm">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  id="website"
                  defaultValue={website}
                  className="w-full pb-1 outline-0 border-0"
                />
              </div>

              <div className="border-[1px] border-borderGray rounded-sm p-2 pt-1">
                <label htmlFor="job" className="text-textGray text-sm">
                  Job
                </label>
                <input
                  type="text"
                  name="job"
                  id="job"
                  defaultValue={job}
                  className="w-full pb-1 outline-0 border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
