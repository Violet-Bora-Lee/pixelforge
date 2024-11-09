"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';

import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

export default function Page() {
  useAutoConnect();

  const { account: connectedAccountInfo, address: connectedAddress, status } = useAccount();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Extract token from query params

  console.log("token: ", token);

  const { sendAsync: mintNewkeyWithBaycNft } = useScaffoldWriteContract({
    contractName: "WardrobeKeyBoredApes",
    functionName: "mint" as const,
    // args: [connectedAddress, token], // Pass token as an argument
    args: [connectedAddress], // TODO
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

  const router = useRouter();

  const goToKeyMintedPage = () => {
    router.push('/demo/redeemed-key');
  };

  useEffect(() => {
    console.log("connected account info: ", connectedAccountInfo);
    console.log("connected address: ", connectedAddress);
    console.log("status: ", status);
  }, [connectedAddress]);

  const handleClick = () => {
    wrapInTryCatch(
      () => mintNewkeyWithBaycNft(),
      "mintNewkeyWithBaycNft"
    )().then(() => {
      goToKeyMintedPage();
    });
  };

  return (
    <div 
      className="flex w-full min-h-full mb-[125px] justify-center items-center"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-start items-center gap-6 w-full overflow-y-auto mt-[-60px]">
        <div className="flex flex-col items-center w-full max-w-md space-y-6 px-6">
          <div className="text-center text-xl">
            <p className="flex flew-col w-full space-x-2">
              <span>just a sec</span>
              <Image
                width={32}
                height={32}
                className="object-contain"
                src="/demo/loading-dots.gif"
                alt="loading dots"
              />
            </p>
          </div>
          <div className="text-center text-xl">
            <p>we are checking</p>
            <p>your wallet to find</p>
            <p>that treasure...</p>
          </div>
        </div>
      </div>
    </div>
  );
}