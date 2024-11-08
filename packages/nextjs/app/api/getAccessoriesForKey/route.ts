import { NextResponse } from 'next/server';
import { RpcProvider, Account, Contract, shortString } from 'starknet'

import deployedContracts from '~~/contracts/deployedContracts';

// TODO get chain from somewhere

// Load contracts
const { abi: wardrobeKeyAbi } = deployedContracts.devnet.WardrobeKeyBoredApes;
const { address: avatarAddress, abi: avatarAbi } = deployedContracts.devnet.PixelForgeAvatar;

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
// const wardrobeKeyContract = new Contract(wardrobeKeyAbi, wardrobeKeyAddress, account);
const avatarContract = new Contract(avatarAbi, avatarAddress, account);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliate = searchParams.get('affiliate');

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate is required' },
        { status: 400 }
      );
    }


    type AccessoriesResult = BigInt[];

    // Send tx to the contract
    const res = await avatarContract.call('get_accessories_for_affiliate', [affiliate]) as AccessoriesResult;

    const accessories = res.map((a) => shortString.decodeShortString(a.toString()));

    console.log(accessories);
    
    return NextResponse.json(
      { 
        success: true,
        accessories
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error getting accessories for affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to get accessories for affiliate' },
      { status: 500 }
    );
  }
}
