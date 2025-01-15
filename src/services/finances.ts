import { supabase } from 'src/boot/supabase'
import type { Category, Client, Finance, NewFinance } from 'src/types/finances'

export const financeService = {
  async getFinances(): Promise<Finance[]> {
    const { data, error } = await supabase
      .from('finances')
      .select(`
        *,
        categories(name),
        clients(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Finance[]
  },

  async addFinance(newFinance: NewFinance): Promise<Finance> {
    const { data, error } = await supabase
      .from('finances')
      .insert(newFinance)
      .select(`
        *,
        categories(name),
        clients(name)
      `)
      .single()

    if (error) throw error
    return data as Finance
  },

  async updateFinance(financeId: number, finance: NewFinance) {
    console.log('TODO: adicionar logica para deletar', financeId, finance)
  },

  async deleteFinance(financeId: number) {
    console.log('TODO: adicionar logica para deletar', financeId)
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Category[]
  },

  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Client[]
  }
}
