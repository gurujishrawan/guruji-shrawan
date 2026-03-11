import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://xwhnmwkrnkftrlsnvdqd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aG5td2tybmtmdHJsc252ZHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDUzODIsImV4cCI6MjA4ODgyMTM4Mn0._2ejeXzzOflerDC2Shyz3QYVLI2tzr4fAtj_W7spNiU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
