"use client"

import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = () => {
    const { theme } = useTheme()

    if(theme === "dark") {
        return (
            <Image src="/omybott_dark.png" alt="Omybott" className="h-8 w-24" width={250} height={70} />
        );
    }

    return (
        <Image src="/omybott_logo.png" alt="Omybott" className="h-8 w-24" width={250} height={70} />
    );
  };
  
  export default Logo;