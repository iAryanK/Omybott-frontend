"use client"

import Image from "next/image";

const Logo = () => {

    return (
        <Image src="/omybott_logo.png" alt="Omybott" className="h-8 w-24 dark:invert" width={250} height={70} />
    );
  };
  
  export default Logo;