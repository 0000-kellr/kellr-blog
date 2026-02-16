const { BotFrameworkAdapter } = require('botbuilder');
const { OpenClawTeamsBot } = require('../src/bot');

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
  console.error('[onTurnError]', error);
  try {
    await context.sendActivity('Fehler im Bot. Schau in die Function Logs.');
  } catch {}
};

const bot = new OpenClawTeamsBot();

module.exports = async function (context, req) {
  // Bot Framework adapter handles the HTTP response itself.
  await adapter.processActivity(req, context.res, async (turnContext) => {
    await bot.run(turnContext);
  });
};
