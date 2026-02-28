import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually read .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(part => part.trim()))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDesktopInsert() {
    console.log('Testing project insertion with platform: DESKTOP...');

    const newProj = {
        id: `test-p-${Date.now()}`,
        key: 'TST',
        name: 'Test Project Desktop',
        description: 'Testing if DESKTOP platform works',
        logo: '',
        visibility: 'PRIVATE',
        platform: 'DESKTOP',
        statuses: [],
        modules: [],
        labels: [],
        members: []
    };

    const { error } = await supabase.from('projects').insert([newProj]);

    if (error) {
        console.error('FAILED to insert project with DESKTOP platform:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS: Project with DESKTOP platform inserted successfully.');
        // Clean up
        await supabase.from('projects').delete().eq('id', newProj.id);
    }
}

testDesktopInsert();
