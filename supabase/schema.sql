-- Rode este script uma vez no SQL Editor do seu projeto Supabase
-- (https://supabase.com/dashboard/project/_/sql/new)

create extension if not exists "pgcrypto";

create table if not exists checklist_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('viagem', 'gastos_fixos', 'casa', 'documentacao')),
  category text not null,
  name text not null,
  estimated_value numeric(12,2) not null default 0,
  is_checked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table checklist_items enable row level security;

-- App pessoal sem tela de login: libera CRUD para a chave anon.
-- Se no futuro adicionar autenticação, troque estas políticas por regras por usuário/dono.
create policy "public read" on checklist_items for select using (true);
create policy "public insert" on checklist_items for insert with check (true);
create policy "public update" on checklist_items for update using (true) with check (true);
create policy "public delete" on checklist_items for delete using (true);

insert into checklist_items (section, category, name, estimated_value) values
-- Viagem (04/10)
('viagem', 'Transporte', 'Passagem aérea', 656),
('viagem', 'Transporte', 'Frete do carro', 1900),
('viagem', 'Bagagem', 'Bagagem extra', 200),

-- Gastos fixos mensais
('gastos_fixos', 'Moradia', 'Aluguel', 1050),
('gastos_fixos', 'Serviços', 'Internet', 100),
('gastos_fixos', 'Serviços', 'Energia elétrica', 150),
('gastos_fixos', 'Serviços', 'Celular', 50),
('gastos_fixos', 'Serviços', 'Streaming', 50),
('gastos_fixos', 'Alimentação', 'Alimentação', 700),

-- Checklist da casa — Eletrodomésticos
('casa', 'Eletrodomésticos', 'Geladeira', 2900),
('casa', 'Eletrodomésticos', 'Fogão', 1250),
('casa', 'Eletrodomésticos', 'Micro-ondas', 500),
('casa', 'Eletrodomésticos', 'Máquina de lavar', 1850),
('casa', 'Eletrodomésticos', 'Filtro de água', 325),
('casa', 'Eletrodomésticos', 'Ferro de passar', 140),

-- Checklist da casa — Móveis
('casa', 'Móveis', 'Cama + colchão', 2100),
('casa', 'Móveis', 'Guarda-roupa', 1650),
('casa', 'Móveis', 'Sofá', 2000),
('casa', 'Móveis', 'Mesa + cadeiras', 1650),
('casa', 'Móveis', 'Rack/estante TV', 600),
('casa', 'Móveis', 'Escrivaninha', 700),
('casa', 'Móveis', 'Cadeira de escritório', 600),
('casa', 'Móveis', 'Prateleiras', 325),

-- Checklist da casa — Cozinha / utensílios
('casa', 'Cozinha / Utensílios', 'Jogo de panelas', 550),
('casa', 'Cozinha / Utensílios', 'Talheres', 200),
('casa', 'Cozinha / Utensílios', 'Pratos, copos, xícaras', 275),
('casa', 'Cozinha / Utensílios', 'Facas e utensílios', 200),
('casa', 'Cozinha / Utensílios', 'Liquidificador', 275),
('casa', 'Cozinha / Utensílios', 'Cafeteira', 250),
('casa', 'Cozinha / Utensílios', 'Lixeira', 100),
('casa', 'Cozinha / Utensílios', 'Potes', 140),

-- Checklist da casa — Banheiro / área de serviço
('casa', 'Banheiro / Área de Serviço', 'Toalhas', 275),
('casa', 'Banheiro / Área de Serviço', 'Tapete', 100),
('casa', 'Banheiro / Área de Serviço', 'Cesto de roupa suja', 100),
('casa', 'Banheiro / Área de Serviço', 'Varal', 200),
('casa', 'Banheiro / Área de Serviço', 'Vassoura, rodo, pá', 115),
('casa', 'Banheiro / Área de Serviço', 'Produtos de limpeza', 150),

-- Checklist da casa — Quarto / diversos
('casa', 'Quarto / Diversos', 'Jogo de cama', 275),
('casa', 'Quarto / Diversos', 'Travesseiros', 140),
('casa', 'Quarto / Diversos', 'Cortinas', 275),
('casa', 'Quarto / Diversos', 'Luminárias', 200),
('casa', 'Quarto / Diversos', 'Cabides', 75),

-- Documentação (aba própria, sem valores/custo — apenas tarefas)
('documentacao', 'Documentação', 'CNH — atualizar endereço', 0),
('documentacao', 'Documentação', 'Título de eleitor — transferência de domicílio', 0),
('documentacao', 'Documentação', 'Banco — atualizar endereço', 0),
('documentacao', 'Documentação', 'Contrato de aluguel assinado', 0),
('documentacao', 'Documentação', 'Vistoria de entrada', 0),
('documentacao', 'Documentação', 'Internet — agendar instalação', 0),
('documentacao', 'Documentação', 'Plano de saúde — transferir/contratar', 0);
