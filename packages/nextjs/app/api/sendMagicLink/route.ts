import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // or any other email library
import crypto from 'crypto';

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a unique token
    const token = crypto.randomBytes(20).toString('hex');

    // Create a magic link
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/demo/test-mint-from-link?token=${token}`;

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Magic Link to Mint an NFT',
      text: `Click the link to mint your NFT: ${magicLink}`,
    });

    return NextResponse.json(
      { success: true, message: 'Magic link sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}
