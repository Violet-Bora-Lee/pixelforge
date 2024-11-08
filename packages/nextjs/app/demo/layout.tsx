import "./globals.css";

import { Providers } from "~~/components/Providers";
import Header from "~~/components/demo/Header";
import Footer from "~~/components/demo/Footer";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div className="relative flex flex-col h-[100vh] items-center justify-center">
        <Header />
        <main className="flex-grow flex items-center justify-center h-full w-full max-w-screen-sm mt-16">
          {children}
          <div className="fixed bottom-[80px] right-6">
            <Image
              alt="pixel forge logo"
              src="/demo/pixel-forge-logo.png"
              width={150}
              height={332}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default Layout;
