'use client';

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTryOnStore } from '@/store/useTryOnStore';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

export function UploadZone() {
  const { session, error, submitTryOn, reset } = useTryOnStore();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      submitTryOn(file);
    },
    [submitTryOn]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const isActive = session.status === 'uploading' || session.status === 'processing';

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ── Upload Area / Preview ── */}
      <div
        onDrop={!isActive ? handleDrop : undefined}
        onDragOver={!isActive ? handleDragOver : undefined}
        onDragLeave={!isActive ? handleDragLeave : undefined}
        className={cn(
          'relative w-full max-w-[440px] aspect-[3/4] border-2 border-dashed',
          'flex flex-col items-center justify-center gap-4',
          'transition-all duration-500 cursor-pointer overflow-hidden',

          // State-based styles
          session.status === 'idle' && !isDragging && 'border-mono-border hover:border-mono-gold hover:bg-mono-gold/[0.02]',
          session.status === 'idle' && isDragging && 'border-mono-gold bg-mono-gold/[0.04] scale-[1.01]',
          (session.status === 'uploading' || session.status === 'processing') && 'border-mono-black border-solid',
          session.status === 'complete' && 'border-mono-gold/40 border-solid',
          session.status === 'error' && 'border-red-400 border-solid',
        )}
      >
        {/* ── Idle State ── */}
        {session.status === 'idle' && (
          <>
            <div className="w-16 h-16 flex items-center justify-center border border-mono-border rounded-full transition-colors duration-300 group-hover:border-mono-gold">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="text-mono-muted"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center px-6">
              <Typography variant="body" className="!text-[14px] mb-1">
                {isDragging ? 'Drop your photo' : 'Drag & drop your photo here'}
              </Typography>
              <Typography variant="caption" muted>
                or click to browse • JPG, PNG up to 10MB
              </Typography>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload photo for AI Try-On"
            />
          </>
        )}

        {/* ── Uploading State ── */}
        {session.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <Typography variant="body" className="!text-[14px] !text-white mb-1">
                Uploading your photo
              </Typography>
              <Typography variant="caption" className="!text-white/60">
                Please wait...
              </Typography>
            </div>
          </div>
        )}

        {/* ── Processing State — Show uploaded image with overlay ── */}
        {session.status === 'processing' && session.uploadedImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.uploadedImage}
              alt="Your uploaded photo"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
              {/* Animated rings */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
                <div className="absolute inset-[6px] border border-transparent border-t-mono-gold rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <div className="text-center">
                <Typography variant="body" className="!text-[14px] !text-white mb-1">
                  AI is analyzing your photo
                </Typography>
                <Typography variant="caption" className="!text-white/60">
                  Generating your personalized look...
                </Typography>
              </div>
              {/* Progress bar */}
              <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-mono-gold rounded-full animate-pulse"
                  style={{ width: '65%', transition: 'width 2s ease-out' }}
                />
              </div>
            </div>
          </>
        )}

        {/* ── Complete State — Show AI result image ── */}
        {session.status === 'complete' && session.resultImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.resultImage}
              alt="AI Try-On result"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col items-end justify-end p-6">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0F8A5F" strokeWidth="2">
                  <polyline points="4,10 8,14 16,6" />
                </svg>
                <span className="font-nav text-[10px] uppercase tracking-[0.12em] font-bold text-mono-black">
                  Try-On Ready
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── Error State ── */}
        {session.status === 'error' && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <Typography variant="caption" className="!text-red-400">
              {error ?? 'An error occurred. Please try again.'}
            </Typography>
            <Button variant="ghost" size="md" onClick={reset}>
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* ── Actions (complete state) ── */}
      {session.status === 'complete' && (
        <div className="flex flex-col items-center gap-3 w-full max-w-[440px]">
          <Divider />
          <div className="flex items-center gap-3 w-full">
            <Button variant="ghost" size="md" fullWidth onClick={reset}>
              Try Another Photo
            </Button>
            <Button variant="primary" size="md" fullWidth>
              Add to Bag
            </Button>
          </div>
        </div>
      )}

      {/* ── Step Indicators ── */}
      <div className="text-center max-w-[360px]">
        <div className="flex items-center justify-center gap-6 mb-4">
          {(['Upload Photo', 'AI Processing', 'See Result'] as const).map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-nav font-bold',
                (session.status === 'idle' && i === 0) ||
                (session.status === 'uploading' && i === 0) ||
                (session.status === 'processing' && i === 1) ||
                (session.status === 'complete' && i === 2)
                  ? 'bg-mono-black text-white'
                  : 'bg-mono-border text-mono-muted'
              )}>
                {i + 1}
              </span>
              <span className="font-nav text-[9px] uppercase tracking-[0.1em] font-bold text-mono-muted hidden sm:block">
                {step}
              </span>
            </div>
          ))}
        </div>
        <Typography variant="caption" muted>
          Upload a full-body photo and our AI will show you how MONO pieces
          look on you. Your photos are processed securely and never stored.
        </Typography>
      </div>
    </div>
  );
}
