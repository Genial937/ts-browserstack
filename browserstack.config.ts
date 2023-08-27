const base = require('@playwright/test');
const cp = require('child_process');
const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];
const BrowserStackLocal = require('browserstack-local');
const util = require('util');
console.log('bs username', process.env.BROWSERSTACK_USERNAME);
// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
  browser: 'chrome',
  os: 'osx',
  os_version: 'catalina',
  name: 'My first playwright test',
  build: 'playwright-build',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'thadeusodenyo_Hq3EB6',
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'quipLyBy7x5cV3owaxKa',
  'browserstack.local': process.env.BROWSERSTACK_LOCAL || true,
  'client.playwrightVersion': clientPlaywrightVersion,
};

exports.bsLocal = new BrowserStackLocal.Local();

// replace YOUR_ACCESS_KEY with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
exports.BS_LOCAL_ARGS = {
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'quipLyBy7x5cV3owaxKa',
};

// Patching the capabilities dynamically according to the project name.
const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, browser_version] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let os_version = osCapsSplit.join(' ');
  caps.browser = browser ? browser : 'chrome';
  caps.os_version = browser_version ? browser_version : 'latest';
  caps.os = os ? os : 'osx';
  caps.os_version = os_version ? os_version : 'catalina';
  caps.name = title;
};

exports.getCdpEndpoint = (name, title) => {
  patchCaps(name, title)
  const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
  console.log(`--> ${cdpUrl}`)
  return cdpUrl;
}
