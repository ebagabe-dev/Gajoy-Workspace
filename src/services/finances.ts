import { supabase } from "src/boot/supabase";
import type { Finance } from "src/types/finances";

export const financeService = {
    async getFinances() {
        const { data, error } = await supabase
            .from('finances')
            .select(`
                 *,
                 categories(name),
                 clients(name)   
            `)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async addFinance(finance: Omit<Finance, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('finances')
            .insert(finance)
            .select()

        if (error) throw error

        return data[0]
    }
}