require('dotenv').config()
const fs = require("fs");
const prompts = require('prompts');
const https = require("https");
const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Configuration
const HOST = process.env.HOST;
const key = fs.readFileSync(`${HOST}-key.pem`, "utf-8");
const cert = fs.readFileSync(`${HOST}.pem`, "utf-8");
const configs = JSON.parse(fs.readFileSync("configs.json"))

const selectConfigs = async () => {
  const configChoices = configs.map(({ name }, i) => ({ title: name, value: i }))
  const selectedConfigs = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Choose which configs to proxy:',
    choices: configChoices,
    hint: '- Space to select. Return to submit'
  });
  return selectedConfigs.value;
};

const startServer = config => {
  // Create Express Server
  const app = express();

  // Logging
  app.use(morgan('dev'));

  // Proxy endpoints
  app.use('/', createProxyMiddleware({
      target: config.targetServiceUrl,
      changeOrigin: false,
  }));

  // Start the Proxy
  https.createServer({ key, cert }, app).listen(config.port, HOST, () => {
      console.log(`Starting Proxy at ${HOST}:${config.port}`);
  });
}

const runProxies = async () => {
  if(!configs.length) {
    console.log("Configs missing! Create a configs.json.")
    return;
  }
  const selectedConfigs = await selectConfigs()
  selectedConfigs.forEach(cfgIndex => {
    startServer(configs[cfgIndex])
  })
}

runProxies()