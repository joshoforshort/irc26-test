'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  key: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching gallery:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/Background%20Storm.PNG)',
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 pt-10 sm:pt-14 md:pt-16 pb-16">
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 sm:px-8 py-8 border border-white/50">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-5">
              <Image
                src="/IRC Circle.PNG"
                alt="IRC26 Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="font-lovely text-3xl sm:text-4xl text-center mb-8">
              Gallery
            </h1>

            {loading ? (
              <div className="text-center font-arial-rounded font-bold">Loading images...</div>
            ) : images.length === 0 ? (
              <div className="text-center font-arial-rounded font-bold text-gray-600">
                No images uploaded yet. Be the first to share your cache ideas!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {images.map((img, index) => (
                  <div key={img.key || index} className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                    <img
                      src={img.url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
