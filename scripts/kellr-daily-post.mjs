/**
 * Kellr Daily Post – X + Facebook + Instagram
 * - Postet täglich auf allen 3 Kanälen
 * - Di + Fr: Veo 2 Video (Reel auf IG, Video auf FB, Foto auf X)
 * - Rest: Abwechselnd App Screenshots + Imagen 4 Bilder
 * - Seasonal Content (Ostern etc.)
 * - Content wird täglich frisch via Claude (claude-sonnet-4-5) generiert
 */
import { spawnSync } from 'child_process';
import { TwitterApi } from 'twitter-api-v2';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

const opExe = process.env.LOCALAPPDATA + '\\Microsoft\\WinGet\\Packages\\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\\op.exe';
const opEnv = { ...process.env, OP_SERVICE_ACCOUNT_TOKEN: readFileSync('secrets/op_service_account_token.txt', 'utf8').trim() };

function opRead(item, field) {
  const r = spawnSync(opExe, ['item', 'get', item, '--vault', 'groot', '--fields', `label=${field}`, '--reveal'], {
    stdio: ['ignore', 'pipe', 'pipe'], env: opEnv });
  return r.stdout.toString().trim();
}

// ─── Anthropic API Key laden ─────────────────────────────────────────────────
function loadAnthropicKey() {
  // Try various item/field combos (order: most specific first)
  // Try by UUID first (most reliable — avoids trailing-space issues in item titles)
  // UUID: ragsnkgijrq7renbipiyqjlrku = "anthropic cost control api Amin"
  const uuidCandidates = [
    ['cqqxatsr5imypggrjvpvhahomu', 'API'],  // Anthropic API Key Sub Agent Kellr Social Media
    ['ragsnkgijrq7renbipiyqjlrku', 'password'],
  ];
  for (const [item, field] of uuidCandidates) {
    try {
      const val = opRead(item, field);
      if (val && val.length > 10) return val;
    } catch { /* try next */ }
  }
  // Fallback: try by name variants
  const nameCandidates = [
    ['Anthropic API Key', 'credential'],
    ['Anthropic', 'credential'],
    ['Anthropic API Key', 'password'],
  ];
  for (const [item, field] of nameCandidates) {
    try {
      const val = opRead(item, field);
      if (val && val.length > 10) return val;
    } catch { /* try next */ }
  }
  // Fallback: env vars
  if (process.env.ANTHROPIC_API_KEY_KELLR_SOCIAL) return process.env.ANTHROPIC_API_KEY_KELLR_SOCIAL;
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  throw new Error('Anthropic API Key nicht gefunden – weder in 1Password noch als ANTHROPIC_API_KEY env var.');
}

// ─── Credentials ────────────────────────────────────────────────────────────
const X_ITEM    = '2kygrqd7nguhiseitxg6znldhu';
const FB_ITEM   = 'Kellr Social Media API';
const GH_ITEM   = 'uwmv5a3yo5ztoyv77jwfiilwze';

const xClient = new TwitterApi({
  appKey:       opRead(X_ITEM, 'Consumer Key'),
  appSecret:    opRead(X_ITEM, 'Secret Key'),
  accessToken:  opRead(X_ITEM, 'Access Token'),
  accessSecret: opRead(X_ITEM, 'Access Token Secret'),
});
const fbPageToken = opRead(FB_ITEM, 'Kellr Page Access Token');
const fbPageId    = '1011515808714434';
const igId        = '17841438133721668';
const githubToken = opRead(GH_ITEM, 'token');

// ─── App Screenshots (GitHub, public raw URLs) ──────────────────────────────
const SCREEN_BASE = 'https://raw.githubusercontent.com/0000-kellr/kellr-blog/main/Screens/';
const APP_SCREENS = [
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.27.27.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.29.34.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.29.39.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.29.45.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.29.50.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.29.54.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.30.03.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.30.16.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.30.26.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.06.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.15.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.19.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.22.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.27.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.30.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.33.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.38.png',
  'Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-03-08%20at%2015.31.42.png',
];
const LOGO_URL = 'https://raw.githubusercontent.com/0000-kellr/kellr-blog/main/assets/social/kellr-post-1774192544657.png';

