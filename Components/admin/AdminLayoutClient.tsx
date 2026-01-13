// app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminAuthWrapper from "@/Components/admin/AuthWrapper";
import Link from "next/link";
import { Menu, X, Home } from "lucide-react";

const links = [
  { text: "Studios", url: "studios" },
  { text: "Feedbacks", url: "feedbacks" },
  { text: "Insights", url: "insights" },
  { text: "Works", url: "work" },
  { text: "Updates", url: "updates" },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
  email: string;
  isAuthorized: boolean;
}

export default function AdminLayoutClient({ 
  children, 
  email, 
  isAuthorized 
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      handleCloseMenu();
    }
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleOpenMenu = () => {
    setIsClosing(false);
    setMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsClosing(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match this with your CSS transition duration
  };

  const toggleMenu = () => {
    if (mobileMenuOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  };

  if (!isAuthorized) {
    return <AdminAuthWrapper isAuthorized={false}>{children}</AdminAuthWrapper>;
  }

  return (
    <AdminAuthWrapper isAuthorized={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="border-b px-4 py-3 shadow-sm bg-black">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <div className="flex gap-3 items-center">
                {links.map((admin, index) => (
                  <Link 
                    key={index} 
                    href={`/admin/${admin.url}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded hover:bg-gray-800"
                  >
                    {admin.text}
                  </Link>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-300">
              Logged in as: <span className="font-medium">{email}</span>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link 
                href="/admin"
                className="text-white p-1 hover:bg-gray-800 rounded"
                aria-label="Admin Home"
              >
                <Home size={20} />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
                <div className="text-xs text-gray-300">
                  <span className="font-medium">{email.split('@')[0]}</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-white p-1 hover:bg-gray-800 rounded transition-colors z-50"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {(mobileMenuOpen || isClosing) && (
          <div 
            className="lg:hidden fixed inset-0 z-40 transition-all duration-300"
            onClick={(e) => {
              // Close menu when clicking on overlay background
              if (e.target === e.currentTarget) {
                handleCloseMenu();
              }
            }}
          >
            {/* Overlay Backdrop */}
            <div 
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                mobileMenuOpen && !isClosing ? 'opacity-95' : 'opacity-0'
              }`}
            />
            
            {/* Sliding Menu Panel */}
            <div 
              className={`absolute right-0 top-0 bottom-0 w-80 bg-black shadow-xl transform transition-transform duration-300 ${
                mobileMenuOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="h-full flex flex-col">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="text-white font-semibold text-lg">Navigation</div>
                  <button
                    onClick={handleCloseMenu}
                    className="text-white p-2 hover:bg-gray-800 rounded transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Menu Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {links.map((admin, index) => (
                      <Link
                        key={index}
                        href={`/admin/${admin.url}`}
                        className="flex items-center text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors"
                        onClick={handleCloseMenu}
                      >
                        <span className="text-lg">{admin.text}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
                
                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                  <div className="text-sm text-gray-300">
                    Logged in as:
                    <div className="font-medium text-white mt-1 truncate">{email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="p-3 sm:p-4 md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </AdminAuthWrapper>
  );
}