#!/usr/bin/env node

/**
 * Generate secure random strings for JWT secrets
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('🔐 Generate JWT Secrets\n');
console.log('Copy these to your .env file:\n');
console.log(`JWT_ACCESS_SECRET="${generateSecret()}"`);
console.log(`JWT_REFRESH_SECRET="${generateSecret()}"`);
console.log('\n✅ Done! Keep these secrets secure and never commit them to git.');