// ─── Seasonal Content ────────────────────────────────────────────────────────
function getSeasonalOverride() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date  = now.getDate();

  if (month === 4 && date === 3) return { // Karfreitag
    text: `🥚 Karfreitag – der perfekte Tag um zu checken, was noch fehlt. Mit Kellr weißt du in 2 Minuten ob genug im Keller ist. 🍫\n\n#Karfreitag #Ostern #Vorratskammer #Kellr`,
    ig:   `🥚 Karfreitag – perfekt um zu checken was noch fehlt!\n\nMit Kellr weißt du in 2 Minuten ob der Vorrat fürs Osterwochenende reicht. 🍫\n\nLink in Bio 👆\n\n#Karfreitag #Ostern #Vorratskammer #Kellr #Haushalt`,
    imgPrompt: 'Easter shopping list with chocolate eggs and spring flowers on a kitchen counter, warm natural lighting, no text, square format, photorealistic',
    useScreen: false,
  };
  if (month === 4 && date === 5) return { // Ostersonntag
    text: `🐣 Frohe Ostern! Gut geplant feiern ist schöner. Mit Kellr weißt du schon am Karfreitag was noch fehlt. 🍫\n\n#Ostern #Vorratskammer #Kellr`,
    ig:   `🐣 Frohe Ostern!\n\nGut geplant feiern ist schöner. Mit Kellr weißt du schon am Karfreitag was noch fehlt. 🍫\n\nLink in Bio 👆\n\n#Ostern #Vorratskammer #Kellr #Haushalt`,
    imgPrompt: 'Easter basket with colorful eggs and chocolate on a wooden table, spring flowers, warm natural lighting, no text, square format, photorealistic',
    useScreen: false,
  };

  return null;
}

// ─── Claude Content Generation ───────────────────────────────────────────────

// Zielgruppe A: Mo / Mi / Fr → Familien & Alltag (humorvoll, warm)
// Zielgruppe B: Di / Do / Sa → Krisenvorsorge & Prepper (sachlich, ernst)
// Zielgruppe C: So           → Community / Behind the Scenes (neutral)
function getAudienceBlock(dayOfWeek) {
  // dayOfWeek: 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa
  const audienceA = [1, 3, 5]; // Mo, Mi, Fr
  const audienceB = [2, 4, 6]; // Di, Do, Sa

  if (audienceA.includes(dayOfWeek)) {
    return `ZIELGRUPPE HEUTE: A – Familien & Alltag
Ton: humorvoll, warm, nahbar, bodenständig
Themen: nie mehr doppelt kaufen, nie mehr wegwerfen, Haushalt im Griff, Alltagserleichterungen, relatable Momente
Stil: leicht, freundlich, mit einem Augenzwinkern — wie eine gute Freundin/ein guter Freund der tippt
WICHTIG: Kein Krisenvorsorge-Inhalt, kein Prepper-Vokabular in diesem Post.`;
  }
  if (audienceB.includes(dayOfWeek)) {
    return `ZIELGRUPPE HEUTE: B – Krisenvorsorge & Prepper
Ton: sachlich, ernst, kompetent, respektvoll
Themen: gut vorbereitet sein, Blackoutvorsorge, Notvorrat, Krisenresilienz, Selbstversorgung
Stil: informativ, direkt, glaubwürdig — wie ein Experte der erklärt, nicht predigt
WICHTIG: Kein Familien-Smalltalk, kein humoristischer Ton in diesem Post.`;
  }
  // Sonntag
  return `ZIELGRUPPE HEUTE: C – Community & Behind the Scenes
Ton: offen, einladend, authentisch
Themen: Community-Frage, User-Feedback einholen, Behind the Scenes der App, Was kommt als nächstes
Stil: gesprächig, neugierig — lädt zur Interaktion ein
WICHTIG: Neutral — passt für beide Zielgruppen A und B.`;
}

// Format-Rotation basierend auf Datum (deterministisch aber abwechslungsreich)
function getFormatHint(dateStr, dayOfWeek) {
  const daysSinceEpoch = Math.floor(Date.parse(dateStr) / 86400000);
  const audienceA = [1, 3, 5];
  const audienceB = [2, 4, 6];

  if (audienceA.includes(dayOfWeek)) {
    const formats = ['Tipp des Tages', 'Alltagssituation/Meme (relatable, humorvoll)', 'Feature-Spotlight aus Familienperspektive', 'Saisonaler Aufhänger (nutze das aktuelle Datum)'];
    return formats[daysSinceEpoch % formats.length];
  }
  if (audienceB.includes(dayOfWeek)) {
    const formats = ['Krisenvorsorge-Tipp (konkret & umsetzbar)', 'Blackout-Szenario & Lösung', 'Feature-Spotlight aus Vorsorgeperspektive', 'Statistik oder Fakt zur Krisenvorsorge'];
    return formats[daysSinceEpoch % formats.length];
  }
  // Sonntag
  const formats = ['Community-Frage', 'Behind the Scenes / App-Story'];
  return formats[daysSinceEpoch % formats.length];
}

