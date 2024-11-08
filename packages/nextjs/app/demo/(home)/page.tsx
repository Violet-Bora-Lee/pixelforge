import React from "react";
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex w-full min-h-full mt-[125px] mb-[125px] justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-120px]">
        <div className="w-4/5 ">
          <div className="w-full rounded-2xl flex justify-center items-center p-4 aspect-h-1">
            <Image
              width={250}
              height={250}
              src="/demo/gold-key.png"
              alt="Square"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <button className="border-2 border-[#9b94b3] w-4/5 px-4 py-2 text-[#9b94b3] text-lg font-semibold rounded-2xl">
          unlock a key!
        </button>
      </div>
    </div>
  );
}
