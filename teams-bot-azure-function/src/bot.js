const { ActivityHandler } = require('botbuilder');

class OpenClawTeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const text = (context.activity.text || '').trim();

      // Minimal stub: echo + simple commands.
      if (/^ping$/i.test(text)) {
        await context.sendActivity('pong');
      } else {
        await context.sendActivity(`OK (echo): ${text}`);
      }

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded || [];
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity('Hi — ich bin dein OpenClaw Teams Bot. Schreib z.B. "ping".');
        }
      }
      await next();
    });
  }
}

module.exports = { OpenClawTeamsBot };
