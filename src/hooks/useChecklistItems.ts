import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { ChecklistItem, NewChecklistItem, SectionKey } from '../types';

export function useChecklistItems() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (!active) return;
      if (error) setError(error.message);
      else setItems(data ?? []);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const toggleChecked = useCallback(async (id: string, isChecked: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_checked: isChecked } : item))
    );
    const { error } = await supabase
      .from('checklist_items')
      .update({ is_checked: isChecked })
      .eq('id', id);
    if (error) setError(error.message);
  }, []);

  const updateValue = useCallback(async (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estimated_value: value } : item))
    );
    const { error } = await supabase
      .from('checklist_items')
      .update({ estimated_value: value })
      .eq('id', id);
    if (error) setError(error.message);
  }, []);

  const addItem = useCallback(async (newItem: NewChecklistItem) => {
    const { data, error } = await supabase
      .from('checklist_items')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    if (data) setItems((prev) => [...prev, data]);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    const { error } = await supabase.from('checklist_items').delete().eq('id', id);
    if (error) {
      setError(error.message);
      setItems(previous);
    }
  }, [items]);

  const itemsBySection = useCallback(
    (section: SectionKey) => items.filter((item) => item.section === section),
    [items]
  );

  return { items, loading, error, toggleChecked, updateValue, addItem, deleteItem, itemsBySection };
}
