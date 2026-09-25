'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ScreenRenderer } from '@/components/screens/ScreenRenderer';
import { SCREENS } from '@/lib/screens-data';
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react';

export default function ScreenPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const screenId = (params?.id as string) || '01';

  const currentIndex = SCREENS.findIndex((s) => s.id === screenId);
  const currentScreen = SCREENS[currentIndex] || SCREENS[0];
  const prevScreen = currentIndex > 0 ? SCREENS[currentIndex - 1] : null;
  const nextScreen = currentIndex < SCREENS.length - 1 ? SCREENS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background text-main flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <header className="border-b border-border bg-surface px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-secondary hover:text-heading transition"
          >
            <Home className="w-4 h-4 text-primary" />
            <span>Home</span>
          </Link>
          <span className="text-border">/</span>
          <span className="text-xs font-mono bg-surfaceElevated px-2 py-0.5 rounded border border-border text-primary font-bold">
            Screen #{currentScreen.id}
          </span>
          <span className="text-xs font-medium text-heading hidden sm:inline">
            {currentScreen.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {prevScreen && (
            <button
              onClick={() => router.push(`/screens/${prevScreen.id}`)}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Prev ({prevScreen.id})</span>
            </button>
          )}

          <select
            value={currentScreen.id}
            onChange={(e) => router.push(`/screens/${e.target.value}`)}
            className="input-field text-xs py-1.5 px-3 max-w-[200px]"
          >
            {SCREENS.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {s.title}
              </option>
            ))}
          </select>

          {nextScreen && (
            <button
              onClick={() => router.push(`/screens/${nextScreen.id}`)}
              className="btn-primary text-xs px-3 py-1.5 flex items-center space-x-1"
            >
              <span className="hidden md:inline">Next ({nextScreen.id})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Screen Preview Container */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {currentScreen.category} • {currentScreen.phaseName}
              </span>
              <h1 className="text-xl font-bold text-heading mt-0.5">
                {currentScreen.title}
              </h1>
              <p className="text-xs text-secondary mt-0.5">
                {currentScreen.description}
              </p>
            </div>
            {currentScreen.route && !currentScreen.route.startsWith('/screens') && (
              <Link
                href={currentScreen.route}
                className="btn-secondary text-xs px-3 py-1.5 hidden sm:flex items-center space-x-1.5 text-primary border-primary/30"
              >
                <span>Go to Live Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <ScreenRenderer
            screenId={currentScreen.id}
            onNavigate={(id) => router.push(`/screens/${id}`)}
          />
        </div>
      </main>
    </div>
  );
}
