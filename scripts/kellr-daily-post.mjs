/**
 * Kellr Daily Post – X + Facebook + Instagram
 * - Postet täglich auf allen 3 Kanälen
 * - Di + Fr: Veo 2 Video (Reel auf IG, Video auf FB, Foto auf X)
 * - Rest: Abwechselnd App Screenshots + Imagen 4 Bilder
 * - Seasonal Content (Ostern etc.)
 */
import { spawnSync } from 'child_process';
import { TwitterApi } from 'twitter-api-v2';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const opExe = process.env.LOCALAPPDATA + '\\Microsoft\\WinGet\\Packages\\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\\op.exe';
const opEnv = { ...process.env, OP_SERVICE_ACCOUNT_TOKEN: readFileSync('secrets/op_service_account_token.txt', 'utf8').trim() };

function opRead(item, field) {
  const r = spawnSync(opExe, ['item', 'get', item, '--vault', 'groot', '--fields', `label=${field}`, '--reveal'], {
    stdio: ['ignore', 'pipe', 'pipe'], env: opEnv });
  return r.stdout.toString().trim();
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
// 18 Screenshots in kellr-blog/Screens/
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
  const md = `${now.getMonth()+1}-${now.getDate()}`;
  // Ostern 2026: 5. April
  if (md >= '4-1' && md <= '4-6') return {
    text: `🐣 Frohe Ostern! Gut geplant feiern ist schöner. Mit Kellr weißt du schon am Karfreitag was noch fehlt. 🍫\n\n#Ostern #Vorratskammer #Kellr`,
    ig:   `🐣 Frohe Ostern!\n\nGut geplant feiern ist schöner. Mit Kellr weißt du schon am Karfreitag was noch fehlt. 🍫\n\nLink in Bio 👆\n\n#Ostern #Vorratskammer #Kellr #Haushalt`,
    imgPrompt: 'Easter basket with colorful eggs and chocolate on a wooden table, spring flowers, warm natural lighting, no text, square format, photorealistic',
    useScreen: false,
  };
  // Sommer (Juni-August)
  if (now.getMonth() >= 5 && now.getMonth() <= 7) return null; // kein Override, normaler Plan
  return null;
}

