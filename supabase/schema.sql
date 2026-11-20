-- 메리메모 스키마. Supabase 대시보드 > SQL Editor 에 붙여 넣고 Run.
create extension if not exists pgcrypto;

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_name text not null check (char_length(owner_name) between 1 and 10),
  tree_style text not null check (tree_style in ('classic', 'knit', 'pixel', 'illust')),
  admin_token_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  ornament text not null check (ornament in ('ginger','reindeer','snowman','stocking','cane','bells','bauble','gift','star','mitten')),
  from_name text not null check (char_length(from_name) between 1 and 10),
  message text not null check (char_length(message) between 1 and 150),
  hidden boolean not null default false,
  reported boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists memos_board_created on public.memos (board_id, created_at);

-- 브라우저(anon 키)에서는 아무것도 읽고 쓸 수 없게 막아요.
-- 모든 읽기·쓰기는 서버(service_role 키)를 거치고, 편지 내용은 25일 0시 이후에만 서버가 내려줘요.
alter table public.boards enable row level security;
alter table public.memos enable row level security;
revoke all on public.boards from anon, authenticated;
revoke all on public.memos from anon, authenticated;
