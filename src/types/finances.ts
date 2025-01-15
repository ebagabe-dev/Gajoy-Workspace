export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  created_at: string;
}

// src/types/finance.ts
export interface Finance {
  id: number;
  title: string;
  category_id: number;
  status: 'Em andamento' | 'Concluído';
  start_date: string;
  end_date?: string;
  value: number;
  client_id: number;
  created_at: string;
  categories: { name: string };
  clients: { name: string };
}

export interface NewFinance {
  title: string;
  category_id: number | null;
  status: 'Em andamento' | 'Concluído';
  start_date: string;
  end_date: string | null;
  value: number;
  client_id: number | null;
}
