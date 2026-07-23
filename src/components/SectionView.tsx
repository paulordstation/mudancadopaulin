import { AnimatePresence, motion } from 'framer-motion';
import type { ChecklistItem, NewChecklistItem, SectionKey } from '../types';
import { ChecklistItemRow } from './ChecklistItemRow';
import { AddItemForm } from './AddItemForm';
import { ProgressBar } from './ProgressBar';
import { formatCurrency } from '../utils/format';

interface SectionViewProps {
  sectionKey: SectionKey;
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
  onToggle: (id: string, checked: boolean) => void;
  onUpdateValue: (id: string, value: number) => void;
  onDelete: (id: string) => void;
  onAdd: (item: NewChecklistItem) => Promise<void> | void;
}

export function SectionView({
  sectionKey,
  title,
  subtitle,
  items,
  onToggle,
  onUpdateValue,
  onDelete,
  onAdd,
}: SectionViewProps) {
  const total = items.reduce((sum, item) => sum + item.estimated_value, 0);
  const checkedCount = items.filter((item) => item.is_checked).length;
  const percent = items.length ? (checkedCount / items.length) * 100 : 0;

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const grouped = categories.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  }));

  return (
    <motion.section
      className="section-view"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <header className="section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-total">
          <span className="section-total-label">Total da seção</span>
          <span className="section-total-value">{formatCurrency(total)}</span>
        </div>
      </header>

      <div className="section-progress">
        <ProgressBar percent={percent} />
        <span className="progress-label">
          {checkedCount}/{items.length} concluídos · {Math.round(percent)}%
        </span>
      </div>

      {grouped.map(({ category, items: catItems }) => (
        <div key={category} className="category-group">
          <h3 className="category-title">{category}</h3>
          <ul className="item-list">
            <AnimatePresence initial={false}>
              {catItems.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onUpdateValue={onUpdateValue}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      ))}

      <AddItemForm
        section={sectionKey}
        categories={categories.length ? categories : ['Geral']}
        onAdd={onAdd}
      />
    </motion.section>
  );
}
