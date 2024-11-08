import { NextResponse } from 'next/server';
import { RpcProvider, Account, Contract, shortString } from 'starknet';
import deployedContracts from '~~/contracts/deployedContracts';

// Load contract details
const { address: avatarAddress, abi: avatarAbi } = deployedContracts.devnet.PixelForgeAvatar;

// Setup provider and account
const rpcUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || "http://localhost:5050"
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0x71d7bb07b9a64f6f78ac4c816aff4da9"
const deployerAddress = process.env.DEPLOYER_ADDRESS ?? "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691"

const provider = new RpcProvider({
  nodeUrl: rpcUrl 
});

const account = new Account(provider, deployerAddress, deployerPrivateKey);
const avatarContract = new Contract(avatarAbi, avatarAddress, account);

export async function GET(request: Request) {
  try {
    // Call the contract's get_affiliates method
    const res = await avatarContract.call('get_affiliates') as BigInt[];
    
    // Convert the felt252 values to strings
    const affiliations = res.map((a) => shortString.decodeShortString(a.toString()));

    return NextResponse.json(
      { 
        success: true,
        affiliations 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error getting affiliations:', error);
    return NextResponse.json(
      { error: 'Failed to get affiliations' },
      { status: 500 }
    );
  }
}
