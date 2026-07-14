import { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../api/api';
import '../components/HeroVideoBackground.css';

const LOCAL_HERO_VIDEO = '/videos/hero-health.mp4';

function resolveHeroSrc(videoSrc) {
  let src = mediaUrl(videoSrc);
  if (!src || src.includes('nurse-test.mp4') || src.includes('mixkit.co')) {
    return LOCAL_HERO_VIDEO;
  }
  return src;
}

export default function HeroVideoBackground({ video }) {
  const src = resolveHeroSrc(video?.src);
  const poster = mediaUrl(video?.poster);
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return undefined;

    setReady(false);
    setFailed(false);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.pause();
      return undefined;
    }

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;

    const tryPlay = () => {
      const playPromise = el.play();
      if (playPromise?.then) {
        playPromise.catch(() => {
          // Retry once after a short delay (common on flaky mobile networks)
          window.setTimeout(() => {
            el.play().catch(() => setFailed(true));
          }, 250);
        });
      }
    };

    const onCanPlay = () => {
      setReady(true);
      tryPlay();
    };

    const onError = () => setFailed(true);

    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('loadeddata', onCanPlay);
    el.addEventListener('error', onError);

    // Avoid forced reload loops; only nudge playback when enough data is buffered
    if (el.readyState >= 2) {
      onCanPlay();
    }

    return () => {
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('loadeddata', onCanPlay);
      el.removeEventListener('error', onError);
    };
  }, [src]);

  if (!src) return null;

  return (
    <div className={`hero-video-wrap${ready ? ' is-ready' : ''}${failed ? ' is-failed' : ''}`} aria-hidden="true">
      {poster ? (
        <div
          className="hero-video-poster"
          style={{ backgroundImage: `url(${poster})` }}
        />
      ) : null}
      {!failed ? (
        <video
          ref={videoRef}
          key={src}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster || undefined}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-video-overlay hero-video-overlay-main" />
      <div className="hero-video-overlay hero-video-overlay-side" />
      <div className="hero-video-glow hero-video-glow-green" />
      <div className="hero-video-glow hero-video-glow-blue" />
    </div>
  );
}
