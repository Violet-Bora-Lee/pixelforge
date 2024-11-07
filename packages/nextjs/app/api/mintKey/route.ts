import { NextResponse } from 'next/server';
import { RpcProvider, Account, Contract } from 'starknet'

import deployedContracts from '~~/contracts/deployedContracts';

// TODO get chain from somewhere
const {address: wardrobeKeyAddress, abi: wardrobeKeyAbi} = deployedContracts.devnet.WardrobeKey;

// TODO get from config (/packages/nextjs/utils/devnetAccounts.ts)
const rpcUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || "http://localhost:5050"
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0x71d7bb07b9a64f6f78ac4c816aff4da9"
const deployerAddress = process.env.DEPLOYER_ADDRESS ?? "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691"

const provider = new RpcProvider({
  nodeUrl: rpcUrl 
});

const account = new Account(provider, deployerAddress, deployerPrivateKey);
console.log('Account connected successfully');

// Load the Contract
const wardrobeKeyContract = new Contract(wardrobeKeyAbi, wardrobeKeyAddress, account);

export async function POST(request: Request) {
  try {
    // Parse the request body to get the address
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Send tx to the contract
    const tx = await wardrobeKeyContract.invoke('mint', [address]);

    // Wait for the tx
    await provider.waitForTransaction(tx.transaction_hash);
    console.log('Transaction confirmed');

    return NextResponse.json(
      { 
        success: true,
        transaction_hash: tx.transaction_hash,
        minted_to: address,
        contract_address: wardrobeKeyAddress
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error minting key:', error);
    return NextResponse.json(
      { error: 'Failed to mint key' },
      { status: 500 }
    );
  }
}
