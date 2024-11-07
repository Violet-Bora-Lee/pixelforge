import "./globals.css";
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider enableSystem>
      <ScaffoldStarkAppWithProviders>{children}</ScaffoldStarkAppWithProviders>
    </ThemeProvider>
  );
};

export default Layout;
