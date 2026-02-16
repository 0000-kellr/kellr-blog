#!/usr/bin/env node
/**
 * quick.mjs — ultra-light local CLI helpers for Notion + Home Assistant
 *
 * Usage:
 *   node scripts/quick/quick.mjs notion done <alias>
 *   node scripts/quick/quick.mjs notion myday <alias> on|off
 *   node scripts/quick/quick.mjs ha light on <alias>
 */

import fs from 'node:fs';
import path from 'node:path';

const home = process.env.USERPROFILE;
const workspace = path.join(home, '.openclaw', 'workspace');

function readText(p) {
  return fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').trim();
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}

function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

const cfgPath = path.join(workspace, 'quick-actions.json');
if (!fs.existsSync(cfgPath)) die(`Missing ${cfgPath}`);
const cfg = readJson(cfgPath);

async function notionPatch(pageId, properties) {
  const tokenPath = path.join(workspace, 'secrets', 'notion_token.txt');
  const token = readText(tokenPath);

  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ properties })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    die(`Notion PATCH failed ${res.status}: ${txt}`);
  }
  return await res.json();
}

async function haCallService(domain, service, body) {
  const urlPath = path.join(workspace, 'secrets', 'ha_url.txt');
  const tokenPath = path.join(workspace, 'secrets', 'ha_token.txt');
  const url = readText(urlPath).replace(/\/+$/, '');
  const token = readText(tokenPath);

  const res = await fetch(`${url}/api/services/${domain}/${service}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    die(`HA service call failed ${res.status}: ${txt}`);
  }
  return await res.json().catch(() => null);
}

async function haWsList(type) {
  const urlPath = path.join(workspace, 'secrets', 'ha_url.txt');
  const tokenPath = path.join(workspace, 'secrets', 'ha_token.txt');
  const url = readText(urlPath).replace(/\/+$/, '');
  const token = readText(tokenPath);

  const wsUrl = url.startsWith('https://') ? 'wss://' + url.slice(8) : 'ws://' + url.slice(7);

  const ws = new WebSocket(`${wsUrl}/api/websocket`);
  let id = 1;

  function send(obj) {
    return new Promise((resolve, reject) => {
      const myId = id++;
      obj.id = myId;
      const handler = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'result' && msg.id === myId) {
            ws.removeEventListener('message', handler);
            resolve(msg);
          }
        } catch {}
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify(obj));
      setTimeout(() => reject(new Error('timeout')), 15000);
    });
  }

  const openPromise = new Promise((resolve, reject) => {
    ws.addEventListener('error', reject);
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'auth_required') {
        ws.send(JSON.stringify({ type: 'auth', access_token: token }));
      } else if (msg.type === 'auth_ok') {
        resolve();
      } else if (msg.type === 'auth_invalid') {
        reject(new Error('auth_invalid'));
      }
    });
  });

  await openPromise;
  const res = await send({ type });
  ws.close();
  if (!res.success) die(`HA WS ${type} failed (success=false)`);
  return res.result;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    die('Usage: node scripts/quick/quick.mjs <notion|ha> ...');
  }

  // --- NOTION ---
  if (args[0] === 'notion') {
    const sub = args[1];
    if (sub === 'done') {
      const alias = args[2];
      if (!alias) die('Usage: notion done <alias>');
      const item = cfg?.notion?.doneAliases?.[alias];
      if (!item) die(`Unknown alias: ${alias}`);
      const resp = await notionPatch(item.pageId, { Status: { status: { name: 'Done' } } });
      const title = (resp?.properties?.['Task Name']?.title ?? []).map(t => t.plain_text).join('') || item.title || alias;
      console.log(`UPDATED: ${title} -> Done`);
      return;
    }

    if (sub === 'myday') {
      const alias = args[2];
      const onoff = args[3];
      if (!alias || !onoff || !['on','off'].includes(onoff)) die('Usage: notion myday <alias> on|off');
      const item = cfg?.notion?.doneAliases?.[alias];
      if (!item) die(`Unknown alias: ${alias}`);
      const resp = await notionPatch(item.pageId, { MyDay: { checkbox: onoff === 'on' } });
      const title = (resp?.properties?.['Task Name']?.title ?? []).map(t => t.plain_text).join('') || item.title || alias;
      console.log(`UPDATED: ${title} -> MyDay=${onoff}`);
      return;
    }

    die('Unknown notion command. Try: notion done|myday');
  }

  // --- HOME ASSISTANT ---
  if (args[0] === 'ha') {
    const sub = args[1];
    if (sub === 'light' && args[2] === 'on') {
      const alias = args[3];
      if (!alias) die('Usage: ha light on <alias>');
      const item = cfg?.homeassistant?.lightAliases?.[alias];
      if (!item) die(`Unknown alias: ${alias}`);

      // Fast path: if ha_export construct exists, use it (no live WS calls)
      const constructPath = path.join(workspace, 'ha_export', 'construct.json');
      if (!fs.existsSync(constructPath)) die('Missing ha_export/construct.json (run HA export first)');
      const construct = readJson(constructPath);

      const areas = [];
      for (const f of (construct.floors ?? [])) areas.push(...(f.areas ?? []));
      areas.push(...(construct.areas_without_floor ?? []));

      const area = areas.find(a => a.name === item.areaName);
      if (!area) die(`Area not found: ${item.areaName}`);

      const lights = (area.entities ?? []).filter(e => e.domain === 'light' && !e.disabled_by && !e.hidden_by).map(e => e.entity_id);
      if (lights.length === 0) die(`No lights found in area ${item.areaName}`);

      await haCallService('light', 'turn_on', { entity_id: lights });
      console.log(`TURNED_ON: ${lights.join(', ')}`);
      return;
    }

    if (sub === 'export') {
      // quick registry dump via websocket
      const types = [
        ['areas', 'config/area_registry/list'],
        ['devices', 'config/device_registry/list'],
        ['entities', 'config/entity_registry/list'],
        ['labels', 'config/label_registry/list'],
        ['floors', 'config/floor_registry/list'],
      ];

      const outDir = path.join(workspace, 'ha_export');
      fs.mkdirSync(outDir, { recursive: true });

      for (const [name, type] of types) {
        const result = await haWsList(type);
        fs.writeFileSync(path.join(outDir, `${name}.ws.json`), JSON.stringify({ type: 'result', success: true, result }, null, 2));
        console.log(`OK ${name} (${Array.isArray(result) ? result.length : 1})`);
      }
      return;
    }

    die('Unknown ha command. Try: ha light on <alias>');
  }

  die('Unknown command root. Use: notion|ha');
}

main().catch(e => die(e?.stack ?? String(e)));
