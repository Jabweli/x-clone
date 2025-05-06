"use client";
import { FaEllipsis } from "react-icons/fa6";
import Image from "next/image";


export default function Notifications() {
  return (
    <div>
      <div className="flex items-start gap-4 py-4 px-4 border-b-[1px] border-borderGray hover:bg-[#191919]/40 cursor-pointer">
        <div className="w-[30px]">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                d="M22.99 11.295l-6.986-2.13-.877-.326-.325-.88L12.67.975c-.092-.303-.372-.51-.688-.51-.316 0-.596.207-.688.51l-2.392 7.84-1.774.657-6.148 1.82c-.306.092-.515.372-.515.69 0 .32.21.6.515.69l7.956 2.358 2.356 7.956c.09.306.37.515.69.515.32 0 .6-.21.69-.514l1.822-6.15.656-1.773 7.84-2.392c.303-.09.51-.37.51-.687 0-.316-.207-.596-.51-.688z"
                fill="#794BC4"
              ></path>
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between w-full">
            <Image
              src="/general/avatar.png"
              width={35}
              height={35}
              alt="avatar"
              className="rounded-md"
            />
            <div>
              <FaEllipsis />
            </div>
          </div>

          <div className="flex flex-col gap-4 text-textGray text-[15px] pt-3">
            <h1 className="text-white">
              Recent post from <span className="font-bold">MTN Uganda</span>
            </h1>
            <p>
              Own the Samsung S25 Ultra without breaking the bank, pay Mpola
              Mpola from just UGX 789,000 a month.
            </p>
            <p>
              You also get: <br /> 5GB FREE data <br /> MTN minutes +
              all-network minutes <br /> FREE SMS
            </p>
            <p>
              Now available at select MTN Shops. #MTNDevices
              pic.x.com/Rrl1gKD7JY
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-4 py-4 px-4 border-b-[1px] border-borderGray hover:bg-[#191919]/40 cursor-pointer">
        <div className="w-[30px]">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g>
              <path
                d="M22.99 11.295l-6.986-2.13-.877-.326-.325-.88L12.67.975c-.092-.303-.372-.51-.688-.51-.316 0-.596.207-.688.51l-2.392 7.84-1.774.657-6.148 1.82c-.306.092-.515.372-.515.69 0 .32.21.6.515.69l7.956 2.358 2.356 7.956c.09.306.37.515.69.515.32 0 .6-.21.69-.514l1.822-6.15.656-1.773 7.84-2.392c.303-.09.51-.37.51-.687 0-.316-.207-.596-.51-.688z"
                fill="#794BC4"
              ></path>
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between w-full">
            <Image
              src="/general/avatar.png"
              width={35}
              height={35}
              alt="avatar"
              className="rounded-md"
            />
            <div>
              <FaEllipsis />
            </div>
          </div>

          <div className="flex flex-col gap-4 text-textGray text-[15px] pt-3">
            <h1 className="text-white">
              Recent post from{" "}
              <span className="font-bold">Yoweri K Museveni</span>
            </h1>
            <p>
              I had the pleasure of welcoming Mr. Massad Boulos, Senior Advisor
              to President Donald Trump, along with his delegation. We discussed
              the security situation in the region, particularly in Eastern
              Congo, as well as opportunities for American businesses to invest
              in Uganda. I extend https://pic.x.com/t6dU6wsc9d
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
