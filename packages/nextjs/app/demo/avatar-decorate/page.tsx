"use client";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function Page() {
  const [hasHat, setHasHat] = React.useState(false);
  const [showHatInCabinet, setShowHatInCabinet] = React.useState(true);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.destination.droppableId === 'character') {
      setHasHat(true);
      setShowHatInCabinet(false);
    } else {
      setHasHat(false);
      setShowHatInCabinet(true);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col w-full min-h-full mb-[125px] justify-center items-center relative">
        <div className="flex w-full gap-4 px-6 justify-between">
          {/* 왼쪽: 캐비닛 */}
          <Droppable droppableId="cabinet">
            {(provided) => (
              <div 
                className="w-1/2 h-96"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="relative w-full h-full">
                  <img
                    src="/demo/opened-closet.png"
                    alt="Cabinet"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    {showHatInCabinet && (
                      <Draggable draggableId="hat" index={0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center h-20"
                          >
                            <img
                              src="/demo/bayc-hat.png"
                              alt="BAYC Cap"
                              className="w-20 h-auto cursor-move"
                            />
                          </div>
                        )}
                      </Draggable>
                    )}
                    <img
                      src="/demo/bayc-t-shirt.png"
                      alt="BAYC T-shirt"
                      className="w-36 h-auto"
                    />
                  </div>
                  <div style={{ display: 'none' }}>{provided.placeholder}</div>
                </div>
              </div>
            )}
          </Droppable>

          {/* 오른쪽: 캐릭터 */}
          <Droppable droppableId="character">
            {(provided, snapshot) => (
              <div 
                className="w-1/3 h-96"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className={`relative w-full h-full ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}>
                  <img
                    src={hasHat ? "/demo/avatar-with-hat.png" : "/demo/avatar-no-hat.png"}
                    alt="Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
