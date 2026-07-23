export type SectionKey = 'viagem' | 'gastos_fixos' | 'casa';

export interface ChecklistItem {
  id: string;
  section: SectionKey;
  category: string;
  name: string;
  estimated_value: number;
  is_checked: boolean;
  created_at: string;
}

export type NewChecklistItem = Pick<
  ChecklistItem,
  'section' | 'category' | 'name' | 'estimated_value'
>;
