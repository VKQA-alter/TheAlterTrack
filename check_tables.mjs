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
                return [parts[0].trim(), parts.slice(1).join('=').trim()];
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

async function checkTables() {
    const tables = ['projects', 'issues', 'users', 'sprints', 'profiles'];
    console.log('Checking for tables:', tables.join(', '));

    for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`[${table}] ERROR: ${error.message} (${error.code})`);
        } else {
            console.log(`[${table}] SUCCESS: Table found.`);
        }
    }
}

checkTables();
