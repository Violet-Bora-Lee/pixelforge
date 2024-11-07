"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";

export default function Page() {
  const [images, setImages] = useState([
    { id: "image-1", src: "/demo/1.png" },
    { id: "image-2", src: "/demo/2.png" },
    { id: "image-3", src: "/demo/3.png" },
    { id: "image-4", src: "/demo/4.png" },
    { id: "image-5", src: "/demo/5.png" },
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  return (
    <div className="flex flex-col w-full min-h-full mt-[125px] mb-[125px] justify-center items-center relative">
      <div className="w-4/5 items-center">
        <Image
          className="flex w-full items-center"
          alt="key hanger image"
          src="/demo/key-hanger.png"
          width={350}
          height={50}
        />
      </div>
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-10px]">
        <div className="w-4/5 relative">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-4"
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
