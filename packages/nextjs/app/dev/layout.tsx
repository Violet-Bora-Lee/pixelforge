import "./globals.css";

import { ThemeProvider } from "~~/components/ThemeProvider";
import { Providers } from '~~/components/Providers';
import { ScaffoldStarkApp } from '~~/components/ScaffoldStarkApp';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider enableSystem>
      <Providers>
        <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
      </Providers>
    </ThemeProvider>
  );
};

export default Layout;
