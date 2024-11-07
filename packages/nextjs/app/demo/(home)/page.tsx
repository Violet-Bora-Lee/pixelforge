import React from "react";


export default function Page() {
  return (
    <div className="flex w-full min-h-full mt-[125px] mb-[125px] justify-center items-center bg-[#e6e6e6]">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-120px]">
        <div className="w-4/5 ">
          <div className="w-full rounded-2xl bg-[#fafafa] flex justify-center items-center p-4 aspect-h-1">
            <img
              src="/gold-key.png"
              alt="Square"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <button className="w-4/5 px-4 py-2 bg-white text-yellow-400 text-lg rounded-2xl">
          redeem key
        </button>
      </div>
    </div>
  );
}
