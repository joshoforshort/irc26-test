'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  _count: {
    likes: number;
  };
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let visitorId = localStorage.getItem('irc26_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('irc26_visitor_id', visitorId);
  }
  return visitorId;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function LikeButton({ postId, initialCount }: { postId: string; initialCount: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (visitorId) {
      fetch(`/api/news/${postId}/like?visitorId=${visitorId}`)
        .then(res => res.json())
        .then(data => {
          setLiked(data.liked);
          setCount(data.count);
        })
        .catch(console.error);
    }
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const visitorId = getVisitorId();
    
    try {
      const res = await fetch(`/api/news/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      });
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
        liked 
          ? 'bg-[#69bc45] text-white' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
      style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
    >
      <span className="text-lg">{liked ? '💚' : '🤍'}</span>
      <span className="text-sm font-semibold">{count}</span>
    </button>
  );
}

function ShareButton({ postId }: { postId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/news#${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
      style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
      title="Copy link"
    >
      <span className="text-lg">{copied ? '✓' : '↗'}</span>
    </button>
  );
}

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main
      className="relative bg-cover bg-center bg-fixed min-h-screen"
      style={{
        backgroundImage: 'url(/Background%20Storm.PNG)',
      }}
    >
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <div className="relative z-10 pt-10 sm:pt-14 md:pt-16 pb-16">
        <section className="px-4 sm:px-6 mb-14 sm:mb-16">
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
              NEWS
            </h1>

            {loading ? (
              <div className="text-center font-arial-rounded font-bold">Loading news...</div>
            ) : posts.length === 0 ? (
              <div className="text-center font-arial-rounded font-bold text-gray-600">
                No news posts yet. Check back soon!
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article key={post.id} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                    <div className="text-sm text-gray-500 mb-2 text-center" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
                      {formatDate(post.createdAt)} • Posted by {post.authorName}
                    </div>
                    <h2 className="font-lovely text-xl sm:text-2xl leading-tight tracking-wide mb-3 text-center">
                      {post.title}
                    </h2>
                    <div 
                      className="leading-relaxed text-center mb-4 whitespace-pre-wrap" 
                      style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
                    >
                      {post.content}
                    </div>
                    <div className="flex justify-center gap-2">
                      <LikeButton postId={post.id} initialCount={post._count.likes} />
                      <ShareButton postId={post.id} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
