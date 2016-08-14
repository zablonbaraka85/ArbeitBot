/**
 * Used to initialize Telegam bot
 */

const Telegram = require('telegram-bot-api');
const config = require('../config');
const fs = require('fs');
const https = require('https');
const path = require('path');

const bot = new Telegram({
  token: config.telegram_api_key,
  updates: {
    enabled: !config.should_use_webhooks
  }
});

if (config.should_use_webhooks) {
  // Start http server for webhooks
  const options = {
    key: fs.readFileSync(path.join(__dirname, '/../certificates/key.key')),
    cert: fs.readFileSync(path.join(__dirname, '/../certificates/crt.pem'))
  };
  console.log(options);
  https.createServer(options, (req, res) => {
    if (String(req.url) === `/${config.webhook_token}`) {
      console.log('=======================');
      console.log('=======================');
      console.log('=======================');
      console.log(req);
      res.writeHead(200);
      res.end();
    } else {
      console.log('+++++++++++++++++++++++++++');
      console.log('+++++++++++++++++++++++++++');
      console.log('+++++++++++++++++++++++++++');
      console.log(req);
      res.writeHead(404);
      res.end('404');
    }
  }).listen(8443, () => {
    console.log('Server listening on: 8443');
  });

  const pathToCertificate = path.join(__dirname, '/../certificates/crt.pem');
  bot.setWebhook(`${config.webhook_callback_url}${config.webhook_token}`);
}

module.exports = bot;