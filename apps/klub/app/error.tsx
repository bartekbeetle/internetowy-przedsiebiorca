'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Coś poszło nie tak
          </h1>
          <p className="text-slate-400 leading-relaxed">
            {error.message || 'Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do głównej strony.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Spróbuj ponownie
          </Button>
          <Button
            onClick={() => window.location.href = '/feed'}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Wróć do feed
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 font-mono">
              Error digest: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
