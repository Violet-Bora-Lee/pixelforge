"use client";

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <div className="flex flex-col w-full min-h-full mt-[125px] mb-[125px] justify-center items-center relative">
      <div className="flex flex-col justify-start items-center gap-2 w-full overflow-y-auto mt-[-10px]">
        <div className="relative w-full h-96 p-4">
          <div className="flex justify-between items-center h-full">
            opened closet
          </div>
        </div>
      </div>
    </div>
  );
}
