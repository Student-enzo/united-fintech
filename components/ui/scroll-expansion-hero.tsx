'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const textWrapRef  = useRef<HTMLDivElement>(null);
  const span1Ref     = useRef<HTMLSpanElement>(null);
  const span2Ref     = useRef<HTMLSpanElement>(null);
  const date1Ref     = useRef<HTMLSpanElement>(null);
  const date2Ref     = useRef<HTMLSpanElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const firstHalf  = title ? title.split(' ').slice(0, 3).join(' ') : '';
  const secondHalf = title ? title.split(' ').slice(3).join(' ')    : '';

  const videoId = mediaSrc.includes('watch?v=') ? mediaSrc.split('v=')[1]?.split('&')[0] : null;
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&muted=1&playsinline=1&loop=1&controls=0&rel=0&playlist=${videoId}`
    : mediaSrc;

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current) return;
      const mob        = window.innerWidth < 768;
      const rect       = wrapperRef.current.getBoundingClientRect();
      const scrollable = wrapperRef.current.offsetHeight - window.innerHeight;
      const p          = Math.max(0, Math.min(1, -rect.top / scrollable));

      // Frame dimensions
      const fw = 320 + p * (mob ? 480 : 1100);
      const fh = mob ? 240 + p * 200 : 400 + p * 380;
      const br = Math.max(4, 20 - p * 20);
      const drift    = p * (mob ? 5 : 18);
      const fontSize = mob ? `clamp(2rem,7vw,3rem)` : `clamp(3rem,8vw,7rem)`;

      if (frameRef.current) {
        const el = frameRef.current;
        el.style.width        = `${fw}px`;
        el.style.height       = `${fh}px`;
        el.style.borderRadius = `${br}px`;
      }
      if (overlayRef.current) {
        overlayRef.current.style.background = `rgba(0,0,0,${Math.max(0, 0.35 - p * 0.35)})`;
      }
      if (bgRef.current) {
        bgRef.current.style.opacity = String(Math.max(0, 1 - p * 1.25));
      }

      const showContent = p >= 0.88;

      if (textWrapRef.current) {
        textWrapRef.current.style.opacity    = showContent ? '0' : '1';
        textWrapRef.current.style.visibility = showContent ? 'hidden' : 'visible';
      }
      if (span1Ref.current) {
        span1Ref.current.style.transform = `translateX(-${drift}vw)`;
        span1Ref.current.style.fontSize  = fontSize;
      }
      if (span2Ref.current) {
        span2Ref.current.style.transform = `translateX(${drift}vw)`;
        span2Ref.current.style.fontSize  = fontSize;
      }
      if (date1Ref.current) date1Ref.current.style.transform = `translateX(-${drift * 0.55}vw)`;
      if (date2Ref.current) date2Ref.current.style.transform = `translateX(${drift * 0.55}vw)`;

      if (contentRef.current) {
        contentRef.current.style.opacity    = showContent ? '1' : '0';
        contentRef.current.style.visibility = showContent ? 'visible' : 'hidden';
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [embedSrc]);

  return (
    <div ref={wrapperRef} style={{ height: 'var(--scroll-expand-height)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#161616',
          willChange: 'transform',
        }}
      >
        {/* Background image — fades as frame expands */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            willChange: 'opacity',
            transition: 'none',
          }}
        >
          <Image
            src={bgImageSrc}
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
        </div>

        {/* Expanding media frame */}
        <div
          ref={frameRef}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '320px', height: '400px',
            maxWidth: '95vw', maxHeight: '88vh',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 60px rgba(0,0,0,0.65)',
            zIndex: 1,
            willChange: 'width, height, border-radius',
            backfaceVisibility: 'hidden',
          }}
        >
          {mediaType === 'image' ? (
            <Image src={mediaSrc} alt={title || ''} fill style={{ objectFit: 'cover' }} />
          ) : (
            <iframe
              src={embedSrc}
              title={title || 'United Fintech video'}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                border: 0, display: 'block',
              }}
            />
          )}
          <div
            ref={overlayRef}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.35)',
              pointerEvents: 'none',
              willChange: 'background',
            }}
          />
        </div>

        {/* Title — drifts apart as frame expands */}
        <div
          ref={textWrapRef}
          className={textBlend ? 'mix-blend-difference' : ''}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            pointerEvents: 'none',
            width: '100%',
            textAlign: 'center',
            opacity: 1,
            transition: 'opacity 0.35s ease, visibility 0.35s ease',
            willChange: 'opacity',
          }}
        >
          <span
            ref={span1Ref}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3rem,8vw,7rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 2px 28px rgba(0,0,0,0.75)',
              willChange: 'transform',
              maxWidth: '90vw',
              wordBreak: 'keep-all',
            }}
          >
            {firstHalf}
          </span>
          <span
            ref={span2Ref}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3rem,8vw,7rem)',
              fontWeight: 300,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#2BB8E6',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 2px 28px rgba(43,184,230,0.30)',
              willChange: 'transform',
              maxWidth: '90vw',
              wordBreak: 'keep-all',
            }}
          >
            {secondHalf}
          </span>

          {(date || scrollToExpand) && (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.875rem', alignItems: 'center' }}>
              {date && (
                <span
                  ref={date1Ref}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(43,184,230,0.85)',
                    display: 'block',
                    textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                    willChange: 'transform',
                  }}
                >
                  {date}
                </span>
              )}
              {scrollToExpand && (
                <span
                  ref={date2Ref}
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'rgba(240,237,232,0.55)',
                    display: 'block',
                    textTransform: 'uppercase',
                    willChange: 'transform',
                  }}
                >
                  {scrollToExpand}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content — revealed when fully expanded */}
        <div
          ref={contentRef}
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            padding: '2rem 1.5rem',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.5s ease, visibility 0.5s ease',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
