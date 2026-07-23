import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="dialog-card"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="dialog-icon">
              <AlertTriangle size={22} strokeWidth={1.75} />
            </div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            <div className="dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={onCancel}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
