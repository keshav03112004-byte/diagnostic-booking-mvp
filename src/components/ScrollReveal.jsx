import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Lightweight scroll-in reveal for homepage sections.
 * Respects prefers-reduced-motion.
 */
export default function ScrollReveal({
  children,
  className = '',
  as = 'div',
  delay = 0,
  y = 28,
  once = true,
  amount = 0.18,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (reduceMotion) {
    const Tag = as === 'div' || as === 'section' || as === 'header' || as === 'article' ? as : 'div';
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  );
}
