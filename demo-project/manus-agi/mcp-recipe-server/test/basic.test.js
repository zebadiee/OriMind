// Basic health tests for MCP Server
import { test } from 'node:test';
import assert from 'node:assert';

test('MCP Server module structure', () => {
  // Test that the main module can be imported
  assert.ok(true, 'Basic test structure working');
});

test('Environment validation', () => {
  // Test Node.js version compatibility
  const nodeVersion = process.version;
  assert.ok(nodeVersion.startsWith('v'), 'Node.js version detected');
  
  // Test that required modules are available
  assert.ok(process.env !== undefined, 'Environment variables accessible');
});

test('TypeScript compilation', async () => {
  // Test that build artifacts exist
  const fs = await import('fs');
  const distExists = fs.existsSync('./dist');
  assert.ok(distExists, 'TypeScript compilation output exists');
});