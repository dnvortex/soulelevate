// Simple script to run the Supabase migration
const { execSync } = require('child_process');

console.log('Running Supabase migration...');
try {
  execSync('tsx server/migrate-to-supabase.ts', { stdio: 'inherit' });
  console.log('Migration completed.');
} catch (error) {
  console.error('Migration failed:', error.message);
}