async function generateContent(dateStr, dayName, dayOfWeek) {
  const anthropicKey = loadAnthropicKey();

  const audienceBlock = getAudienceBlock(dayOfWeek);
  const formatHint    = getFormatHint(dateStr, dayOfWeek);

  const systemPrompt = `Du bist der Social-Media-Manager für die Kellr App (iOS Vorratskammer-App, Forest Green Branding, #1B5E35).
Erstelle einen deutschen Social-Media-Post für heute.

${audienceBlock}

FORMAT FÜR HEUTE: ${formatHint}
(Halte dich an dieses Format — es sorgt für Abwechslung über die Woche.)

App-Features (nutze passend zum Post):
- Barcode Scanner & Inventar
- Ablauf-Warnungen (gelb/orange/rot je nach Dringlichkeit)
- Geteilte Einkaufsliste (bis 5 Einträge kostenlos)
- Kellr Pro: unbegrenzte Liste, CheckOff-Einlagerung, Siri-Integration (€7,99/Jahr)
- Haushalt teilen & Echtzeit-Sync
- Paket-Tracking
- Verbrauchsprognose (ConsumptionBarChart)

Aktuelle Version: v2.0.5 (live seit 17. April 2026)
App Store: https://kellr.app

Hashtags (verwende 3-5 passend zur Zielgruppe):
- Zielgruppe A: #Vorratskammer #Haushaltstipps #Kellermanagement #Haushalt #Organisation
- Zielgruppe B: #Prepper #Blackoutvorsorge #Krisenvorsorge #Notvorrat #Vorratskammer
- Zielgruppe C: #Kellr #iOS #Vorratskammer #App

Antworte NUR mit validem JSON (kein Markdown drumherum):
{
  "x_text": "X/Twitter Post (max 280 Zeichen inkl. Hashtags)",
  "ig_caption": "Instagram Caption (längere Version, inkl. 'Link in Bio 👆' und Hashtags)",
  "img_prompt": "Englischer Bildprompt für Gemini Imagen (photorealistic, no text, square format, related to post topic)",
  "use_screen": true or false,
  "format": "welches Format du gewählt hast"
}

Regeln:
- use_screen: true wenn ein App-Screenshot besser passt als ein generiertes Bild
- use_screen: false wenn ein thematisches Foto den Post besser unterstreicht
- img_prompt nur auf Englisch, beschreibend, kein Text im Bild`;

  const userMessage = `Erstelle den Post für ${dayName}, ${dateStr}.
Das Format ist heute: "${formatHint}".
Stelle sicher, dass der Post eindeutig dieser Zielgruppe zugeordnet werden kann — kein Mix.`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const rawText = data.content[0].text;

  // JSON extrahieren — Markdown-Codeblock entfernen falls vorhanden
  const stripped = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Claude hat kein gueltiges JSON zurueckgegeben:\n${rawText}`);

  // Robustes Parsing: Kontrollzeichen bereinigen, trailing commas entfernen
  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    // Stufe 1: Kontrollzeichen + trailing commas
    let cleaned = jsonMatch[0]
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');
    try {
      parsed = JSON.parse(cleaned);
    } catch (e2) {
      // Stufe 2: Felder einzeln extrahieren via Regex (Fallback)
      const extract = (key) => {
        // Matcht "key": "value" wobei value escaped quotes enthalten kann
        const m = cleaned.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'));
        return m ? m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"') : '';
      };
      const useScrMatch = cleaned.match(/"use_screen"\s*:\s*(true|false)/);
      parsed = {
        x_text:    extract('x_text'),
        ig_caption: extract('ig_caption'),
        img_prompt: extract('img_prompt'),
        use_screen: useScrMatch ? useScrMatch[1] === 'true' : true,
        format:    extract('format'),
      };
      if (!parsed.x_text) throw new Error(`JSON Fallback-Extraktion fehlgeschlagen. Raw:\n${rawText.slice(0, 300)}`);
    }
  }
  return parsed;
}

// ─── Video-Prompts (Tue + Fri) ───────────────────────────────────────────────
const VIDEO_DAYS = {
  2: { // Dienstag
    videoPrompt: 'A hand scanning a product barcode with a smartphone in a modern bright kitchen, smooth slow motion, cinematic close-up, warm natural lighting, no text on screen, vertical 9:16 format',
    videoTagline: 'Scan & Track – So einfach geht Vorrat.',
  },
  5: { // Freitag
    videoPrompt: 'A beautifully stocked home pantry with wine bottles, snacks and organized shelves, warm golden evening light, slow cinematic camera pull-back, cozy weekend home atmosphere, no text, vertical 9:16 format',
    videoTagline: 'Gut vorbereitet ins Wochenende.',
  },
};

// ─── Imagen 4 ────────────────────────────────────────────────────────────────
async function generateImage(prompt) {
  const geminiKey = opRead('Gemini API Key', 'credential');
  const body = JSON.stringify({
    instances: [{ prompt }],
    parameters: { sampleCount: 1, aspectRatio: '1:1' }
  });

  // Timeout nach 45s + Fallback auf App-Screenshot
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiKey}`, {
      method: 'POST', body, headers: { 'Content-Type': 'application/json' }, signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.predictions?.[0]?.bytesBase64Encoded) throw new Error('No image data in response');
    return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
  } catch (e) {
    clearTimeout(timeout);
    console.warn(`  ⚠️ Imagen fehlgeschlagen (${e.message}) → Fallback: App Screenshot`);
    // Fallback: zufälligen App-Screenshot verwenden
    const fallbackUrl = SCREEN_BASE + APP_SCREENS[Math.floor(Math.random() * APP_SCREENS.length)];
    const imgResp = await fetch(fallbackUrl);
    if (!imgResp.ok) throw new Error('Fallback screenshot fetch failed');
    const buf = await imgResp.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
  }
}