// ─── Imagen 4 ────────────────────────────────────────────────────────────────
async function generateImage(prompt) {
  const geminiKey = opRead('Gemini API Key', 'credential');
  const body = JSON.stringify({
    instances: [{ prompt }],
    parameters: { sampleCount: 1, aspectRatio: '1:1' }
  });
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiKey}`, {
    method: 'POST', body, headers: { 'Content-Type': 'application/json' }
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
}

async function addKellrBranding(imageBuffer) {
  const { default: sharp } = await import('sharp');
  const { readFileSync } = await import('fs');

  // App Icon laden (1024x1024) → 120x120 mit abgerundeten Ecken
  const appIconPath = 'C:\\Users\\Micha\\.openclaw\\workspace\\kellr-appicon.png';
  let iconBuf;
  try {
    iconBuf = readFileSync(appIconPath);
  } catch {
    // Fallback: Icon von GitHub holen
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

  // Bild-Dimensionen ermitteln
  const meta = await sharp(imageBuffer).metadata();
  const w = meta.width;
  const h = meta.height;

  // Kellr Branding: Logo unten links + grüner Pill-Badge "kellr.app"
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

  // Quadratisch zuschneiden für IG (1080x1080)
  const squared = await sharp(rawBuffer)
    .resize(1080, 1080, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Kellr Branding drauf
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
  
  // Step 1: Start
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
  if (!startData.name) throw new Error(`Veo2 no operation name in response: ${JSON.stringify(startData).slice(0,200)}`);
  
  // Step 2: Poll
  const opName = startData.name;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const pollResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/${opName}?key=${geminiKey}`);
    const pollData = await pollResp.json();
    if (pollData.done) {
      const uri = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!uri) throw new Error('No video URI in response');
      // Download video
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
  
  // Video-Dimensionen
  const probeResult = spawnSync(ffprobePath, [
    '-v','quiet','-print_format','json','-show_streams', tmpIn
  ], { stdio: ['ignore','pipe','pipe'] });
  let w = 1080, h = 1920; // default 9:16
  try {
    const info = JSON.parse(probeResult.stdout?.toString() || '{}');
    const vs = info.streams?.find(s => s.codec_type === 'video');
    if (vs) { w = vs.width; h = vs.height; }
  } catch { /* use defaults */ }

  // Branding Overlay PNG erstellen (Icon + Badge)
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

  // Text säubern (nur ASCII + Umlaute + gängige Satzzeichen)
  const cleanText = tagline.replace(/[^\x00-\x7FäöüÄÖÜß .,!?:\-–]/g, '').replace(/"/g, "'").trim();
  const fontSize  = Math.round(w * 0.052);
  const textY     = Math.round(h * 0.10);
  const boxPad    = Math.round(fontSize * 0.4);

  const drawtextFilter = `drawtext=text='${cleanText}':fontsize=${fontSize}:fontcolor=white:x=(w-text_w)/2:y=${textY}:font=Arial Bold:box=1:boxcolor=#1B5E35@0.85:boxborderw=${boxPad}`;

  // Force 1080x1920 (9:16) for Instagram Reels compatibility
  const result = spawnSync(ffmpegPath, [
    '-i', tmpIn, '-i', tmpOverlay,
    '-filter_complex', `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,${drawtextFilter}[txt];[txt][1:v]overlay=0:0`,
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

// ─── Bild auswählen (abwechselnd Screen/Imagen) ──────────────────────────────
const day = new Date().getDay();
// Gerade Tage → App Screenshot, Ungerade → Imagen generiert
const useAppScreen = day % 2 === 0;
const screenIndex  = Math.floor(Date.now() / 86400000) % APP_SCREENS.length;

// ─── Content (7 Tage) ────────────────────────────────────────────────────────
const APP_STORE = 'https://kellr.app';

const posts = {
  0: { // Sonntag – Community Frage → App Screenshot
    text: `Was ist das eine Produkt, das bei euch zuhause NIE ausgehen darf? 🤔\n\nBei uns: Mineralwasser. Immer. 💧\n\n#Vorratskammer #Haushaltstipps #Kellermanagement #Prepper`,
    ig:   `Was ist das eine Produkt, das bei euch zuhause NIE ausgehen darf? 🤔\n\nBei uns: Mineralwasser. Immer. 💧\n\nLink in Bio 👆\n\n#Vorratskammer #Haushaltstipps #Kellermanagement #Prepper #Blackoutvorsorge`,
    imgPrompt: 'A glass of sparkling mineral water on a wooden table, cozy home kitchen background, warm natural lighting, no text, square format, photorealistic',
    useScreen: true, // App Screenshot
  },
  1: { // Montag – Tipp → Imagen
    text: `💡 Tipp: Immer eine Mindestmenge festlegen. Wenn der Vorrat auf 2 geht → auf die Liste. Mit Kellr passiert dir das automatisch. 📱\n\n#Vorratskammer #Haushaltstipps #Kellermanagement`,
    ig:   `💡 Kellr-Tipp der Woche:\n\nImmer eine Mindestmenge festlegen. Wenn der Vorrat auf 2 geht → automatisch auf die Liste. Nie wieder ausgehen lassen!\n\nLink in Bio 👆\n\n#Vorratskammer #Haushaltstipps #Kellermanagement #Haushalt #Organisation`,
    imgPrompt: 'Neatly organized pantry shelf with labeled jars and cans, minimalist home style, warm lighting, no text, square format, photorealistic',
    useScreen: false,
  },
  2: { // Dienstag – Feature → VIDEO 🎬
    text: `🔍 Feature: Scan & Track. Produkt einscannen, Menge eingeben, fertig. Nie mehr überlegen "Haben wir noch Tonic?" 🍸\n\n${APP_STORE}\n\n#Kellr #Vorratskammer #Haushaltstipps`,
    ig:   `🔍 Feature Spotlight: Scan & Track\n\nProdukt einscannen, Menge eingeben – fertig. Nie mehr "Haben wir noch Tonic?" 🍸\n\nLink in Bio 👆\n\n#Kellr #Vorratskammer #Haushaltstipps #iOS #App #Reels`,
    videoPrompt: 'A hand scanning a product barcode with a smartphone in a modern bright kitchen, smooth slow motion, cinematic close-up, warm natural lighting, no text on screen, vertical 9:16 format',
    videoTagline: 'Scan & Track - So einfach geht Vorrat.',
    isVideo: true,
    imgPrompt: 'Person scanning a product barcode with a smartphone in a modern kitchen, bright and clean, no text, square format, photorealistic',
    useScreen: true, // Fallback falls Video fehlschlägt
  },
  3: { // Mittwoch – Alltag/Meme → Imagen
    text: `Freitagabend, Besuch kommt, der Kühlschrank sagt: "Geh einkaufen." 😩\n\nMit Kellr weißt du vorher Bescheid. 📦\n\n#Vorratskammer #Alltag #Haushaltstipps`,
    ig:   `Freitagabend, Besuch kommt, der Kühlschrank sagt: "Geh einkaufen." 😩\n\nKennst du das? Mit Kellr passiert dir das nie wieder. 📦\n\nLink in Bio 👆\n\n#Vorratskammer #Alltag #Haushaltstipps #Haushalt #Organisation`,
    imgPrompt: 'Empty refrigerator with only a few lonely items inside, humorous mood, bright kitchen background, no text, square format, photorealistic',
    useScreen: false,
  },
  4: { // Donnerstag – Krisenvorsorge → App Screenshot
    text: `🏠 Krisenvorsorge beginnt zuhause. Eine gut geführte Vorratskammer gibt dir Sicherheit – egal ob Blackout, Schnee oder einfach keine Lust einkaufen zu gehen.\n\n#Prepper #Blackoutvorsorge #Krisenvorsorge #Notvorrat`,
    ig:   `🏠 Krisenvorsorge beginnt zuhause.\n\nEine gut geführte Vorratskammer gibt dir Sicherheit – egal ob Blackout, Schnee oder einfach keine Lust einkaufen zu gehen.\n\nKellr hilft dir den Überblick zu behalten. 📱\n\nLink in Bio 👆\n\n#Prepper #Blackoutvorsorge #Krisenvorsorge #Notvorrat #Vorratskammer`,
    imgPrompt: 'Well-stocked storage room with shelves full of canned food, water bottles and supplies, warm lighting, no text, square format, photorealistic',
    useScreen: true,
  },
  5: { // Freitag – Weekend → VIDEO 🎬
    text: `Wochenende = gut bestückter Keller. 🍾\n\nMit Kellr weißt du schon Donnerstag was fehlt – und gehst mit einer Liste einkaufen statt mit Hoffnung. 😄\n\n#Kellr #Wochenende #Vorratskammer`,
    ig:   `Wochenende = gut bestückter Keller. 🍾\n\nMit Kellr weißt du schon Donnerstag was fehlt. Einkaufen mit Liste statt mit Hoffnung. 😄\n\nLink in Bio 👆\n\n#Kellr #Wochenende #Vorratskammer #Haushalt #Reels`,
    videoPrompt: 'A beautifully stocked home pantry with wine bottles, snacks and organized shelves, warm golden evening light, slow cinematic camera pull-back, cozy weekend home atmosphere, no text, vertical 9:16 format',
    videoTagline: 'Gut vorbereitet ins Wochenende.',
    isVideo: true,
    imgPrompt: 'Cozy weekend home scene with wine bottles and snacks neatly arranged on a kitchen counter, warm evening light, no text, square format, photorealistic',
    useScreen: false,
  },
  6: { // Samstag – Behind the Scenes → App Screenshot
    text: `🛠️ Kellr ist eine iOS App für Leute die ihren Haushalt im Griff haben wollen. Klein, schnell, fokussiert.\n\nWas wünschst du dir als nächstes Feature? 👇\n\n#Kellr #iOS #Vorratskammer`,
    ig:   `🛠️ Behind the Scenes:\n\nKellr ist eine iOS App, gebaut für Leute die ihren Haushalt im Griff haben wollen. Klein, schnell, fokussiert.\n\nWas wünschst du dir als nächstes Feature? 👇\n\nLink in Bio 👆\n\n#Kellr #iOS #Vorratskammer #App #Haushalt`,
    imgPrompt: 'Modern smartphone displaying a clean inventory app interface, placed on a wooden desk with coffee cup, no text on screen, square format, photorealistic',
    useScreen: true,
  },
};

// Seasonal override?
const seasonal = getSeasonalOverride();
const post = seasonal ? { ...posts[day], ...seasonal } : posts[day];

// ─── Video oder Bild auswählen ───────────────────────────────────────────────
let imageUrl = LOGO_URL;
let videoBuffer = null;

if (post.isVideo) {
  try {
    console.log('🎬 Generating video with Veo 2...');
    const rawVideo = await generateVideo(post.videoPrompt);
    videoBuffer = await brandVideo(rawVideo, post.videoTagline);
    console.log('✅ Video ready!');
    // Für X Fallback: Screenshot aus Video oder Logo
    imageUrl = LOGO_URL;
  } catch (err) {
    console.error('⚠️ Video failed, falling back to image:', err.message);
    post.isVideo = false;
  }
}

if (!post.isVideo) {
  try {
    if (post.useScreen) {
      imageUrl = SCREEN_BASE + APP_SCREENS[screenIndex];
      console.log(`📱 Using app screenshot #${screenIndex}`);
    } else {
      console.log('🎨 Generating image with Imagen 4...');
      const base64 = await generateImage(post.imgPrompt);
      imageUrl = await uploadImageToGitHub(base64);
      console.log('✅ Image ready:', imageUrl);
    }
  } catch (err) {
    console.error('⚠️ Image failed, using fallback:', err.message);
  }
}
post.image = imageUrl;

// ─── Post auf X ──────────────────────────────────────────────────────────────
async function postX() {
  try {
    const tweet = await xClient.v2.tweet(post.text);
    console.log('✅ X posted! ID:', tweet.data.id);
  } catch (err) {
    console.error('❌ X error:', err.message, JSON.stringify(err.data));
  }
}

// ─── Post auf Facebook ───────────────────────────────────────────────────────
async function postFacebook() {
  try {
    if (post.isVideo && videoBuffer) {
      // Facebook Video Upload
      const ghUrl = await uploadVideoToGitHub(videoBuffer);
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
async function postInstagram() {
  try {
    let containerId;

    if (post.isVideo && videoBuffer) {
      // Instagram Reel Upload – braucht öffentliche URL
      const ghUrl = await uploadVideoToGitHub(videoBuffer);
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

      // Warten bis Video verarbeitet (bis zu 4 Minuten)
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
      // IG requires 1:1 or 4:5 aspect ratio – resize image to 1080x1080 via sharp
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

// ─── Follower-Vorschläge per WhatsApp ────────────────────────────────────────
async function sendFollowerSuggestions() {
  try {
    // X: Suche relevante Accounts die wir noch nicht folgen
    const search = await xClient.v2.search('#Vorratskammer OR #Prepper OR #Blackoutvorsorge lang:de', {
      max_results: 20,
      expansions: ['author_id'],
      'user.fields': ['username', 'public_metrics', 'description'],
    });

    const users = search.includes?.users || [];

    // DACH-Filter: Beschreibung oder Name muss deutsch klingen
    // Ausschlusskriterien: englische Keywords, kein DACH-Bezug
    const englishKeywords = /\b(free|gear|wholesale|dropship|survival kit|giveaway|shop|store|youtube channel|goodies|random)\b/i;
    const dachKeywords = /vorrat|keller|haushalt|lebensmittel|notvorrat|prepper|deutschland|österreich|schweiz|dach|krisenvorsorge|blackout|lager|kühl|einmach|konserv/i;

    const suggestions = users
      .filter(u => {
        if (u.public_metrics?.followers_count < 100) return false;
        if (u.username === 'kellr_app') return false;
        const bio = (u.description || '').toLowerCase();
        const name = (u.name || '').toLowerCase();
        // Englische Spam-Accounts raus
        if (englishKeywords.test(bio)) return false;
        // Mindestens ein DACH/DE-Keyword im Namen oder Bio
        return dachKeywords.test(bio) || dachKeywords.test(name);
      })
      .slice(0, 3);

    if (suggestions.length > 0) {
      const msg = `📱 Kellr Follow-Vorschläge für heute:\n\n` +
        suggestions.map((u, i) => `${i+1}. @${u.username} (${u.public_metrics.followers_count} Follower)\n   ${u.description?.substring(0, 60) || ''}...`).join('\n\n') +
        `\n\nAuf X + Instagram kurz folgen – 2 Min. 🙏`;

      // Send via WhatsApp (OpenClaw message tool würde hier gerufen, wir loggen nur)
      console.log('📲 Follow suggestions ready:', msg);
    }
  } catch (err) {
    console.error('⚠️ Follow suggestions error:', err.message);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
const STATE_FILE = new URL('./kellr-post-state.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const today = new Date().toISOString().slice(0, 10);

if (existsSync(STATE_FILE)) {
  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  if (state.lastPostedDate === today) {
    console.log('⏭️ Already posted today, skipping.');
    process.exit(0);
  }
}

console.log(`📅 Posting for day ${day}${seasonal ? ' (SEASONAL)' : ''}...`);
await Promise.all([postX(), postFacebook(), postInstagram()]);
writeFileSync(STATE_FILE, JSON.stringify({ lastPostedDate: today }), 'utf8');
await sendFollowerSuggestions();
console.log('🎉 Done!');
