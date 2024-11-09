"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

export default function Page() {
  useAutoConnect();

  const { address, status } = useAccount();

  useEffect(() => {
    console.log("connected address: ", address);
    console.log("status: ", status);
  }, [address]);

  const router = useRouter();

  const goToAvatarDecoratePage = () => {
    router.push("/demo/avatar-decorate");
  };

  return (
    <div
      className="flex flex-col w-full min-h-full mb-[125px] justify-center items-center relative"
      onClick={goToAvatarDecoratePage}
    >
      <div className="flex flex-col justify-start items-center gap-2 w-full overflow-y-auto mt-[-10px]">
        <div className="relative w-full h-96 p-4">
          <div className="flex justify-between items-center h-full">
            <div className="relative w-full max-w-2xl mx-auto h-full animate-fadeIn">
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
