#!/usr/bin/env node

const readline = require('readline');
const db = require('./database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
╔══════════════════════════════════════════╗
║     GMC PANEL - Admin Account Creator    ║
╚══════════════════════════════════════════╝
`);

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const createAdmin = async () => {
  try {
    await db.initialize();

    const username = await askQuestion('Enter admin username: ');
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password: ');

    if (!username || !email || !password) {
      console.log('\n❌ All fields are required!');
      process.exit(1);
    }

    const userId = await db.createUser(username, email, password, 'admin');
    
    console.log('\n✅ Admin account created successfully!');
    console.log(`
📋 Account Details:
   Username: ${username}
   Email: ${email}
   Role: Admin
   User ID: ${userId}

🔐 You can now login at: http://localhost:3000/login
    `);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();