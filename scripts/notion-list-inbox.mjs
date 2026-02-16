#!/usr/bin/env node
/**
 * List Inbox tasks from Michael's Notion Tasks DB.
 * Inbox rule: Status = "To Plan" and Project relation is empty.
 * Token: secrets/notion_token.txt
 */

import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE = process.cwd();
const tokenPath = path.join(WORKSPACE, 'secrets', 'notion_token.txt');
const TASKS_DB_ID = '31645ea5-eae3-4792-b4d9-5f0e7115fd44';
const NOTION_VERSION = '2022-06-28';

if (!fs.existsSync(tokenPath)) {
  console.error(`Missing Notion token file at ${tokenPath}`);
  process.exit(2);
}
const token = fs.readFileSync(tokenPath, 'utf8').trim();
if (!token) {
  console.error('Notion token file is empty.');
  process.exit(2);
}

const url = `https://api.notion.com/v1/databases/${TASKS_DB_ID}/query`;

const filter = {
  and: [
    { property: 'Status', status: { equals: 'To Plan' } },
    { property: 'Project', relation: { is_empty: true } }
  ]
};

let results = [];
let cursor = undefined;

for (let i = 0; i < 10; i++) {
  const body = {
    page_size: 100,
    filter,
    start_cursor: cursor,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }]
  };
  if (!cursor) delete body.start_cursor;

  const res = await fetch(url, {
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

  results.push(...json.results);
  if (!json.has_more) break;
  cursor = json.next_cursor;
}

function getTitle(page) {
  const prop = page?.properties?.['Task Name'];
  const arr = prop?.title ?? [];
  const t = arr.map(x => x.plain_text).join('');
  return t || '(untitled)';
}

console.log(`Inbox count: ${results.length}`);
for (const p of results.slice(0, 30)) {
  console.log(`- ${getTitle(p)}`);
}
if (results.length > 30) console.log(`... (+${results.length - 30} more)`);
