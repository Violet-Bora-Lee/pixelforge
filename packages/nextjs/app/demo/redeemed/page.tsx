import React from "react";


export default function Page() {
  return (
    <div className="flex w-full min-h-full mt-[125px] mb-[125px] justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-120px]">
        <div className="w-4/5 ">
          <div className="w-full rounded-2xl flex justify-center items-center p-4 aspect-h-1">
            <img
              src="/redeemed-key.png"
              alt="Square"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
