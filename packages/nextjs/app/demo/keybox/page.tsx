"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isDraggingKey5, setIsDraggingKey5] = useState(false);

  const [images, setImages] = useState([
    { id: "image-1", src: "/demo/keys/1.png" },
    { id: "image-2", src: "/demo/keys/2.png" },
    { id: "image-3", src: "/demo/keys/3.png" },
    { id: "image-4", src: "/demo/keys/4.png" },
    { id: "image-5", src: "/demo/keys/5.png" }, // bayc key
  ]);

  const handleDragStart = (result: any) => {
    if (result.draggableId === "image-5") {
      setIsDraggingKey5(true);
    }
  };

  const handleDragEnd = (result: any) => {
    setIsDraggingKey5(false);

    if (result.destination) {
      const items = Array.from(images);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setImages(items);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingKey5) {
        const windowWidth = window.innerWidth;
        console.log('Mouse position:', e.clientX, 'Window width:', windowWidth); // 디버깅용

        if (e.clientX > windowWidth * 0.9) {
          console.log('Navigating...'); // 디버깅용
          setIsDraggingKey5(false);
          router.push("/demo/closed-closet");
        }
      }
    };

    if (isDraggingKey5) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', (e) => handleMouseMove(e.touches[0] as any));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', (e) => handleMouseMove(e.touches[0] as any));
    };
  }, [isDraggingKey5, router]);

  return (
    <div className="flex flex-col w-full min-h-full mt-[125px] mb-[125px] justify-center items-center relative">
      <div className="w-[330px] items-center">
        <Image
          className="flex w-full items-center"
          alt="key hanger image"
          src="/demo/key-hanger.png"
          width={360}
          height={50}
        />
      </div>
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-10px]">
        <div className="w-4/5 relative">
          <DragDropContext 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-0"
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="cursor-move"
                        >
                          <Image
                            width={100}
                            height={100}
                            src={image.src}
                            alt={`Image ${index + 1}`}
                            className="w-32 h-32 rounded-lg"
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
