"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from 'next/image';
import { useAccount } from "~~/hooks/useAccount";
import { Address as AddressType } from "@starknet-react/chains";
import { Abi, useContract, useReadContract, useSendTransaction } from "@starknet-react/core";
import { shortString } from "starknet";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";

import deployedContracts from '~~/contracts/deployedContracts';

const { address: avatarAddress, abi: avatarAbi } = deployedContracts.devnet.PixelForgeAvatar;
const { abi: keyAbi } = deployedContracts.devnet.WardrobeKeyBoredApes;

export default function Page() {
  // State for selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<number | null>(null);

  const updateSelectedItems = async () => {
    console.log("calls", calls);
    console.log("updateSelectedItems", selectedItems);
    console.log("readData", readData);
    console.log("writeData", writeData);
    console.log("writeIsPending", writeIsPending);
    const res = await writeAsync();
    console.log("writeData", writeData);
    console.log("writeIsPending", writeIsPending);
    console.log("writeIsSuccess", writeIsSuccess);
    console.log("writeError", writeError);
    console.log("writeStatus", writeStatus);
  
  }

  // Add new contract read for affiliates
  const { data: affiliatesData } = useReadContract({
    functionName: "get_affiliates",
    args: [],
    abi: avatarAbi as Abi,
    address: avatarAddress,
    watch: true,
    refetchInterval: 1000
  });

  const { address: userAddress } = useAccount();

  const { contract: avatarContract } = useContract({
    abi: avatarAbi,
    address: avatarAddress,
  });

  // Convert selected affiliate to shortString
  const selectedAffiliateString = affiliatesData && selectedAffiliate !== null 
    ? shortString.decodeShortString(affiliatesData[selectedAffiliate].toString())
    : "";

  const calls = useMemo(() => {
    if (!userAddress || !avatarContract) return [];
    const accessories = selectedItems.map((itemId) => ({
      affiliate_id: selectedAffiliateString,
      accessory_id: itemId,
      is_on: true // TODO: unselected items should be false
    }));
    return [avatarContract.populate("update_accessories", [accessories])];
  }, [avatarContract, userAddress, selectedItems, selectedAffiliate]);

  // Modified contract read to use selected affiliate
  const { data: readData, refetch: dataRefetch, isError: readIsError, isLoading: readIsLoading, error: readError } = useReadContract({
    functionName: "get_accessories_for_affiliate",
    args: [selectedAffiliateString],
    abi: avatarAbi as Abi,
    address: avatarAddress,
    watch: true,
    refetchInterval: 1000,
    enabled: selectedAffiliate !== null // Only run query when an affiliate is selected
  });

  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
    error: writeError,
    status: writeStatus,
    isSuccess: writeIsSuccess,
  } = useSendTransaction({
    calls,
  });

  // Add affiliate selection handler
  const selectAffiliate = (index: number) => {
    setSelectedAffiliate(selectedAffiliate === index ? null : index);
  };

  // Handle item selection
  const toggleItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="flex w-full min-h-full mt-[125px] mb-[125px] justify-center items-center">
      {/* Add CustomConnectButton with higher z-index */}
      <div className="absolute top-4 right-4 z-50">
        <CustomConnectButton />
      </div>

      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-120px]">
        {/* Affiliates Grid */}
        <h2 className="text-xl font-bold">Select Affiliate</h2>
        <div className="grid grid-cols-3 gap-4 p-4 w-full max-w-2xl">
          {affiliatesData?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => selectAffiliate(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedAffiliate === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-center">{shortString.decodeShortString(item.toString())}</div>
            </div>
          ))}
        </div>

        {/* Existing Accessories Grid */}
        <h2 className="text-xl font-bold">Select Accessories</h2>
        {/* Grid of items */}
        <div className="grid grid-cols-3 gap-4 p-4 w-full max-w-2xl">
          {readData?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => toggleItem(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedItems.includes(index)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-center">{shortString.decodeShortString(item.toString())}</div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={() => updateSelectedItems()}
          disabled={selectedItems.length === 0}
          className="btn btn-primary px-8 py-2 disabled:opacity-50"
        >
          Update Selected Items ({selectedItems.length})
        </button>
        Success: {writeIsSuccess ? "true" : "false"}
      </div>
    </div>
  );
}