async function addKellrBranding(imageBuffer) {
  const { default: sharp } = await import('sharp');
  const { readFileSync } = await import('fs');

  const appIconPath = 'C:\\Users\\Micha\\.openclaw\\workspace\\kellr-appicon.png';
  let iconBuf;
  try {
    iconBuf = readFileSync(appIconPath);
  } catch {
    const r = await fetch('https://raw.githubusercontent.com/0000-kellr/kellr-blog/main/assets/branding/kellr-appicon.png');
    iconBuf = Buffer.from(await r.arrayBuffer());
  }

  const iconSize = 130;
  const iconResized = await sharp(iconBuf)
    .resize(iconSize, iconSize)
    .composite([{
      input: Buffer.from(`<svg><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="30" ry="30" fill="white"/></svg>`),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const meta = await sharp(imageBuffer).metadata();
  const w = meta.width;
  const h = meta.height;

  const padding = 30;
  const pillW = 150;
  const pillH = 42;
  const pillX = padding + iconSize + 14;
  const pillY = h - padding - pillH;

  const brandingSvg = Buffer.from(`
    <svg width="${w}" height="${h}">
      <defs>
        <linearGradient id="shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:0"/>
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.35"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#shadow)"/>
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="21" ry="21" fill="#1B5E35" opacity="0.95"/>
      <text x="${pillX + pillW/2}" y="${pillY + pillH/2 + 6}" 
        text-anchor="middle"
        font-family="-apple-system, Helvetica Neue, sans-serif"
        font-size="20" font-weight="600" fill="white" letter-spacing="0.5">kellr.app</text>
    </svg>
  `);

  const branded = await sharp(imageBuffer)
    .composite([
      { input: brandingSvg, top: 0, left: 0 },
      { input: iconResized, top: h - padding - iconSize, left: padding },
    ])
    .png()
    .toBuffer();

  return branded;
}

async function uploadImageToGitHub(base64DataUrl) {
  const { default: sharp } = await import('sharp');
  const rawBase64 = base64DataUrl.replace('data:image/png;base64,', '');
  const rawBuffer = Buffer.from(rawBase64, 'base64');

  const squared = await sharp(rawBuffer)
    .resize(1080, 1080, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const branded = await addKellrBranding(squared);

  const filename = `social/kellr-post-${Date.now()}.png`;
  const resp = await fetch(`https://api.github.com/repos/0000-kellr/kellr-blog/contents/assets/${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({ message: `chore: add social post image [skip ci]`, content: branded.toString('base64') })
  });
  if (!resp.ok) throw new Error(`GitHub upload failed: ${await resp.text()}`);
  return `https://raw.githubusercontent.com/0000-kellr/kellr-blog/main/assets/${filename}`;
}

// ─── Veo 2 Video generieren ──────────────────────────────────────────────────
async function generateVideo(prompt) {
  const geminiKey = opRead('Gemini API Key', 'credential');

  const startResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictLongRunning?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { aspectRatio: '9:16', durationSeconds: 5, sampleCount: 1 }
    })
  });
  const startData = await startResp.json();
  if (startData.error) throw new Error(`Veo2 start error: ${startData.error.message}`);
  if (!startData.name) throw new Error(`Veo2 no operation name: ${JSON.stringify(startData).slice(0,200)}`);

  const opName = startData.name;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const pollResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/${opName}?key=${geminiKey}`);
    const pollData = await pollResp.json();
    if (pollData.done) {
      const uri = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!uri) throw new Error('No video URI in response');
      const videoResp = await fetch(`${uri}&key=${geminiKey}`);
      if (!videoResp.ok) throw new Error('Video download failed');
      return Buffer.from(await videoResp.arrayBuffer());
    }
  }
  throw new Error('Veo 2 timeout');
}

async function brandVideo(videoBuffer, tagline) {
  const ffmpegBase = process.env.LOCALAPPDATA + '\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin\\';
  const ffmpegPath = ffmpegBase + 'ffmpeg.exe';
  const ffprobePath = ffmpegBase + 'ffprobe.exe';
  const tmpIn  = join(tmpdir(), `kellr-in-${Date.now()}.mp4`);
  const tmpOut = join(tmpdir(), `kellr-out-${Date.now()}.mp4`);
  const tmpOverlay = join(tmpdir(), `kellr-overlay-${Date.now()}.png`);

  writeFileSync(tmpIn, videoBuffer);

  const probeResult = spawnSync(ffprobePath, [
    '-v','quiet','-print_format','json','-show_streams', tmpIn
  ], { stdio: ['ignore','pipe','pipe'] });
  let w = 1080, h = 1920;
  try {
    const info = JSON.parse(probeResult.stdout?.toString() || '{}');
    const vs = info.streams?.find(s => s.codec_type === 'video');
    if (vs) { w = vs.width; h = vs.height; }
  } catch { /* use defaults */ }

  const { default: sharp } = await import('sharp');
  const appIconBuf = readFileSync('C:\\Users\\Micha\\.openclaw\\workspace\\kellr-appicon.png');
  const iconSize = Math.round(w * 0.14);
  const padding  = Math.round(w * 0.04);
  const pillH    = Math.round(iconSize * 0.36);
  const pillW    = Math.round(w * 0.22);
  const pillX    = padding + iconSize + Math.round(w * 0.015);
  const pillY    = h - padding - pillH;
  const iconY    = h - padding - iconSize;
  const radius   = Math.round(iconSize * 0.23);

  const iconResized = await sharp(appIconBuf).resize(iconSize, iconSize)
    .composite([{ input: Buffer.from(`<svg><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${radius}" ry="${radius}" fill="white"/></svg>`), blend: 'dest-in' }])
    .png().toBuffer();

  const overlaySvg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#000;stop-opacity:0"/>
        <stop offset="100%" style="stop-color:#000;stop-opacity:0.4"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#shadow)"/>
    <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${Math.round(pillH/2)}" ry="${Math.round(pillH/2)}" fill="#1B5E35" opacity="0.95"/>
    <text x="${pillX + pillW/2}" y="${pillY + pillH/2 + Math.round(pillH*0.18)}" text-anchor="middle"
      font-family="Helvetica Neue,Helvetica,Arial,sans-serif"
      font-size="${Math.round(pillH * 0.48)}" font-weight="600" fill="white" letter-spacing="0.5">kellr.app</text>
  </svg>`);

  const overlayPng = await sharp({ create: { width: w, height: h, channels: 4, background: { r:0, g:0, b:0, alpha:0 } } })
    .composite([{ input: overlaySvg, top: 0, left: 0 }, { input: iconResized, top: iconY, left: padding }])
    .png().toBuffer();
  writeFileSync(tmpOverlay, overlayPng);

  const cleanText = tagline.replace(/[^\x00-\x7FäöüÄÖÜß .,!?:\-–]/g, '').replace(/"/g, "'").trim();
  const fontSize  = Math.round(w * 0.052);
  const textY     = Math.round(h * 0.10);
  const boxPad    = Math.round(fontSize * 0.4);

  const drawtextFilter = `drawtext=text='${cleanText}':fontsize=${fontSize}:fontcolor=white:x=(w-text_w)/2:y=${textY}:font=Arial Bold:box=1:boxcolor=#1B5E35@0.85:boxborderw=${boxPad}`;

  const result = spawnSync(ffmpegPath, [
    '-i', tmpIn, '-i', tmpOverlay,
    '-filter_complex', `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1:1,${drawtextFilter}[txt];[txt][1:v]overlay=0:0`,
    '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
    '-y', tmpOut
  ], { stdio: ['ignore','pipe','pipe'] });

  if (result.status !== 0) throw new Error(`ffmpeg: ${result.stderr.toString().slice(-300)}`);
  return readFileSync(tmpOut);
}

async function uploadVideoToGitHub(videoBuffer) {
  const filename = `social/kellr-reel-${Date.now()}.mp4`;
  const resp = await fetch(`https://api.github.com/repos/0000-kellr/kellr-blog/contents/assets/${filename}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${githubToken}`, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({ message: `chore: add social video [skip ci]`, content: videoBuffer.toString('base64') })
  });
  if (!resp.ok) throw new Error(`GitHub video upload failed: ${await resp.text()}`);
  return `https://raw.githubusercontent.com/0000-kellr/kellr-blog/main/assets/${filename}`;
}

