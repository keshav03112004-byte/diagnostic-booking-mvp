import { useEffect, useRef } from 'react';
import { mediaUrl } from '../api/api';
import '../components/HeroVideoBackground.css';

export default function HeroVideoBackground({ video }) {
  let src = mediaUrl(video?.src);
  if (!src || src.includes('nurse-test.mp4') || src.includes('mixkit.co')) {
    src = '/videos/hero-health.mp4';
  }
  const poster = mediaUrl(video?.poster);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay was prevented or failed to start:', err);
      });
    }
  }, [src]);

  if (!src) return null;

  return (
    <div className="hero-video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        className="hero-video"
      />
      <div className="hero-video-overlay hero-video-overlay-main" />
      <div className="hero-video-overlay hero-video-overlay-side" />
      <div className="hero-video-glow hero-video-glow-green" />
      <div className="hero-video-glow hero-video-glow-blue" />
    </div>
  );
}
