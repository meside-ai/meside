import Image from "next/image";
import logo from "./meside_logo.png";

export const IconLogo = ({ width = 24 }: { width?: number }) => {
  return (
    <Image
      src={logo}
      alt="meside"
      width={width}
      height={width}
      style={{
        display: "block",
        borderRadius: 8,
      }}
    />
  );
};
