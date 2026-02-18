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

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching projects:');
            console.error(JSON.stringify(error, null, 2));
        } else {
            console.log('Connection successful!');
            console.log('Projects data:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
