-- Projects table for the portfolio bento grid.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  kicker      text not null default '',
  description text not null default '',
  tags        text[] not null default '{}',
  date        text not null default '',
  theme       text not null default 'blue',   -- blue | emerald | violet | rose | amber | slate
  pattern     text not null default 'grid',   -- grid | dots | lines | noise | circuit
  size        text not null default 'medium', -- featured | wide | medium
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Public, read-only access for the live site (anon key).
alter table public.projects enable row level security;

drop policy if exists "public read projects" on public.projects;
create policy "public read projects"
  on public.projects
  for select
  using (true);

-- Writes are performed server-side with the service-role key, which bypasses
-- RLS, so no insert/update/delete policy is needed for anon.

-- Optional: seed with the current defaults.
insert into public.projects (title, kicker, description, tags, date, theme, pattern, size, sort_order)
values
  ('Hybrid P2P — CDN', 'featured · 2025',
   'A peer-to-peer + CDN architecture that lets clients dynamically share content segments to slash server load and improve fault tolerance.',
   array['Go','Docker','Redis','PostgreSQL','Graph Algorithms'], 'Sep – Nov 2025', 'blue', 'circuit', 'featured', 0),
  ('Sourceasy.ai', 'internship',
   'India''s first AI-powered B2B chemical sourcing platform — WhatsApp AI agent + Pinecone supplier matching.',
   array['React','Python','Pinecone','Twilio'], 'May – Jul 2025', 'emerald', 'dots', 'medium', 1),
  ('Digivote', 'coursework',
   'Decentralized voting over a hybrid blockchain — Tendermint ABCI + Ethereum smart contracts with DPoS.',
   array['Go','Solidity','Ethereum','Bubble Tea'], 'Jan – Apr 2025', 'violet', 'grid', 'medium', 2),
  ('Read.AI', 'side project',
   'Context-aware study assistant. PDFs → vector embeddings → Q&A with LLAMA + auto-generated flashcards and quizzes.',
   array['React','Node.js','LLAMA','Vector DB'], 'Oct 2024 – Jan 2025', 'rose', 'noise', 'wide', 3),
  ('Vehicle Stop Classifier', 'research',
   'ML pipeline classifying vehicle behaviour at intersections from aerial trajectory data — Random Forest, K-Means, HMM.',
   array['Python','scikit-learn','HMM'], 'Jan – Apr 2025', 'amber', 'lines', 'wide', 4),
  ('Advanced AES', 'systems',
   'Full AES in C++ — 128/192/256-bit keys, ECB/CBC/CTR, thread-safe key generation.',
   array['C++','STL','Threading'], 'Aug – Nov 2023', 'slate', 'grid', 'medium', 5)
on conflict do nothing;
