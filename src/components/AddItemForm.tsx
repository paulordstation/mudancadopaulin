import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import type { NewChecklistItem, SectionKey } from '../types';

interface AddItemFormProps {
  section: SectionKey;
  categories: string[];
  showValue?: boolean;
  onAdd: (item: NewChecklistItem) => Promise<void> | void;
}

const CUSTOM_CATEGORY = '__custom__';

export function AddItemForm({ section, categories, showValue = true, onAdd }: AddItemFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState(categories[0] ?? CUSTOM_CATEGORY);
  const [customCategory, setCustomCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const usingCustomCategory = category === CUSTOM_CATEGORY;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalCategory = (usingCustomCategory ? customCategory : category).trim();
    const parsedValue = Number(value.replace(',', '.')) || 0;
    if (!name.trim() || !finalCategory) return;

    setSubmitting(true);
    await onAdd({ section, name: name.trim(), estimated_value: parsedValue, category: finalCategory });
    setSubmitting(false);
    setName('');
    setValue('');
    setCustomCategory('');
    setOpen(false);
  }

  return (
    <div className="add-item">
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            className="add-item-trigger"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Plus size={18} strokeWidth={2} />
            Adicionar item
          </motion.button>
        ) : (
          <motion.form
            key="form"
            className="add-item-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`add-item-fields ${showValue ? '' : 'no-value'}`}>
              <input
                placeholder="Nome do item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {showValue && (
                <input
                  placeholder="Valor (R$)"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={CUSTOM_CATEGORY}>Nova categoria...</option>
              </select>
              {usingCustomCategory && (
                <input
                  placeholder="Nome da categoria"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="add-item-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                <X size={16} /> Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar item'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
