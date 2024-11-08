"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useAccount } from "~~/hooks/useAccount";
import { Address as AddressType } from "@starknet-react/chains";
import { Abi, useReadContract } from "@starknet-react/core";
import { shortString } from "starknet";

import deployedContracts from '~~/contracts/deployedContracts';

const { address: avatarAddress, abi: avatarAbi } = deployedContracts.devnet.PixelForgeAvatar;
const { abi: keyAbi } = deployedContracts.devnet.WardrobeKeyBoredApes;

export default function Page() {
  // State for selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<number | null>(null);

  const updateSelectedItems = async () => {
    console.log("updateSelectedItems", selectedItems);
    console.log("readData", readData);
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

  // Convert selected affiliate to shortString
  const selectedAffiliateString = affiliatesData && selectedAffiliate !== null 
    ? shortString.decodeShortString(affiliatesData[selectedAffiliate].toString())
    : "";

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
        //   onClick={() => updateSelectedItems()}
          onClick={() => updateSelectedItems()}
          disabled={selectedItems.length === 0}
          className="btn btn-primary px-8 py-2 disabled:opacity-50"
        >
          Update Selected Items ({selectedItems.length})
        </button>
      </div>
    </div>
  );
}
