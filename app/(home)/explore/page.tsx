import PopularTags from "@/components/PopularTags";
import Recommendations from "@/components/Recommendations";
import React from "react";


export default function Explore() {
  return (
    <div>
      <PopularTags type="main"/>
      <Recommendations type="main"/>
    </div>
  );
}
