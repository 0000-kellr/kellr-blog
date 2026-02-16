#!/usr/bin/env node
/**
 * Add a task to Michael's Notion Tasks DB as Inbox item.
 * Reads token from: secrets/notion_token.txt (workspace-relative)
 * Usage:
 *   node scripts/notion-add-inbox-task.mjs "Blumen kaufen"
 */

import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE = process.cwd();
const tokenPath = path.join(WORKSPACE, 'secrets', 'notion_token.txt');

const taskTitle = process.argv.slice(2).join(' ').trim();
if (!taskTitle) {
  console.error('Missing task title. Example: node scripts/notion-add-inbox-task.mjs "Blumen kaufen"');
  process.exit(2);
}

if (!fs.existsSync(tokenPath)) {
  console.error(`Missing Notion token file at ${tokenPath}`);
  process.exit(2);
}

const token = fs.readFileSync(tokenPath, 'utf8').trim();
if (!token) {
  console.error('Notion token file is empty.');
  process.exit(2);
}

// From TOOLS.md
const TASKS_DB_ID = '31645ea5-eae3-4792-b4d9-5f0e7115fd44';

const NOTION_VERSION = '2022-06-28';

const body = {
  parent: { database_id: TASKS_DB_ID },
  properties: {
    'Task Name': { title: [{ text: { content: taskTitle } }] },
    // Inbox rule: Status = "To Plan" and no Project relation set
    'Status': { status: { name: 'To Plan' } }
  }
};

const res = await fetch('https://api.notion.com/v1/pages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

const text = await res.text();
let json;
try { json = JSON.parse(text); } catch { json = null; }

if (!res.ok) {
  console.error('Notion API error:', res.status, res.statusText);
  console.error(json ?? text);
  process.exit(1);
}

console.log('OK');
console.log('id:', json.id);
console.log('url:', json.url);
