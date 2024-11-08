"use client";

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dragRef = useRef(null);
  const dropZoneRef = useRef(null);

  const checkCollision = (dragElement, dropElement) => {
    if (!dragElement || !dropElement) return false;
    const drag = dragElement.getBoundingClientRect();
    const drop = dropElement.getBoundingClientRect();

    return !(
      drag.right < drop.left ||
      drag.left > drop.right ||
      drag.bottom < drop.top ||
      drag.top > drop.bottom
    );
  };

  const handleDrag = () => {
    setIsDragging(true);
    const isColliding = checkCollision(dragRef.current, dropZoneRef.current);
    setIsOverDropZone(isColliding);
  };

  const handleStop = () => {
    setIsDragging(false);
    if (isOverDropZone) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      router.push("/demo/opened-closet"); // Replace with your target page path
    }
  }, [showSuccess, router]);

  return (
    <div className="flex flex-col w-full min-h-full mb-[125px] justify-center items-center relative">
      <div className="flex flex-col justify-start items-center gap-2 w-full overflow-y-auto">
        <div className="relative w-full h-96 px-6">
          <div className="flex justify-between items-center h-full">
            <Draggable onDrag={handleDrag} onStop={handleStop}>
              <div
                ref={dragRef}
                className={`cursor-move ${isDragging ? "opacity-75" : "opacity-100"}`}
              >
                <img
                  src="/demo/keys/bayc-horizontal.png"
                  alt="Draggable Item"
                  className="w-[130px] object-cover rounded-lg z-10"
                />
              </div>
            </Draggable>

            <div
              ref={dropZoneRef}
              className={`w-2/5 h-fit flex items-center justify-center 
            ${isOverDropZone ? "transform scale-x-105" : "transform scale-100"}`}
            >
              <img
                src="/demo/closet.png"
                alt="Draggable Item"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
