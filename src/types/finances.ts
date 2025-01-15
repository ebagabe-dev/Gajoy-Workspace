export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
}

export interface Finance extends NewFinance {
  id: number;
  created_at: string;
  categories: Category;
  clients: Client;
}

export interface NewFinance {
  title: string;
  category_id: number | null;
  status: 'Em andamento' | 'Concluído';
  start_date: string;
  end_date: string | null;
  value: number;
  client_id: number | null;
  type: 'Receita' | 'Despesa';
}


