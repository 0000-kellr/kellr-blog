const { queueClient } = require('../../storage');

function json(context, status, body) {
  context.res = { status, headers: { 'content-type': 'application/json' }, body };
}

function isAuthorized(req) {
  const secret = process.env.OPENCLAW_SHARED_SECRET;
  if (!secret) return false;
  const got = (req.headers['x-openclaw-secret'] || req.headers['X-Openclaw-Secret'] || '').toString();
  return got === secret;
}

module.exports = async function (context, req) {
  if (!isAuthorized(req)) return json(context, 401, { ok: false, error: 'unauthorized' });

  const queueName = process.env.OPENCLAW_IN_QUEUE || 'openclaw-in';
  const max = Math.min(parseInt(req.query.max || (req.body && req.body.max) || '10', 10) || 10, 32);

  const qc = queueClient(queueName);
  await qc.createIfNotExists();

  const messages = [];
  const received = await qc.receiveMessages({ numberOfMessages: max, visibilityTimeout: 30 });

  for (const m of received.receivedMessageItems || []) {
    // messageText is base64-decoded by SDK already
    let payload = null;
    try { payload = JSON.parse(m.messageText); } catch { payload = { text: m.messageText }; }

    messages.push({
      payload,
      dequeueId: m.messageId,
      popReceipt: m.popReceipt
    });
  }

  // Delete after returning? We delete now to prevent duplicates.
  for (const m of received.receivedMessageItems || []) {
    try { await qc.deleteMessage(m.messageId, m.popReceipt); } catch {}
  }

  return json(context, 200, { ok: true, count: messages.length, messages });
};
