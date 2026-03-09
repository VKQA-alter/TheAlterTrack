import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually read .env.local
let env = {};
try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    env = Object.fromEntries(
        envFile.split('\n')
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const parts = line.split('=');
                if (parts.length < 2) return [parts[0].trim(), ''];
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                return [key, value];
            })
    );
} catch (e) {
    console.error('Error reading .env.local:', e.message);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getProfiles() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

getProfiles();
