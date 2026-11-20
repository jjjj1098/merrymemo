import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { OrnamentKind, TreeStyle } from './ornaments';

export type Board = { id: string; slug: string; owner_name: string; tree_style: TreeStyle; admin_token_hash: string; created_at: string };
export type Memo = {
  id: string; board_id: string; ornament: OrnamentKind; from_name: string; message: string;
  hidden: boolean; reported: boolean; read_at: string | null; created_at: string;
};
/** 공개해도 되는 장식 정보 (편지 내용·보낸 이름 없음) */
export type PublicOrnament = { id: string; ornament: OrnamentKind };

export interface Store {
  createBoard(b: Omit<Board, 'id' | 'created_at'>): Promise<Board>;
  getBoard(slug: string): Promise<Board | null>;
  listOrnaments(boardId: string): Promise<PublicOrnament[]>;
  addMemo(m: Pick<Memo, 'board_id' | 'ornament' | 'from_name' | 'message'>): Promise<{ id: string; count: number }>;
  listMemos(boardId: string): Promise<Memo[]>;
  updateMemo(boardId: string, id: string, patch: Partial<Pick<Memo, 'hidden' | 'reported' | 'read_at'>>): Promise<boolean>;
  purgeAll(): Promise<number>;
}

/* ───────── Supabase (배포용) ───────── */
class SupabaseStore implements Store {
  db: SupabaseClient;
  constructor(url: string, key: string) {
    this.db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  async createBoard(b: Omit<Board, 'id' | 'created_at'>) {
    const { data, error } = await this.db.from('boards').insert(b).select().single();
    if (error) throw error;
    return data as Board;
  }
  async getBoard(slug: string) {
    const { data, error } = await this.db.from('boards').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return (data as Board) || null;
  }
  async listOrnaments(boardId: string) {
    const { data, error } = await this.db.from('memos').select('id, ornament').eq('board_id', boardId).eq('hidden', false).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as PublicOrnament[];
  }
  async addMemo(m: Pick<Memo, 'board_id' | 'ornament' | 'from_name' | 'message'>) {
    const { data, error } = await this.db.from('memos').insert(m).select('id').single();
    if (error) throw error;
    const { count } = await this.db.from('memos').select('id', { count: 'exact', head: true }).eq('board_id', m.board_id).eq('hidden', false);
    return { id: (data as { id: string }).id, count: count || 0 };
  }
  async listMemos(boardId: string) {
    const { data, error } = await this.db.from('memos').select('*').eq('board_id', boardId).eq('hidden', false).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as Memo[];
  }
  async updateMemo(boardId: string, id: string, patch: Partial<Pick<Memo, 'hidden' | 'reported' | 'read_at'>>) {
    const { data, error } = await this.db.from('memos').update(patch).eq('id', id).eq('board_id', boardId).select('id');
    if (error) throw error;
    return !!data?.length;
  }
  async purgeAll() {
    const { count } = await this.db.from('boards').select('id', { count: 'exact', head: true });
    const { error } = await this.db.from('boards').delete().not('id', 'is', null); // memos는 on delete cascade
    if (error) throw error;
    return count || 0;
  }
}

/* ───────── 로컬 파일 (개발·체험용) ───────── */
type DB = { boards: Board[]; memos: Memo[] };
const FILE = path.join(process.cwd(), '.data', 'db.json');
let lock: Promise<unknown> = Promise.resolve();
async function load(): Promise<DB> {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); } catch { return { boards: [], memos: [] }; }
}
async function save(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 1));
}
function tx<T>(fn: (db: DB) => T | Promise<T>, write = false): Promise<T> {
  const run = lock.then(async () => {
    const db = await load();
    const r = await fn(db);
    if (write) await save(db);
    return r;
  });
  lock = run.catch(() => undefined);
  return run;
}
class FileStore implements Store {
  createBoard(b: Omit<Board, 'id' | 'created_at'>) {
    return tx((db) => {
      const row: Board = { ...b, id: randomUUID(), created_at: new Date().toISOString() };
      db.boards.push(row);
      return row;
    }, true);
  }
  getBoard(slug: string) { return tx((db) => db.boards.find((b) => b.slug === slug) || null); }
  listOrnaments(boardId: string) {
    return tx((db) => db.memos.filter((m) => m.board_id === boardId && !m.hidden).map((m) => ({ id: m.id, ornament: m.ornament })));
  }
  addMemo(m: Pick<Memo, 'board_id' | 'ornament' | 'from_name' | 'message'>) {
    return tx((db) => {
      const row: Memo = { ...m, id: randomUUID(), hidden: false, reported: false, read_at: null, created_at: new Date().toISOString() };
      db.memos.push(row);
      return { id: row.id, count: db.memos.filter((x) => x.board_id === m.board_id && !x.hidden).length };
    }, true);
  }
  listMemos(boardId: string) { return tx((db) => db.memos.filter((m) => m.board_id === boardId && !m.hidden)); }
  updateMemo(boardId: string, id: string, patch: Partial<Pick<Memo, 'hidden' | 'reported' | 'read_at'>>) {
    return tx((db) => {
      const m = db.memos.find((x) => x.id === id && x.board_id === boardId);
      if (!m) return false;
      Object.assign(m, patch);
      return true;
    }, true);
  }
  purgeAll() {
    return tx((db) => { const n = db.boards.length; db.boards = []; db.memos = []; return n; }, true);
  }
}

let store: Store | null = null;
export function getStore(): Store {
  if (store) return store;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) store = new SupabaseStore(url, key);
  else if (process.env.VERCEL) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수를 설정해 주세요.');
  else store = new FileStore();
  return store;
}
export const usingLocalStore = () => !(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
