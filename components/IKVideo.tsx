import { Video } from "@imagekit/next";
import React, { forwardRef } from "react";

interface VideoProps {
  path: string;
  className?: string;
  showControls: boolean;
}

const IKVideo = forwardRef<HTMLVideoElement, VideoProps>(
  ({ path, className, showControls }, ref) => {
    return (
      <Video
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        src={path}
        controls={showControls}
        className={className}
        muted={true}
        autoPlay={true}
        ref={ref}
      />
    );
  }
);

IKVideo.displayName = "IKVideo";

export default IKVideo;

// import { Video } from "@imagekit/next";
// import React from "react";

// interface VideoProps {
//   path: string;
//   className?: string;
//   showControls: boolean
//   videoRef?: React.Ref<HTMLVideoElement>;
// }

// const IKVideo = ({ path, className, showControls, videoRef }: VideoProps) => {
//   return (
//     <Video
//       urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
//       src={path}
//       controls={showControls}
//       className={className}
//       muted={true}
//       ref={videoRef}
//       // transformation={[{ width: 1920, height: 1080, quality: 90 }]}
//     />
//   );
// };

// export default IKVideo;
