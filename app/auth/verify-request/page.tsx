'use client';

import Card from '@/components/Card';

export default function VerifyRequestPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/IRC_background_1.jpeg')" }}
    >
      <div className="min-h-screen bg-black/60">
        <div className="relative z-10 flex justify-center items-center py-16 px-4">
          <Card className="max-w-md">
            <div className="text-center space-y-4">
              <h1 className="font-lovely text-xl sm:text-2xl text-gray-900">Check Your Email</h1>
              <p className="text-gray-600">
                We&apos;ve sent you a magic link and it will take a few minutes to appear in your inbox - thanks for your patience! Click the link in your email to sign in.
              </p>
              <p className="text-sm text-gray-500">
                If you don&apos;t see the email, check your spam folder.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}



