import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains'; // Change to your target chain
import { erc721Abi } from 'viem';

// Configure your NFT contract address here
const NFT_CONTRACT_ADDRESS = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

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

    // Get NFT balance for the address
    const balance = await client.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: erc721Abi,
      functionName: 'balanceOf',
      args: [address],
    });

    return NextResponse.json(
      { 
        address,
        balance: Number(balance),
        hasNFT: Number(balance) > 0 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking NFT balance:', error);
    return NextResponse.json(
      { error: 'Failed to check NFT balance' },
      { status: 500 }
    );
  }
}
