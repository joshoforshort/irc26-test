'use client';

import Image from 'next/image';

export default function News() {
  return (
    <main
      className="relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/Background%20Storm.PNG)',
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Content */}
      <div className="relative z-10 pt-10 sm:pt-14 md:pt-16 pb-16">
        {/* News Card */}
        <section className="px-4 sm:px-6 mb-14 sm:mb-16">
          <div className="mx-auto max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 sm:px-8 py-8 border border-white/50">
            <div className="mx-auto w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-8 sm:mb-10">
              <Image
                src="/IRC26_Logo_1.png"
                alt="IRC26 Logo"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <h1 className="font-lovely text-3xl sm:text-4xl text-center mb-12">
              NEWS
            </h1>

            <div className="mx-auto max-w-[68ch] text-[16px] leading-6 space-y-8 text-center font-arial-rounded font-bold">
              {/* News Item 1 */}
              <div>
                <h2 className="font-lovely text-xl sm:text-2xl leading-tight tracking-wide mt-6 mb-2 text-center">
                  WELCOME TO IRC26!
                </h2>
                <p className="leading-relaxed mt-1 text-center" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                  We're excited to announce the launch of It's Raining Caches 2026! After the incredible success of IRC25, we're back and ready to make it rain even more caches across Australia. Stay tuned for updates as we build towards February 14, 2026.
                </p>
              </div>

              {/* News Item 2 */}
              <div>
                <h2 className="font-lovely text-xl sm:text-2xl leading-tight tracking-wide mt-6 mb-2 text-center">
                  PLEDGING IS NOW OPEN
                </h2>
                <p className="leading-relaxed mt-1 text-center" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                  Ready to be a Rainmaker? You can now pledge your caches for IRC26. Whether you're planning one cache or ten, every contribution helps make the event a success. Head to the Pledge page to get started!
                </p>
              </div>

              {/* News Item 3 */}
              <div>
                <h2 className="font-lovely text-xl sm:text-2xl leading-tight tracking-wide mt-6 mb-2 text-center">
                  SPREAD THE WORD
                </h2>
                <p className="leading-relaxed mt-1 text-center" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                  Know other cache owners who might want to participate? Share IRC26 with your geocaching friends! The more Rainmakers we have, the bigger the splash on publish day.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
