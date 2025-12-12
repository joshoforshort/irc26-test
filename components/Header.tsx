'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  const linkStyles = "px-1.5 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between font-lovely text-white">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-wide hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
            IRC26
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/news" className={linkStyles}>
              News
            </Link>
            <Link href="/pledge" className={linkStyles}>
              Pledge
            </Link>
            <Link href="/confirm" className={linkStyles}>
              Confirm
            </Link>
            <Link href="/faqs" className={linkStyles}>
              FAQ
            </Link>
            {session?.user && (
              <Link href="/profile" className={linkStyles}>
                Profile
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
