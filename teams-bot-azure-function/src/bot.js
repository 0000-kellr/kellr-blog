const { ActivityHandler, TurnContext } = require('botbuilder');
const { queueClient, tableClient } = require('./storage');

class OpenClawTeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const text = (context.activity.text || '').trim();

      // 1) store conversation reference for proactive replies
      const reference = TurnContext.getConversationReference(context.activity);
      const conversationId = reference.conversation && reference.conversation.id;

      if (conversationId) {
        const tableName = process.env.OPENCLAW_CONV_TABLE || 'OpenClawConversations';
        const tc = tableClient(tableName);
        await tc.createTable();
        await tc.upsertEntity({
          partitionKey: 'teams',
          rowKey: conversationId,
          referenceJson: JSON.stringify(reference),
          updatedAt: new Date().toISOString()
        });
      }

      // 2) enqueue inbound message for OpenClaw to pull
      const queueName = process.env.OPENCLAW_IN_QUEUE || 'openclaw-in';
      const qc = queueClient(queueName);
      await qc.createIfNotExists();
      await qc.sendMessage(JSON.stringify({
        conversationId,
        from: {
          id: context.activity.from && context.activity.from.id,
          name: context.activity.from && context.activity.from.name
        },
        text,
        ts: new Date().toISOString()
      }));

      // optional: quick ack so user sees it's alive
      if (/^ping$/i.test(text)) {
        await context.sendActivity('pong');
      } else {
        await context.sendActivity('OK — hab’s an OpenClaw weitergegeben.');
      }

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded || [];
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity('Hi — ich bin dein OpenClaw Teams Bot. Schreib mir hier, ich reiche es an OpenClaw weiter.');
        }
      }
      await next();
    });
  }
}

module.exports = { OpenClawTeamsBot };
