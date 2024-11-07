"use client";

import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import Image from "next/image";

export default function Page() {
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

  return (
    <div className="flex flex-col w-full min-h-full mt-[125px] mb-[125px] justify-center items-center relative">
      <div className="flex flex-col justify-start items-center gap-2 w-full overflow-y-auto mt-[-10px]">
        <div className="relative w-full h-96 p-4">
          <div className="flex justify-between items-center h-full">
            <Draggable onDrag={handleDrag} onStop={handleStop}>
              <div
                ref={dragRef}
                className={`cursor-move w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white
              ${isDragging ? "opacity-75" : "opacity-100"}`}
              >
                <img
                  src="/api/placeholder/128/128"
                  alt="Draggable Item"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </Draggable>

            <div
              ref={dropZoneRef}
              className={`w-1/2 h-fit flex items-center justify-center
            ${isOverDropZone ? "border-green-400 bg-green-50" : "border-gray-300"}`}
            >
                <img
                  src="/demo/closet.png"
                  alt="Draggable Item"
                  className="w-full h-full object-cover rounded-lg"
                />
            </div>
          </div>

          {showSuccess && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded">
              dropped successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
