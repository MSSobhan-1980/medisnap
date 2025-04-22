
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isLanding?: boolean;
}

export default function Layout({ children, isLanding = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header isLanding={isLanding} />
      <main className={`flex-grow ${isLanding ? '' : 'pt-4'}`}>{children}</main>
      <Footer isLanding={isLanding} />
    </div>
  );
}
