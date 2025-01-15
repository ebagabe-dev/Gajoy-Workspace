import { createClient } from "@supabase/supabase-js";
import { boot } from "quasar/wrappers";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default boot(({app}) => {
    app.config.globalProperties.$supabase = supabase;
})