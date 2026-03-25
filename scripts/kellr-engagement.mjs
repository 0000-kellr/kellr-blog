/**
 * Kellr Engagement – X + Facebook + Instagram
 * - X: liken, folgen, auf Mentions antworten
 * - FB/IG: Kommentare beantworten, Mentions liken
 * 
 * Läuft 2x täglich (12:00 + 18:00)
 */
import { spawnSync } from 'child_process';
import { TwitterApi } from 'twitter-api-v2';

const opExe = process.env.LOCALAPPDATA + '\\Microsoft\\WinGet\\Packages\\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\\op.exe';
import { readFileSync } from 'fs';
const opEnv = { ...process.env, OP_SERVICE_ACCOUNT_TOKEN: readFileSync('secrets/op_service_account_token.txt', 'utf8').trim() };

function opRead(item, field) {
  const r = spawnSync(opExe, ['item', 'get', item, '--vault', 'groot', '--fields', `label=${field}`, '--reveal'], {
    stdio: ['ignore', 'pipe', 'pipe'], env: opEnv
  });
  return r.stdout.toString().trim();
}

const token    = opRead('Kellr Social Media API', 'Kellr Page Access Token');
const pageId   = '1011515808714434';
const igId     = '17841438133721668';
const APP_STORE = 'https://kellr.app';

// X Client
const xClient = new TwitterApi({
  appKey:       opRead('2kygrqd7nguhiseitxg6znldhu', 'Consumer Key'),
  appSecret:    opRead('2kygrqd7nguhiseitxg6znldhu', 'Secret Key'),
  accessToken:  opRead('2kygrqd7nguhiseitxg6znldhu', 'Access Token'),
  accessSecret: opRead('2kygrqd7nguhiseitxg6znldhu', 'Access Token Secret'),
});
const X_ITEM  = '2kygrqd7nguhiseitxg6znldhu';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function fbGet(path, params = {}) {
  const url = new URL(`https://graph.facebook.com/v19.0${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const resp = await fetch(url.toString());
  return resp.json();
}

async function fbPost(path, body = {}) {
  const params = new URLSearchParams({ ...body, access_token: token });
  const resp = await fetch(`https://graph.facebook.com/v19.0${path}`, {
    method: 'POST', body: params,
  });
  return resp.json();
}

// ─── IG: Kommentare auf eigene Posts beantworten ─────────────────────────────
async function handleIgComments() {
  console.log('📸 Checking Instagram comments...');
  
  // Letzte 10 Posts
  const media = await fbGet(`/${igId}/media`, { fields: 'id,timestamp,comments_count', limit: '10' });
  if (!media.data?.length) { console.log('  No posts found'); return; }

  for (const post of media.data) {
    if (!post.comments_count) continue;
    
    const comments = await fbGet(`/${post.id}/comments`, { 
      fields: 'id,text,username,timestamp,replies{id}',
      filter: 'stream'
    });
    
    for (const comment of (comments.data || [])) {
      // Nur beantworten wenn noch keine Antwort von uns
      const alreadyReplied = comment.replies?.data?.length > 0;
      if (alreadyReplied) continue;
      
      const text = comment.text.toLowerCase();
      let reply = null;
      
      // Antwort-Logik
      if (text.includes('where') || text.includes('download') || text.includes('link') || text.includes('app')) {
        reply = `Hi @${comment.username}! 😊 You can download Kellr here: ${APP_STORE}`;
      } else if (text.includes('wann') || text.includes('android')) {
        reply = `@${comment.username} Android ist in Planung! 🤖 Wir halten dich auf dem Laufenden.`;
      } else if (text.includes('❤️') || text.includes('🙌') || text.includes('super') || text.includes('great') || text.includes('toll') || text.includes('love')) {
        reply = `@${comment.username} Danke! Das freut uns sehr 🙏🌿`;
      } else if (text.includes('?')) {
        reply = `@${comment.username} Gute Frage! Schreib uns gerne eine DM, wir helfen dir weiter 😊`;
      }
      
      if (reply) {
        const result = await fbPost(`/${comment.id}/replies`, { message: reply });
        if (result.id) {
          console.log(`  ✅ Replied to @${comment.username}: "${reply.substring(0, 50)}..."`);
        }
        await new Promise(r => setTimeout(r, 1000)); // Rate limit
      }
    }
  }
}

