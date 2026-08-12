import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Aurora from './components/Aurora/Aurora';
import { Logo } from './components/Logo';
import { TopNav } from './components/TopNav';
import { SectionView } from './components/SectionView';
import { useChecklistItems } from './hooks/useChecklistItems';
import type { SectionKey } from './types';

const SECTIONS: { key: SectionKey; title: string; subtitle?: string }[] = [
  { key: 'viagem', title: 'Viagem', subtitle: '04/10' },
  { key: 'gastos_fixos', title: 'Gastos Fixos Mensais' },
  { key: 'casa', title: 'Checklist da Casa' },
  { key: 'documentacao', title: 'Documentação' },
];

function App() {
  const [active, setActive] = useState<SectionKey>('viagem');
  const { loading, error, toggleChecked, updateValue, addItem, deleteItem, itemsBySection } =
    useChecklistItems();

  const activeMeta = SECTIONS.find((s) => s.key === active)!;

  return (
    <div className="app-shell">
      <div className="aurora-backdrop">
        <Aurora colorStops={['#5227FF', '#b63ad9', '#5227FF']} amplitude={1} blend={0.5} />
      </div>

      <header className="topbar">
        <Logo />
      </header>

      <TopNav active={active} onChange={setActive} />

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
  );
}

export default App;
