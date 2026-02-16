const { BotFrameworkAdapter } = require('botbuilder');
const { tableClient } = require('../src/storage');

function json(context, status, body) {
  context.res = { status, headers: { 'content-type': 'application/json' }, body };
}

function isAuthorized(req) {
  const secret = process.env.OPENCLAW_SHARED_SECRET;
  if (!secret) return false;
  const got = (req.headers['x-openclaw-secret'] || req.headers['X-Openclaw-Secret'] || '').toString();
  return got === secret;
}

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

module.exports = async function (context, req) {
  if (!isAuthorized(req)) return json(context, 401, { ok: false, error: 'unauthorized' });

  const conversationId = (req.body && req.body.conversationId) || (req.query && req.query.conversationId);
  const text = (req.body && req.body.text) || '';
  if (!conversationId || !text) return json(context, 400, { ok: false, error: 'conversationId and text required' });

  const tableName = process.env.OPENCLAW_CONV_TABLE || 'OpenClawConversations';
  const tc = tableClient(tableName);
  await tc.createTable();

  let entity;
  try {
    entity = await tc.getEntity('teams', conversationId);
  } catch (e) {
    return json(context, 404, { ok: false, error: 'conversation not found (no stored reference yet)' });
  }

  const reference = JSON.parse(entity.referenceJson);

  await adapter.continueConversation(reference, async (turnContext) => {
    await turnContext.sendActivity(text);
  });

  return json(context, 200, { ok: true });
};
