import { motion } from 'framer-motion';

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
