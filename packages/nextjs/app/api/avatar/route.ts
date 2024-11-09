import { NextResponse } from 'next/server';
import { shortString } from 'starknet';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const affiliateAccessories: { [key: string]: string[] } = {};

    params.forEach((value, key) => {
      affiliateAccessories[key] = value.split(',');
    });

    // Construct the image URL with the same params
    const imageUrl = `https://pixelforge-nextjs.vercel.app/api/avatarImage?${params.toString()}`;

    // Prepare attributes from affiliateAccessories
    const attributes = Object.entries(affiliateAccessories).map(([category, items]) => ({
      trait_type: category,
      value: items.join(', ')
    }));

    // Construct the metadata JSON
    const metadata = {
      name: "PixelForge Avatar",
      description: "An Avatar for the PixelForge platform",
      image: imageUrl,
      // attributes: attributes
    };

    return NextResponse.json(metadata);

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
