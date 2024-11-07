import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scaffold-Stark",
  description: "Fast track your starknet journey",
  icons: "/logo.ico",
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
