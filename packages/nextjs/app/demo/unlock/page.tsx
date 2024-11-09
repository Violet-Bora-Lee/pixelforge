"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

import { useDeployedContractInfo } from '~~/hooks/scaffold-stark';
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

export default function Page() {
  useAutoConnect();

  const router = useRouter();

  const { account: connectedAccountInfo, address: connectedAddress, status } = useAccount();


  // // NOTE: workaround - check by name also since in starknet react devnet and sepolia has the same chainId
  // const isLocalNetwork =
  //   targetNetwork.id === devnet.id && targetNetwork.network === devnet.network;
  // const isSepoliaNetwork =
  //   targetNetwork.id === sepolia.id &&
  //   targetNetwork.network === sepolia.network;
  // const isMainnetNetwork =
  //   targetNetwork.id === mainnet.id &&
  //   targetNetwork.network === mainnet.network;


  const { data: deployedContractData } = useDeployedContractInfo("WardrobeKeyBoredApes");

  const { sendAsync: mintNewKey } = useScaffoldWriteContract({
    contractName: "WardrobeKeyBoredApes",
    functionName: "mint" as const,
    args: [connectedAddress]
  });


  const wrapInTryCatch =
    (fn: () => Promise<any>, errorMessageFnDescription: string) => async () => {
      try {
        await fn();
      } catch (error) {
        console.error(
          `Error calling ${errorMessageFnDescription} function`,
          error,
        );
      }
    };

  useEffect(() => {
    console.log("account: ", connectedAddress);
    console.log("address: ", address);
    console.log("status: ", status);
  }, [connectedAddress]);

  const sendMagicLink = async () => {
    console.log("send magic link");
    wrapInTryCatch(mintNewKey, "mintNewKey");
    router.push('/demo/minting-key');
  }

  return (
    <div className="flex w-full min-h-full mb-[125px] justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-60px]">
        <div className="flex flex-col items-center w-full max-w-md space-y-2 px-6">
          <div className="space-y-2 w-full">
            <div className="text-center">
              <h1>Ready to unlock your key?</h1>
              <p>Show us your NFT treasure!</p>
            </div>

            <button className="border border-[#9b94b3] w-full py-1 px-6 rounded-2xl text-gray-500 text-xl">
              unlock by nft
            </button>
          </div>

          <div className="space-y-3 w-full">
            <div className="text-center mt-8">
              <p className="text-l">No NFT? No problem!</p>
              <p className="text-l">We have a magic link to create it!</p>
            </div>

            <div className="w-full space-y-4">
              <p className="text-xl text-center font-semibold">enter email</p>
              <input
                type="email"
                className="w-full py-1 px-6 rounded-2xl border border-[#9b94b3] focus:border-[#9b94b3] focus:border focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                placeholder=""
              />
              <button 
                className="border border-[#9b94b3] w-full py-1 px-6 rounded-2xl text-gray-500 text-xl"
                onClick={sendMagicLink}
                >
                send magic link!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
