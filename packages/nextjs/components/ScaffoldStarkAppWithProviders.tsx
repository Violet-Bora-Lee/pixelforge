"use client";

import React from "react";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { ProgressBar } from "~~/components/scaffold-stark/ProgressBar";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";
import { ScaffoldStarkApp } from "./ScaffoldStarkApp";
import { Providers } from "./Providers";

export const ScaffoldStarkAppWithProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Providers>
      <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
    </Providers>
  );
};
