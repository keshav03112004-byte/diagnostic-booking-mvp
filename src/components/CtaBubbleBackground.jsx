import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './CtaBubbleBackground.css';

const BUBBLE_SEED = [
  { x: 8, y: 72, size: 88, delay: 0, duration: 14, opacity: 0.2, depth: 28 },
  { x: 18, y: 28, size: 42, delay: 1.2, duration: 11, opacity: 0.3, depth: 18 },
  { x: 32, y: 58, size: 64, delay: 0.4, duration: 16, opacity: 0.16, depth: 24 },
  { x: 48, y: 18, size: 36, delay: 2.1, duration: 10, opacity: 0.34, depth: 14 },
  { x: 62, y: 68, size: 96, delay: 0.8, duration: 18, opacity: 0.14, depth: 32 },
  { x: 74, y: 36, size: 52, delay: 1.6, duration: 12, opacity: 0.26, depth: 20 },
  { x: 86, y: 78, size: 70, delay: 2.8, duration: 15, opacity: 0.18, depth: 26 },
  { x: 92, y: 22, size: 28, delay: 0.2, duration: 9, opacity: 0.36, depth: 12 },
  { x: 12, y: 12, size: 24, delay: 3.2, duration: 13, opacity: 0.28, depth: 10 },
  { x: 55, y: 42, size: 48, delay: 1.0, duration: 14, opacity: 0.22, depth: 22 },
  { x: 40, y: 82, size: 34, delay: 2.4, duration: 11, opacity: 0.24, depth: 16 },
  { x: 78, y: 12, size: 58, delay: 1.8, duration: 17, opacity: 0.15, depth: 30 },
];

export default function CtaBubbleBackground({ pointer = { x: 0.5, y: 0.5 } }) {
  const reduceMotion = useReducedMotion();
  const bubbles = useMemo(() => BUBBLE_SEED, []);

  return (
    <div className="cta-bubbles" aria-hidden="true">
      {bubbles.map((bubble, index) => {
        const offsetX = reduceMotion ? 0 : (pointer.x - 0.5) * -bubble.depth;
        const offsetY = reduceMotion ? 0 : (pointer.y - 0.5) * -bubble.depth * 0.85;

        return (
          <span
            key={index}
            className="cta-bubble"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              opacity: bubble.opacity,
            }}
          >
            <motion.span
              className="cta-bubble-motion"
              animate={{ x: offsetX, y: offsetY }}
              transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.5 }}
            >
              <span
                className="cta-bubble-orb"
                style={{
                  animationDuration: `${bubble.duration}s`,
                  animationDelay: `${bubble.delay}s`,
                  animationPlayState: reduceMotion ? 'paused' : 'running',
                }}
              />
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}
