const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Initializing database...');

try {
  // Remove existing database if it exists
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database');
  }

  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', timeout: 30000 });

  // Push database schema
  console.log('Creating database schema...');
  execSync('npx prisma db push', { stdio: 'inherit', timeout: 30000 });

  console.log('Database initialized successfully!');
} catch (error) {
  console.error('Error initializing database:', error.message);
  process.exit(1);
}