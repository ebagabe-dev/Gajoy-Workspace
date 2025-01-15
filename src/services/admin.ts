import { supabase } from "src/boot/supabase";
import type { SuperAdmin } from "src/types/admin";

export const adminService = {
    async validateAccessCode(code: string) {
        const { data, error } = await supabase
            .from('super_admins')
            .select('*')
            .eq('access_code', code)
            .single()

        if (error) throw error;
        return data as SuperAdmin;
    }
}