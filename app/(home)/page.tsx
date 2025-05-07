"use client";

import Feed from "@/components/Feed";
import Following from "@/components/Following";
import HomePageTabs from "@/components/HomePageTabs";
import WritePost from "@/components/WritePost";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getUser = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/user`)
  return res.json();
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"for"|"following">("for");

  const {data, isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser()
  })


  return (
    <>
      <HomePageTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
      {
        !isLoading && <WritePost userImg={data.user?.img as string}/>
      }
      {
        activeTab === "for" ? <Feed /> : <Following />
      }     
    </>
  );
}
