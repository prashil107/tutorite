"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTuthub } from '@/providers/TuthubProvider';
import AuthForm from '../auth/AuthForm';

const Navbar = () => {
  const pathname = usePathname();
  const { authState, logout } = useTuthub();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-primary flex items-center">
            TutHub
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/courses" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.includes('/courses') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Courses
            </Link>
            <Link 
              href="/teachers" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.includes('/teachers') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Teachers
            </Link>
            {authState.isAuthenticated && authState.user?.role === 'teacher' && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.includes('/dashboard') ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden md:flex mx-4 flex-1 max-w-sm">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses or teachers..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* User section */}
        <div className="flex items-center gap-4">
          {authState.isAuthenticated ? (
            <div className="flex items-center gap-4">

              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="rounded-full p-0 h-8 w-8"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onBlur={(e) => {
                    // Don't hide the menu if clicking on the menu itself
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setTimeout(() => setShowUserMenu(false), 100);
                    }
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-placeholder.png" alt={authState.user?.username || 'User'} />
                    <AvatarFallback>
                      {authState.user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border z-50"
                    onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing immediately
                  >
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <FaUser className="inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => setAuthMode('login')}
                  >
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button 
                    variant="default"
                    onClick={() => setAuthMode('register')}
                  >
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <AuthForm 
                    mode={authMode} 
                    onSuccess={() => setShowAuthModal(false)}
                    onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 