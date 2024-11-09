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

  const goToKeyboxPage = () => {
    router.push("/demo/keybox");
  };

  return (
    <div className="flex w-full min-h-full mb-[125px] justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-60px]">
        <div className="flex flex-col items-center w-full max-w-md space-y-2 px-6">
          <div className="space-y-6 w-full">
            <div className="text-center text-xl">
              <p>congrats!</p>
              <p>you’ve unlocked a key!</p>
            </div>

            <div className="text-center text-xl">
              <p>your community is waiting</p>
              <p>—explore your digital</p>
              <p>wardrobe, show off your</p>
              <p>affiliations & find new</p>
              <p>friends along the way!</p>
            </div>

            <button
              className="border border-[#9b94b3] w-full py-1 px-6 rounded-2xl text-gray-500 text-xl"
              onClick={goToKeyboxPage}
            >
              see my keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
