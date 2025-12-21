'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  key: string;
  title: string | null;
  gcUsername: string;
  state: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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
            <h1 className="font-lovely text-3xl sm:text-4xl text-center mb-4">
              Gallery
            </h1>
            <p className="text-center text-[16px] leading-[1.25rem] font-arial-rounded font-bold mb-8">
              Here's what other CO's around the country are working on for IRC26. Definitely fp worthy...
            </p>

            {loading ? (
              <div className="text-center font-arial-rounded font-bold">Loading images...</div>
            ) : images.length === 0 ? (
              <div className="text-center font-arial-rounded font-bold text-gray-600">
                No images uploaded yet. Be the first to share your cache ideas!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {images.map((img, index) => (
                  <div 
                    key={img.key || index} 
                    className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={img.url}
                        alt={`${img.title || 'Cache'} by ${img.gcUsername}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 text-xs bg-black/60 text-white absolute bottom-0 left-0 right-0">
                      <div className="font-semibold truncate">{img.title || 'Untitled'}</div>
                      <div className="text-[11px] opacity-90 truncate">
                        @{img.gcUsername} • {img.state}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={`${selectedImage.title || 'Cache'} by ${selectedImage.gcUsername}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="mt-3 text-center text-white">
              <div className="font-semibold text-lg" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                {selectedImage.title || 'Untitled'}
              </div>
              <div className="text-sm opacity-80" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                @{selectedImage.gcUsername} • {selectedImage.state}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
