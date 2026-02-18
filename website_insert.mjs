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

async function testWebsiteInsert() {
    console.log('Testing project insertion with platform: WEBSITE...');

    const newProj = {
        id: `test-w-${Date.now()}`,
        key: 'WEB',
        name: 'Test Project Website',
        description: 'Testing if WEBSITE platform still works',
        logo: '',
        visibility: 'PRIVATE',
        platform: 'WEBSITE',
        statuses: [],
        modules: [],
        labels: [],
        members: []
    };

    const { error } = await supabase.from('projects').insert([newProj]);

    if (error) {
        console.error('FAILED to insert project:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS: Project with WEBSITE platform inserted successfully.');
        // Clean up
        await supabase.from('projects').delete().eq('id', newProj.id);
    }
}

testWebsiteInsert();
