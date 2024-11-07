import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Forge",
  description: "Advanced avatar customization tool designed for the Starknet gaming ecosystem",
  icons: "/pixel-forge-icon.png",
};

const PixelForgeApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
};

export default PixelForgeApp;
