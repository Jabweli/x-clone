import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
      <div className="px-2dd xsm:px-4dd xxl:px-8dd">
        <LeftBar />
      </div>
      <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray">
        {children}
        {modal}
      </div>
      <div className="hidden lg:flex ml-4 md:ml-8 md:mr-5 flex-1">
        <RightBar />
      </div>
    </div>
  );
}
