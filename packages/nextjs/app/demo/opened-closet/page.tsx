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
            <div className="relative w-full max-w-2xl mx-auto h-full">
              {/* Empty Cabinet Background */}
              <img
                src="/demo/opened-closet.png" // 빈 캐비넷 이미지
                alt="Cabinet"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Items Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <img
                  src="/demo/bayc-hat.png" // BAYC 모자 이미지
                  alt="BAYC Cap"
                  className="w-20 h-auto"
                />
                <img
                  src="/demo/bayc-t-shirt.png" // BAYC 티셔츠 이미지
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
