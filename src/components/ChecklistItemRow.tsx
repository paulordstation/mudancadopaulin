import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import type { ChecklistItem } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { formatCurrency } from '../utils/format';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string, checked: boolean) => void;
  onUpdateValue: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

export function ChecklistItemRow({ item, onToggle, onUpdateValue, onDelete }: ChecklistItemRowProps) {
  const [editingValue, setEditingValue] = useState(false);
  const [draftValue, setDraftValue] = useState(String(item.estimated_value));
  const [confirmOpen, setConfirmOpen] = useState(false);

  function commitValue() {
    const parsed = Number(draftValue.replace(',', '.'));
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onUpdateValue(item.id, parsed);
    } else {
      setDraftValue(String(item.estimated_value));
    }
    setEditingValue(false);
  }

  return (
    <motion.li
      className={`item-row ${item.is_checked ? 'is-checked' : ''}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        className="checkbox"
        role="checkbox"
        aria-checked={item.is_checked}
        aria-label={`Marcar ${item.name} como concluído`}
        onClick={() => onToggle(item.id, !item.is_checked)}
      >
        {item.is_checked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <Check size={14} strokeWidth={3} />
          </motion.span>
        )}
      </button>

      <div className="item-main">
        <span className="item-name">
          <motion.span
            className="item-name-text"
            animate={{ opacity: item.is_checked ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {item.name}
          </motion.span>
          <motion.span
            className="strike"
            initial={false}
            animate={{ scaleX: item.is_checked ? 1 : 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </span>
        <span className="item-category">{item.category}</span>
      </div>

      {editingValue ? (
        <input
          className="value-input"
          type="text"
          inputMode="decimal"
          autoFocus
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commitValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitValue();
            if (e.key === 'Escape') {
              setDraftValue(String(item.estimated_value));
              setEditingValue(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="value-display"
          onClick={() => {
            setDraftValue(String(item.estimated_value));
            setEditingValue(true);
          }}
        >
          {formatCurrency(item.estimated_value)}
        </button>
      )}

      <button
        type="button"
        className="delete-btn"
        aria-label={`Excluir ${item.name}`}
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 size={17} strokeWidth={1.75} />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir item?"
        description={`Isso vai remover "${item.name}" permanentemente.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(item.id);
        }}
      />
    </motion.li>
  );
}
