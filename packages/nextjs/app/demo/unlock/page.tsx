"use client";

import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex w-full min-h-full mb-[125px] justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-60px]">
        <div className="flex flex-col items-center w-full max-w-md space-y-2 px-6">
          <div className="space-y-2 w-full">
            <div className="text-center">
              <h1 >Ready to unlock your key?</h1>
              <p>Show us your NFT treasure!</p>
            </div>

            <button className="border-2 border-[#9b94b3] w-full py-1 px-6 rounded-2xl text-gray-500 text-xl">
              unlock by nft
            </button>
          </div>

          <div className="space-y-3 w-full">
            <div className="text-center mt-8">
              <p className="text-l">No NFT? No problem!</p>
              <p className="text-l">We have a magic link to create it!</p>
            </div>

            <div className="w-full space-y-4">
              <p className="text-xl text-center font-semibold">enter email</p>
              <input
                type="email"
                className="w-full py-1 px-6 rounded-2xl border border-gray-200"
                placeholder=""
              />
              <button className="border-2 border-[#9b94b3] w-full py-1 px-6  rounded-2xl text-gray-500 text-xl">
                send magic link!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
