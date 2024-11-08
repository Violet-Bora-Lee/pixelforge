"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const goToAvatarDecoratePage = () => {
    router.push("/demo/avatar-decorate");
  };

  return (
    <div className="flex flex-col w-full min-h-full mb-[125px] justify-center items-center relative">
      <div className="flex flex-col justify-start items-center gap-2 w-full overflow-y-auto mt-[-10px]">
        <div className="relative w-full h-96 p-4">
          <div className="flex justify-between items-center h-full">
            <div className="relative w-full max-w-2xl mx-auto h-full">
              {/* Empty Cabinet Background */}
              <img
                src="/demo/opened-closet.png"
                alt="Cabinet"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Items Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <img
                  src="/demo/bayc-hat.png" // BAYC hat
                  alt="BAYC Cap"
                  className="w-20 h-auto"
                />
                <img
                  src="/demo/bayc-t-shirt.png" // BAYC t-shirt
                  alt="BAYC T-shirt"
                  className="w-40 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
