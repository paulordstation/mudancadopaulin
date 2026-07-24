-- Rode este script no SQL Editor do Supabase para atualizar um banco que já
-- rodou o supabase/schema.sql original (com a categoria "Documentação" dentro de "casa").
-- Ele separa a Documentação em sua própria seção/aba e permite o novo valor de "section".

alter table checklist_items drop constraint if exists checklist_items_section_check;
alter table checklist_items
  add constraint checklist_items_section_check
  check (section in ('viagem', 'gastos_fixos', 'casa', 'documentacao'));

update checklist_items
set section = 'documentacao'
where section = 'casa' and category = 'Documentação';
