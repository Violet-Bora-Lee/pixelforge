"use client";

import React from "react";
import Image from "next/image";

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const goToKeyMintedPage = () => {
    router.push('/demo/minted-key');
  };

  return (
    <div 
    className="flex w-full min-h-full mb-[125px] justify-center items-center"
    onClick={goToKeyMintedPage}
    >
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-60px]">
        <div className="flex flex-col items-center w-full max-w-md space-y-6 px-6">
          <div className="text-center text-xl">
            <p className="flex flew-col w-full space-x-2">
              <span>nearly there</span>
              <Image
                width={32}
                height={32}
                className="object-contain"
                src="/demo/loading-dots.gif"
                alt="loading dots"
              />
            </p>
          </div>
          <div className="text-center text-xl">
            <p>check your email &</p>
            <p>click on the magic link</p>
            <p>to create your NFT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