// ─── Post auf X ──────────────────────────────────────────────────────────────
async function postX(post) {
  try {
    const tweet = await xClient.v2.tweet(post.text);
    console.log('✅ X posted! ID:', tweet.data.id);
  } catch (err) {
    console.error('❌ X error:', err.message, JSON.stringify(err.data));
  }
}

// ─── Post auf Facebook ───────────────────────────────────────────────────────
async function postFacebook(post, videoBuffer, videoUrl = null) {
  try {
    if (post.isVideo && videoBuffer) {
      const ghUrl = videoUrl ?? await uploadVideoToGitHub(videoBuffer);
      const params = new URLSearchParams({ file_url: ghUrl, description: post.text, access_token: fbPageToken });
      const resp = await fetch(`https://graph.facebook.com/v19.0/${fbPageId}/videos`, { method: 'POST', body: params });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      console.log('✅ Facebook video posted! ID:', data.id);
    } else {
      const params = new URLSearchParams({ message: post.text, url: post.image, access_token: fbPageToken });
      const resp = await fetch(`https://graph.facebook.com/v19.0/${fbPageId}/photos`, { method: 'POST', body: params });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      console.log('✅ Facebook posted! ID:', data.id);
    }
  } catch (err) {
    console.error('❌ Facebook error:', err.message);
  }
}

