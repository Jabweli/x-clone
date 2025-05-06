import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center my-3">
      <div className="w-[20px] h-[20px] border-3 border-iconBlue border-t-iconBlue/10 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
