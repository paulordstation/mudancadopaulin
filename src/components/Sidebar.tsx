import { Plane, Wallet, Home } from 'lucide-react';
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
];

interface SidebarProps {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Seções">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`sidebar-item ${active === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
          aria-current={active === key ? 'page' : undefined}
        >
          <Icon size={20} strokeWidth={1.75} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
