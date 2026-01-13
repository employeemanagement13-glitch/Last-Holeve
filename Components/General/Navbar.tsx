"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { navItems } from "@/lib/data";
import Navlink from "./Navlink";

interface BaseComponentProps {
  className?: string;
}

const Navbar: React.FC<BaseComponentProps> = ({ className = "" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if we're on client
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);
  
  // Get user state from Clerk
  const { isSignedIn, user, isLoaded } = useUser();

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (mobileOpen) {
      const closeMenu = () => {
        setIsAnimating(true);
        setMobileOpen(false);
        setTimeout(() => setIsAnimating(false), 300);
      };
      closeMenu();
    }
  }, [pathname]);

  // Prevent body scroll when mobile menu is open - only on client
  useEffect(() => {
    if (!isClient || !mobileOpen) return;
    
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;
    
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
    };
  }, [mobileOpen, isClient]);

  // Handle Escape key
  useEffect(() => {
    if (!isClient) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        handleCloseMenu();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, isClient]);

  // Trap focus within mobile menu when open
  useEffect(() => {
    if (!isClient || !mobileOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] as HTMLElement;
      lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      firstFocusableRef.current?.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      
      if (!e.shiftKey && document.activeElement === lastFocusableRef.current) {
        e.preventDefault();
        firstFocusableRef.current?.focus();
      } else if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
        e.preventDefault();
        lastFocusableRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [mobileOpen, isClient]);

  // Handle outside click
  useEffect(() => {
    if (!isClient) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        mobileOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [mobileOpen, isClient]);

  const handleOpenMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMobileOpen(true);
    setTimeout(() => setIsAnimating(false), 10);
  }, [isAnimating]);

  const handleCloseMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMobileOpen(false);
    setTimeout(() => {
      setIsAnimating(false);
      menuButtonRef.current?.focus();
    }, 300);
  }, [isAnimating]);

  const toggleMenu = useCallback(() => {
    if (mobileOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  }, [mobileOpen, handleOpenMenu, handleCloseMenu]);

  // Generate stable keys for list items
  const generateStableKey = useCallback((itemName: string, index: number) => {
    return `nav-${itemName}-${index}`;
  }, []);

  return (
    <nav className={`py-4 md:py-6 ${className}`} aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="companyname text-xl md:text-2xl font-bold tracking-tight"
          onClick={handleCloseMenu}
          aria-label="Holeve Home"
        >
          Holeve
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 text-[16px] font-medium">
          {navItems.map((item, index) => (
            <Navlink 
              key={generateStableKey(item.name, index)} 
              item={item} 
            />
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Only show UserButton/Contact when client-side loaded */}
          {isClient && isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  {/* Optional: Show admin link if user is admin */}
                  {user?.publicMetadata?.isAdmin === true && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      prefetch={false}
                    >
                      Admin
                    </Link>
                  )}
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonTrigger: "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      }
                    }}
                  />
                </div>
              ) : (
                <Link
                  href="#contact"
                  className="buttonbg text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
                  prefetch={false}
                >
                  Contact
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile: CTA & hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Only show on client side */}
          {isClient && isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }
                }}
              />
            </div>
          ) : (
            isClient && (
              <Link
                href="#contact"
                className="hidden sm:inline-block buttonbg text-white font-semibold py-1 px-3 rounded-full text-sm hover:opacity-90 transition-opacity"
                onClick={handleCloseMenu}
                prefetch={false}
              >
                Contact
              </Link>
            )
          )}

          {/* Hamburger button */}
          <button
            ref={menuButtonRef}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            disabled={isAnimating}
            className="relative z-50 w-10 h-10 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-black"
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>

            {/* Animated hamburger icon */}
            <div className="relative w-6 h-6">
              <span 
                className={`absolute top-1 left-0 w-full h-0.5 bg-current transition-all duration-300 transform ${
                  mobileOpen ? "rotate-45 translate-y-2 hidden" : ""
                }`}
              />
              <span 
                className={`absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0 hidden" : "opacity-100"
                }`}
              />
              <span 
                className={`absolute top-4 left-0 w-full h-0.5 bg-current transition-all duration-300 transform ${
                  mobileOpen ? "-rotate-45 -translate-y-2 hidden" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Only render when isClient is true */}
      {isClient && (
        <div
          id="mobile-menu"
          ref={menuRef}
          aria-hidden={!mobileOpen}
          className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
            mobileOpen 
              ? "opacity-100 visible" 
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              mobileOpen ? "opacity-40" : "opacity-0"
            }`}
            onClick={handleCloseMenu}
            aria-hidden="true"
          />

          {/* Sliding panel */}
          <div
            className={`absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="h-full flex flex-col">
              {/* Menu header */}
              <div className="flex items-center justify-between p-6 border-b">
                <span id="mobile-menu-title" className="sr-only">Mobile menu</span>
                <Link 
                  href="/" 
                  onClick={handleCloseMenu}
                  className="companyname text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                  prefetch={false}
                >
                  Holeve
                </Link>
                <button
                  ref={el => { if (el) firstFocusableRef.current = el; }}
                  onClick={handleCloseMenu}
                  aria-label="Close menu"
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto p-6" aria-label="Mobile navigation">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={generateStableKey(`mobile-${item.name}`, index)}
                      href={item.link}
                      onClick={handleCloseMenu}
                      className={`block text-lg font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
                        pathname === item.link 
                          ? "bg-gray-100 text-gray-900" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Show admin link in mobile menu if user is admin */}
                  {isLoaded && isSignedIn && user?.publicMetadata?.isAdmin === true && (
                    <Link
                      href="/admin"
                      onClick={handleCloseMenu}
                      className={`block text-lg font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
                        pathname === "/admin" 
                          ? "bg-gray-100 text-gray-900" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      prefetch={false}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </nav>

              {/* Mobile Footer - Show UserButton if signed in, otherwise show Contact */}
              <div className="p-6 border-t">
                {isLoaded && isSignedIn ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full">
                      <UserButton 
                        afterSignOutUrl="/"
                        showName={true}
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            userButtonTrigger: "w-full justify-start px-4 py-3 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500",
                            userButtonOuterIdentifier: "text-lg font-medium",
                            avatarBox: "w-10 h-10"
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Link
                    ref={el => { if (el) lastFocusableRef.current = el; }}
                    href="#contact"
                    onClick={handleCloseMenu}
                    className="inline-block w-full text-center buttonbg text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;