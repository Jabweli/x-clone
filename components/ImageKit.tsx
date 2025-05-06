import { Image } from "@imagekit/next";

interface ImageKitProps {
  src: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
}

const ImageKit = ({ src, w, h, alt, className, tr }: ImageKitProps) => {
  return (
    <Image
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT} // New prop
      src={src}
      width={w}
      height={h}
      {...(tr && { transformation: [{ width: w, height: h }] })} // New prop
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default ImageKit;
