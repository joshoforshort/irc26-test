'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center hero-background" 
      style={{
        backgroundImage: 'url(/IRC_background_1.jpeg)',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20 pb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
          It&apos;s Raining Caches 2026
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-md">
          Community Project by BeautifulSky13
        </p>
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
            <Image
              src="/IRC26_Logo_1.png"
              alt="It's Raining Caches 2026 Logo"
              width={256}
              height={256}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/pledge"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105"
          >
            Pledge a Cache
          </Link>
          <Link
            href="/confirm"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105"
          >
            Confirm a Cache
          </Link>
        </div>
      </div>
    </section>
  );
}

