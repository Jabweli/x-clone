import Image from "next/image";
import React from "react";

const Search = () => {
  return (
    <div className="sticky top-0 bg-bgBlack py-2 z-10">
      <div className="flex gap-2 border border-borderGray px-4 py-2 rounded-full">
        <Image src="/icons/explore.svg" alt="" width={16} height={16} className="w-auto h-auto"/>
        <input
          type="text"
          placeholder="Search"
          className="placeholder:text-textLight"
        />
      </div>
    </div>
  );
};

export default Search;
