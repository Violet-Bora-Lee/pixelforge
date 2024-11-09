"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { shortString } from "starknet";

export default function Page() {
  useAutoConnect();

  const { account: connectedAccountInfo, address: connectedAddress, status } = useAccount();

  useEffect(() => {
    console.log("connected account info: ", connectedAccountInfo);
    console.log("connected address: ", connectedAddress);
    console.log("status: ", status);
  }, [connectedAddress]);

  const [hasHat, setHasHat] = useState(false);
  const [showHatInCabinet, setShowHatInCabinet] =useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAccessory = async (destinationId: string) => {
    const updateAccessoryWithDestination = async () => {
      setIsLoading(true);
      try {
        const result = await updateAccessory();
        if (result) {
          if (destinationId === 'character') {
            setHasHat(true);
            setShowHatInCabinet(false);
          } else {
            setHasHat(false);
            setShowHatInCabinet(true);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    await wrapInTryCatch(
      updateAccessoryWithDestination,
      `update accessory to ${destinationId}`
    )();
  };

  const wrapInTryCatch =
    (fn: () => Promise<any>, errorMessageFnDescription: string) => async () => {
      try {
        await fn();
      } catch (error) {
        console.error(
          `Error calling ${errorMessageFnDescription} function`,
          error
        );
      }
    };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    handleUpdateAccessory(result.destination.droppableId);
  };

  const { sendAsync: updateAccessory } = useScaffoldWriteContract({
    contractName: "PixelForgeAvatar",
    functionName: "update_accessories" as const,
    // TODO: pass felt252 type affiliate_id, felt252 type accessory_id, bool type is_on with real values
    args: [[
      {
        affiliate_id: shortString.encodeShortString("bored_apes"), // "bored_apes" encoded as felt252
        accessory_id: shortString.encodeShortString("hat"),        // "hat" encoded as felt252
        is_on: true
      },
      // {
      //   affiliate_id: shortString.encodeShortString("bored_apes"), // "bored_apes" encoded as felt252
      //   accessory_id: shortString.encodeShortString("t-shirt"),    // "t-shirt" encoded as felt252
      //   is_on: true
      // }
    ]]
  });

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
                    {showHatInCabinet && !isLoading && (
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
                  {isLoading && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                      <img
                        src="/demo/bayc-hat.png"
                        alt="Loading Hat"
                        className="w-20 h-auto animate-spin"
                      />
                    </div>
                  )}
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
