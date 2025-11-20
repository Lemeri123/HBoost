'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout, loading } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchExpanded(false);
    // Handle search here
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user's first letter and background color
  const getUserInitial = () => {
    const name = currentUser?.displayName || currentUser?.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent background color based on the first letter
  const getUserAvatarColor = () => {
    const name = currentUser?.displayName || currentUser?.email || 'User';
    const letter = name.charAt(0).toUpperCase();
    // Generate a color based on the letter (using a simple hash)
    const colors = [
      '#2ba640', // Green
      '#ff0000', // Red
      '#ff6b00', // Orange
      '#0066ff', // Blue
      '#9b59b6', // Purple
      '#e74c3c', // Red variant
      '#3498db', // Blue variant
      '#1abc9c', // Teal
      '#f39c12', // Orange variant
      '#e67e22', // Dark orange
    ];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-[#0f0f0f] px-2 sm:px-4 md:px-6">
      {/* Mobile: Search Expanded State */}
      {isSearchExpanded ? (
        <div className="flex items-center w-full gap-2 px-2">
          <button
            onClick={handleSearchClose}
            className="p-2 text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                autoFocus
                className="h-10 w-full rounded-full border border-[#222222] bg-[#222222] pl-4 pr-12 text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                onBlur={() => {
                  // Close on blur if empty
                  setTimeout(() => {
                    const input = document.activeElement as HTMLInputElement;
                    if (!input || input.tagName !== 'INPUT') {
                      setIsSearchExpanded(false);
                    }
                  }, 200);
                }}
              />
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <button className="p-1.5 sm:p-2 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">menu</span>
            </button>
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity">
              {/* Streamify Logo - "S" Design */}
              <div className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#2ba640] to-[#1a7a2e] flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">S</span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white">Streamify</h1>
            </Link>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-16">
            <div className="w-full max-w-2xl">
              <form className="flex w-full items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    className="h-10 w-full rounded-l-full border border-[#222222] bg-[#222222] pl-4 pr-4 text-white placeholder:text-[#aaaaaa] focus:border-[#ff0000] focus:outline-none"
                  />
                </div>
                <button className="h-10 flex-shrink-0 rounded-r-full border border-[#222222] bg-white/[.15] px-6 text-white transition-colors hover:bg-white/[.25] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">search</span>
                </button>
              </form>
            </div>
          </div>

          {/* Mobile: Search Icon Button */}
          <button
            onClick={handleSearchFocus}
            className="md:hidden p-2 text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </button>

          {/* Right Section - User Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
            {!loading && (
              <>
                {currentUser ? (
                  <>
                    <button className="p-1.5 sm:p-2 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl sm:text-2xl">videocam</span>
                    </button>
                    <button className="p-1.5 sm:p-2 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
                    </button>
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0 border-2 border-transparent hover:border-[#ff0000] transition-colors flex items-center justify-center text-white font-bold text-sm sm:text-base"
                        style={{ backgroundColor: getUserAvatarColor() }}
                      >
                        {getUserInitial()}
                      </button>
                      {isUserMenuOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-[#222222] rounded-xl border border-[#333333] shadow-2xl overflow-hidden z-50">
                          <div className="p-3 border-b border-[#333333]">
                            <p className="text-white font-semibold text-sm truncate">
                              {currentUser.displayName || 'User'}
                            </p>
                            <p className="text-[#aaaaaa] text-xs truncate">
                              {currentUser.email}
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSignIn}
                      className="h-9 px-4 rounded-full bg-[#222222] text-white text-sm font-medium hover:bg-[#333333] transition-colors hidden sm:block"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleSignUp}
                      className="h-9 px-4 rounded-full bg-[#ff0000] text-white text-sm font-bold hover:bg-[#ff3333] transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  );
}