// ─── FB: Kommentare auf Page Posts beantworten ───────────────────────────────
async function handleFbComments() {
  console.log('📘 Checking Facebook comments...');
  
  const posts = await fbGet(`/${pageId}/posts`, { fields: 'id,message,comments{id,message,from,comment_count}', limit: '10' });
  
  for (const post of (posts.data || [])) {
    for (const comment of (post.comments?.data || [])) {
      // Nur Top-Level Kommentare ohne Antworten
      if (comment.comment_count > 0) continue;
      
      const text = comment.message.toLowerCase();
      let reply = null;
      
      if (text.includes('download') || text.includes('wo') || text.includes('link') || text.includes('app')) {
        reply = `Hallo ${comment.from?.name?.split(' ')[0] || ''}! 😊 Kellr findest du hier: ${APP_STORE}`;
      } else if (text.includes('android')) {
        reply = `Android ist in Planung! 🤖 Wir halten euch auf dem Laufenden.`;
      } else if (text.includes('super') || text.includes('toll') || text.includes('great') || text.includes('danke')) {
        reply = `Danke! Das freut uns sehr 🙏🌿`;
      } else if (text.includes('?')) {
        reply = `Gute Frage! Schreib uns gerne eine Nachricht, wir helfen dir weiter 😊`;
      }
      
      if (reply) {
        const result = await fbPost(`/${comment.id}/comments`, { message: reply });
        if (result.id) {
          console.log(`  ✅ FB replied to ${comment.from?.name}: "${reply.substring(0, 50)}..."`);
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
}

// ─── IG: Neue Follower-Mentions liken ────────────────────────────────────────
async function likeTaggedPosts() {
  console.log('💬 Checking IG mentions...');
  
  const mentions = await fbGet(`/${igId}/tags`, { fields: 'id,timestamp' });
  
  for (const mention of (mentions.data || []).slice(0, 5)) {
    await fbPost(`/${mention.id}/likes`, {});
    console.log(`  ✅ Liked mention ${mention.id}`);
    await new Promise(r => setTimeout(r, 500));
  }
}

// ─── X: Liken ────────────────────────────────────────────────────────────────
async function xLikeRelevantTweets() {
  console.log('🐦 X: Liking relevant tweets...');
  const queries = [
    '#Vorratskammer lang:de',
    '#Prepper lang:de',
    '#Blackoutvorsorge lang:de',
    '#Notvorrat lang:de',
    '#Haushaltstipps lang:de',
  ];
  // Wechsle Queries je nach Tageszeit
  const query = queries[new Date().getHours() < 15 ? 0 : Math.floor(Math.random() * queries.length)];

  try {
    const results = await xClient.v2.search(query, { max_results: 10, 'tweet.fields': ['author_id'] });
    let liked = 0;
    for (const tweet of (results.data?.data || []).slice(0, 5)) {
      try {
        const me = await xClient.v2.me();
        await xClient.v2.like(me.data.id, tweet.id);
        liked++;
        await new Promise(r => setTimeout(r, 1500));
      } catch { /* skip already liked */ }
    }
    console.log(`  ✅ Liked ${liked} tweets for "${query}"`);
  } catch (err) {
    console.error('  ❌ X like error:', err.message);
  }
}

// ─── X: Folgen ───────────────────────────────────────────────────────────────
async function xFollowRelevantAccounts() {
  console.log('🐦 X: Following relevant accounts...');
  const queries = [
    '#Vorratskammer lang:de',
    '#Prepper lang:de',
    '#Krisenvorsorge lang:de',
  ];
  const query = queries[Math.floor(Math.random() * queries.length)];

  try {
    const results = await xClient.v2.search(query, {
      max_results: 20,
      expansions: ['author_id'],
      'user.fields': ['username', 'public_metrics', 'connection_status'],
    });

    const me = await xClient.v2.me();
    const users = results.includes?.users || [];
    let followed = 0;

    const englishKeywords = /\b(free|gear|wholesale|dropship|survival kit|giveaway|shop|store|youtube channel|goodies|random)\b/i;
    const dachKeywords = /vorrat|keller|haushalt|lebensmittel|notvorrat|prepper|deutschland|österreich|schweiz|dach|krisenvorsorge|blackout|lager|kühl|einmach|konserv/i;

    for (const user of users) {
      if (followed >= 3) break;
      if (user.id === me.data.id) continue;
      if (user.public_metrics?.followers_count < 50) continue;
      const bio = (user.description || '').toLowerCase();
      const name = (user.name || '').toLowerCase();
      if (englishKeywords.test(bio)) continue;
      if (!dachKeywords.test(bio) && !dachKeywords.test(name)) continue;

      try {
        await xClient.v2.follow(me.data.id, user.id);
        console.log(`  ✅ Followed @${user.username} (${user.public_metrics.followers_count} followers)`);
        followed++;
        await new Promise(r => setTimeout(r, 2000));
      } catch { /* already following */ }
    }
    console.log(`  ✅ Followed ${followed} new accounts`);
  } catch (err) {
    console.error('  ❌ X follow error:', err.message);
  }
}

// ─── X: Mentions beantworten ─────────────────────────────────────────────────
async function xHandleMentions() {
  console.log('🐦 X: Checking mentions...');
  try {
    const me = await xClient.v2.me();
    const mentions = await xClient.v2.userMentionTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['text', 'author_id', 'conversation_id'],
    });

    for (const tweet of (mentions.data?.data || []).slice(0, 3)) {
      const text = tweet.text.toLowerCase();
      let reply = null;

      if (text.includes('download') || text.includes('wo') || text.includes('link') || text.includes('app')) {
        reply = `Hier findest du Kellr im App Store: https://kellr.app 📱`;
      } else if (text.includes('android')) {
        reply = `Android ist in Planung! 🤖 Wir halten euch auf dem Laufenden.`;
      } else if (text.includes('danke') || text.includes('super') || text.includes('toll') || text.includes('great')) {
        reply = `Danke! Das freut uns sehr 🙏🌿`;
      }

      if (reply) {
        try {
          await xClient.v2.reply(reply, tweet.id);
          console.log(`  ✅ Replied to mention ${tweet.id}`);
          await new Promise(r => setTimeout(r, 2000));
        } catch { /* skip */ }
      }
    }
  } catch (err) {
    console.error('  ❌ X mentions error:', err.message);
  }
}

// ─── Stats ausgeben ──────────────────────────────────────────────────────────
async function printStats() {
  const igProfile = await fbGet(`/${igId}`, { fields: 'username,followers_count,media_count' });
  const fbPage    = await fbGet(`/${pageId}`, { fields: 'name,fan_count,followers_count' });
  
  console.log('\n📊 Kellr Social Stats:');
  console.log(`  Instagram @${igProfile.username}: ${igProfile.followers_count} Follower, ${igProfile.media_count} Posts`);
  console.log(`  Facebook "${fbPage.name}": ${fbPage.fan_count || fbPage.followers_count || 0} Likes`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('🌳 Kellr Engagement starting...');
await Promise.all([
  handleIgComments(),
  handleFbComments(),
  likeTaggedPosts(),
  xLikeRelevantTweets(),
  xFollowRelevantAccounts(),
  xHandleMentions(),
]);
await printStats();
console.log('✅ Engagement done!');