// ─── Post auf Instagram ──────────────────────────────────────────────────────
async function postInstagram(post, videoBuffer, videoUrl = null) {
  try {
    let containerId;

    if (post.isVideo && videoBuffer) {
      const ghUrl = videoUrl ?? await uploadVideoToGitHub(videoBuffer);
      const containerParams = new URLSearchParams({
        media_type: 'REELS',
        video_url: ghUrl,
        caption: post.ig,
        share_to_feed: 'true',
        access_token: fbPageToken
      });
      const containerResp = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, { method: 'POST', body: containerParams });
      const container = await containerResp.json();
      if (container.error) throw new Error(container.error.message);
      containerId = container.id;

      console.log('  ⏳ Waiting for Instagram video processing (up to 4min)...');
      let igReady = false;
      for (let i = 0; i < 24; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const statusResp = await fetch(`https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${fbPageToken}`);
        const status = await statusResp.json();
        console.log(`  IG status [${i+1}/24]: ${status.status_code}`);
        if (status.status_code === 'FINISHED') { igReady = true; break; }
        if (status.status_code === 'ERROR') throw new Error('IG video processing failed');
      }
      if (!igReady) throw new Error('IG video processing timeout after 4 minutes');
    } else {
      let igImageUrl = post.image;
      try {
        const { default: sharp } = await import('sharp');
        const imgResp = await fetch(post.image);
        const imgBuf = Buffer.from(await imgResp.arrayBuffer());
        const resized = await sharp(imgBuf)
          .resize(1080, 1080, { fit: 'contain', background: { r: 28, g: 28, b: 30 } })
          .jpeg({ quality: 90 })
          .toBuffer();
        const base64 = resized.toString('base64');
        const uploadResp = await fetch(`https://api.github.com/repos/0000-kellr/kellr-blog/contents/assets/social/kellr-ig-${Date.now()}.jpg`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${githubToken}`, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
          body: JSON.stringify({ message: 'chore: ig image [skip ci]', content: base64 })
        });
        const uploadData = await uploadResp.json();
        if (uploadData.content?.download_url) igImageUrl = uploadData.content.download_url;
      } catch (e) {
        console.warn('  ⚠️ IG image resize failed, using original:', e.message);
      }
      const containerParams = new URLSearchParams({ image_url: igImageUrl, caption: post.ig, access_token: fbPageToken });
      const containerResp = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, { method: 'POST', body: containerParams });
      const container = await containerResp.json();
      if (container.error) throw new Error(container.error.message);
      containerId = container.id;
      await new Promise(r => setTimeout(r, 5000));
    }

    const publishParams = new URLSearchParams({ creation_id: containerId, access_token: fbPageToken });
    const pubResp = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, { method: 'POST', body: publishParams });
    const pub = await pubResp.json();
    if (pub.error) throw new Error(pub.error.message);
    console.log(`✅ Instagram ${post.isVideo ? 'Reel' : 'photo'} posted! ID:`, pub.id);
  } catch (err) {
    console.error('❌ Instagram error:', err.message);
  }
}

// ─── Follower-Vorschläge ─────────────────────────────────────────────────────
async function sendFollowerSuggestions() {
  try {
    const search = await xClient.v2.search('#Vorratskammer OR #Prepper OR #Blackoutvorsorge lang:de', {
      max_results: 20,
      expansions: ['author_id'],
      'user.fields': ['username', 'public_metrics', 'description'],
    });

    const users = search.includes?.users || [];
    const englishKeywords = /\b(free|gear|wholesale|dropship|survival kit|giveaway|shop|store|youtube channel|goodies|random)\b/i;
    const dachKeywords = /vorrat|keller|haushalt|lebensmittel|notvorrat|prepper|deutschland|österreich|schweiz|dach|krisenvorsorge|blackout|lager|kühl|einmach|konserv/i;

    const suggestions = users
      .filter(u => {
        if (u.public_metrics?.followers_count < 100) return false;
        if (u.username === 'kellr_app') return false;
        const bio = (u.description || '').toLowerCase();
        const name = (u.name || '').toLowerCase();
        if (englishKeywords.test(bio)) return false;
        return dachKeywords.test(bio) || dachKeywords.test(name);
      })
      .slice(0, 3);

    if (suggestions.length > 0) {
      const msg = `📱 Kellr Follow-Vorschläge für heute:\n\n` +
        suggestions.map((u, i) => `${i+1}. @${u.username} (${u.public_metrics.followers_count} Follower)\n   ${u.description?.substring(0, 60) || ''}...`).join('\n\n') +
        `\n\nAuf X + Instagram kurz folgen – 2 Min. 🙏`;
      console.log('📲 Follow suggestions ready:', msg);
    }
  } catch (err) {
    console.error('⚠️ Follow suggestions error:', err.message);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
const STATE_FILE = new URL('./kellr-post-state.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const today = new Date().toISOString().slice(0, 10);
const day   = new Date().getDay();
const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const dayName  = dayNames[day];

// State-Check (außer im Dry-Run)
if (!DRY_RUN && existsSync(STATE_FILE)) {
  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  if (state.lastPostedDate === today) {
    console.log('⏭️ Already posted today, skipping.');
    process.exit(0);
  }
}

if (DRY_RUN) console.log('🧪 DRY-RUN Modus – kein echter Post wird gesendet.\n');

// ─── 1. Content via Claude generieren ────────────────────────────────────────
console.log(`📅 Generiere Content für ${dayName}, ${today}...`);
let generated;
try {
  generated = await generateContent(today, dayName, day);
  console.log(`✅ Claude Content generiert (Format: ${generated.format})`);
} catch (err) {
  console.error('❌ Claude Fehler:', err.message);
  process.exit(1);
}

// ─── 2. Post-Objekt zusammenbauen ────────────────────────────────────────────
const isVideoDay = day === 2 || day === 5;
const screenIndex = Math.floor(Date.now() / 86400000) % APP_SCREENS.length;

const post = {
  text:      generated.x_text,
  ig:        generated.ig_caption,
  imgPrompt: generated.img_prompt,
  useScreen: generated.use_screen,
  isVideo:   isVideoDay,
  ...(isVideoDay ? VIDEO_DAYS[day] : {}),
};

// ─── 3. Seasonal Override anwenden ───────────────────────────────────────────
const seasonal = getSeasonalOverride();
if (seasonal) {
  Object.assign(post, seasonal);
  console.log('🎄 Seasonal Override aktiv!');
}

// ─── 4. Video oder Bild auswählen ────────────────────────────────────────────
let imageUrl = LOGO_URL;
let videoBuffer = null;

if (post.isVideo) {
  if (DRY_RUN) {
    console.log('\n🎬 [DRY-RUN] Video würde generiert werden mit Prompt:');
    console.log('  ', post.videoPrompt);
    console.log('  Tagline:', post.videoTagline);
  } else {
    try {
      console.log('🎬 Generating video with Veo 2...');
      const rawVideo = await generateVideo(post.videoPrompt);
      videoBuffer = await brandVideo(rawVideo, post.videoTagline);
      console.log('✅ Video ready!');
      imageUrl = LOGO_URL;
    } catch (err) {
      console.error('⚠️ Video failed, falling back to image:', err.message);
      post.isVideo = false;
    }
  }
}

if (!post.isVideo || DRY_RUN) {
  try {
    if (post.useScreen) {
      imageUrl = SCREEN_BASE + APP_SCREENS[screenIndex];
      console.log(`📱 App Screenshot #${screenIndex} wird verwendet`);
    } else {
      if (DRY_RUN) {
        console.log('\n🎨 [DRY-RUN] Bild würde generiert werden mit Prompt:');
        console.log('  ', post.imgPrompt);
        imageUrl = '(generated image)';
      } else {
        console.log('🎨 Generating image with Imagen 4...');
        const base64 = await generateImage(post.imgPrompt);
        imageUrl = await uploadImageToGitHub(base64);
        console.log('✅ Image ready:', imageUrl);
      }
    }
  } catch (err) {
    console.error('⚠️ Image failed, using fallback:', err.message);
  }
}
post.image = imageUrl;

// ─── 5. Dry-Run Ausgabe ───────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log('\n' + '═'.repeat(60));
  console.log('📋 DRY-RUN ERGEBNIS');
  console.log('═'.repeat(60));
  console.log(`\n📅 Tag: ${dayName} (${today})`);
  console.log(`🎯 Format: ${generated.format}`);
  console.log(`🖼️  Bild: ${post.useScreen ? 'App Screenshot' : 'Generiertes Bild'}`);
  console.log(`🎬 Video: ${post.isVideo ? 'Ja (Veo 2)' : 'Nein'}`);
  console.log('\n─── X/Twitter ──────────────────────────────────────────');
  console.log(post.text);
  console.log(`\n[${post.text.length}/280 Zeichen]`);
  console.log('\n─── Instagram Caption ──────────────────────────────────');
  console.log(post.ig);
  console.log('\n─── Bild-Prompt (Imagen 4) ─────────────────────────────');
  console.log(post.imgPrompt);
  console.log('═'.repeat(60));
  console.log('\n✅ Dry-Run abgeschlossen – nichts wurde gepostet.');
  process.exit(0);
}

// ─── 6. Posten ────────────────────────────────────────────────────────────────
console.log(`\n📅 Posting for ${dayName}${seasonal ? ' (SEASONAL)' : ''}...`);

let sharedVideoUrl = null;
if (post.isVideo && videoBuffer) {
  console.log('📤 Uploading video to GitHub (once for all platforms)...');
  sharedVideoUrl = await uploadVideoToGitHub(videoBuffer);
  console.log('✅ Video uploaded:', sharedVideoUrl);
}

await Promise.all([
  postX(post),
  postFacebook(post, videoBuffer, sharedVideoUrl),
  postInstagram(post, videoBuffer, sharedVideoUrl),
]);

writeFileSync(STATE_FILE, JSON.stringify({ lastPostedDate: today }), 'utf8');
await sendFollowerSuggestions();
console.log('🎉 Done!');
