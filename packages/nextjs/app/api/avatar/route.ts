import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import { accessoriesConfig } from './accessories';
import { shortString } from 'starknet';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const affiliateAccessories: { [key: string]: string[] } = {};

    params.forEach((value, key) => {
      affiliateAccessories[key] = value.split(',');
    });

    const canvas = createCanvas(500, 500); // Adjust size as needed
    const ctx = canvas.getContext('2d');

    const emptyImagePath = path.join(process.cwd(), 'public', 'avatar', 'empty.png');
    if (fs.existsSync(emptyImagePath)) {
      const emptyImage = await loadImage(emptyImagePath);
      ctx.drawImage(emptyImage, 0, 0, canvas.width, canvas.height);
    }

    for (let [category, items] of Object.entries(affiliateAccessories)) {
      for (let item of items) {
        // if category and item are numbers, decode using shortString
        if (!isNaN(Number(category)) && !isNaN(Number(item))) {
          category = shortString.decodeShortString(category).toString();
          item = shortString.decodeShortString(item).toString();
        }

        const imagePath = path.join(process.cwd(), 'public', 'avatar', category, `${item}.png`);
        if (fs.existsSync(imagePath)) {
          const image = await loadImage(imagePath);

          const config = accessoriesConfig[category][item];

          const [offsetX, offsetY] = config.offset;
          const scale = config.scale;

          ctx.drawImage(
            image,
            offsetX, offsetY, // Position
            image.width * scale, image.height * scale // Scale
          );
        }
      }
    }

    const buffer = canvas.toBuffer('image/png');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
