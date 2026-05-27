import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const currentPath = window.location.pathname;
  const isAuthenticated = !!(sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user'));
  
  // Show footer only on unauthenticated home page, never on dashboard or authenticated pages
  const showFooter = currentPath === '/' && !isAuthenticated;
  
  // Show navbar only on unauthenticated pages (not home, not dashboard)
  const showNavbar = false;
  
  return (
    <div className="font-body bg-gray-50 text-dark min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
