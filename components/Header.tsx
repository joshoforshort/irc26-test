'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between font-lovely text-white">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-wide hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
            IRC26
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pledge" className="text-sm sm:text-base font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
              Pledge
            </Link>
            <Link href="/confirm" className="text-sm sm:text-base font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
              Confirm
            </Link>
            <Link href="/faqs" className="text-sm sm:text-base font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
              FAQ
            </Link>
            {session?.user && (
              <Link href="/profile" className="text-sm sm:text-base font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
                Profile
              </Link>
            )}
            <Link href="/admin" className="text-sm sm:text-base font-medium hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

