import { Plane, Wallet, Home, ClipboardList } from 'lucide-react';
import type { ComponentType } from 'react';
import type { SectionKey } from '../types';

interface NavItem {
  key: SectionKey;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'viagem', label: 'Viagem', icon: Plane },
  { key: 'gastos_fixos', label: 'Gastos Fixos', icon: Wallet },
  { key: 'casa', label: 'Checklist da Casa', icon: Home },
  { key: 'documentacao', label: 'Documentação', icon: ClipboardList },
];

interface TopNavProps {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
}

export function TopNav({ active, onChange }: TopNavProps) {
  return (
    <nav className="top-nav" aria-label="Seções">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`top-nav-item top-nav-item--${key} ${active === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
          aria-current={active === key ? 'page' : undefined}
        >
          <Icon size={18} strokeWidth={1.75} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
