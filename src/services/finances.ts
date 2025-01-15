import { supabase } from 'src/boot/supabase'
import type { Finance, NewFinance } from 'src/types/finances'

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
  }
}
