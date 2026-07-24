import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="logo">
      <span className="logo-icon-wrap">
        <motion.span
          className="logo-icon"
          animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Plane size={size} strokeWidth={1.75} />
        </motion.span>
      </span>
      <span className="logo-text">
        Nova<span className="logo-accent">Rota</span>
      </span>
    </div>
  );
}
