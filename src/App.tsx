import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { Sidebar } from './components/Sidebar';
import { SectionView } from './components/SectionView';
import { useChecklistItems } from './hooks/useChecklistItems';
import { formatCurrency } from './utils/format';
import type { SectionKey } from './types';

const SECTIONS: { key: SectionKey; title: string; subtitle?: string }[] = [
  { key: 'viagem', title: 'Viagem', subtitle: '04/10' },
  { key: 'gastos_fixos', title: 'Gastos Fixos Mensais' },
  { key: 'casa', title: 'Checklist da Casa' },
];

function App() {
  const [active, setActive] = useState<SectionKey>('viagem');
  const { loading, error, items, toggleChecked, updateValue, addItem, deleteItem, itemsBySection } =
    useChecklistItems();

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.estimated_value, 0),
    [items]
  );

  const activeMeta = SECTIONS.find((s) => s.key === active)!;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="grand-total">
          <span className="grand-total-label">Total geral estimado</span>
          <span className="grand-total-value">{formatCurrency(grandTotal)}</span>
        </div>
      </header>

      <div className="app-body">
        <Sidebar active={active} onChange={setActive} />

        <main className="content">
          {loading && <p className="state-msg">Carregando dados...</p>}
          {error && <p className="state-msg state-error">Erro ao carregar dados: {error}</p>}

          {!loading && !error && (
            <AnimatePresence mode="wait">
              <SectionView
                key={active}
                sectionKey={active}
                title={activeMeta.title}
                subtitle={activeMeta.subtitle}
                items={itemsBySection(active)}
                onToggle={toggleChecked}
                onUpdateValue={updateValue}
                onDelete={deleteItem}
                onAdd={addItem}
              />
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
