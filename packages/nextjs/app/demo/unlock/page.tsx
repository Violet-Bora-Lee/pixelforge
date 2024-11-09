"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";

import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { devnet, sepolia, mainnet } from "@starknet-react/chains";

export default function Page() {
  useAutoConnect();

  const router = useRouter();

  const { account: connectedAccountInfo, address: connectedAddress, status } = useAccount();

  const { targetNetwork } = useTargetNetwork();

  const isLocalNetwork =
    targetNetwork.id === devnet.id && targetNetwork.network === devnet.network;
  const isSepoliaNetwork =
    targetNetwork.id === sepolia.id &&
    targetNetwork.network === sepolia.network;
  const isMainnetNetwork =
    targetNetwork.id === mainnet.id &&
    targetNetwork.network === mainnet.network;

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
    if (isSepoliaNetwork) {
      console.log("Currently on Sepolia Network");
    }

    if (isLocalNetwork) {
      console.log("Currently on Local Network");
    }

    if (isMainnetNetwork) {
      console.log("Currently on Mainnet Network");
    }

    console.log("connected account info: ", connectedAccountInfo);
    console.log("connected address: ", connectedAddress);
    console.log("status: ", status);

  }, [connectedAddress, isSepoliaNetwork]);

  const handleSendMagicLinkButton = async () => {
    console.log("click 'send magic link' button");
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
                onClick={handleSendMagicLinkButton}
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
