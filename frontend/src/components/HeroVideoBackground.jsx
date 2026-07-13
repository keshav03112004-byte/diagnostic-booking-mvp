import { mediaUrl } from '../api/api';
import '../components/HeroVideoBackground.css';

export default function HeroVideoBackground({ video }) {
  const src = mediaUrl(video?.src);
  const poster = mediaUrl(video?.poster);

  if (!src) return null;

  return (
    <div className="hero-video-wrap" aria-hidden="true">
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        className="hero-video"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="hero-video-overlay hero-video-overlay-main" />
      <div className="hero-video-overlay hero-video-overlay-side" />
      <div className="hero-video-glow hero-video-glow-indigo" />
      <div className="hero-video-glow hero-video-glow-coral" />
    </div>
  );
}
