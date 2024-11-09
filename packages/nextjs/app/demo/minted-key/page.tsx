"use client";

import React, { useEffect } from "react";
import Image from "next/image";
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

  const goToRedeemedPage = () => {
    router.push("/demo/redeemed-key");
  };

  return (
    <div
      className="flex w-full min-h-full mt-[125px] mb-[125px] justify-center items-center"
      onClick={goToRedeemedPage}
    >
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-120px]">
        <div className="w-4/5 ">
          <div className="w-full rounded-2xl flex justify-center items-center p-4 aspect-h-1">
            <Image
              width={250}
              height={250}
              src="/demo/minted-key-oxford.png"
              alt="Square"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
