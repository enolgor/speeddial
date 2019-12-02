const fs = require('fs');

const manifestFile = '../static/manifest.json';
const updatesFile = '../static/updates.json';
const addonUUID = '{abcd1234-1abc-1234-12ab-abcdef123456}';

const manifest = JSON.parse(fs.readFileSync(manifestFile));

const updates = JSON.parse(fs.readFileSync(updatesFile));

const commitMsg = process.env['TRAVIS_COMMIT'];

if (commitMsg) {
  const [, version] = commitMsg.split('Version: ');
  if (version) {
    manifest.version = version.trim();
    updates.addons[addonUUID].updates[0].version = version.trim();
  }
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
fs.writeFileSync(updatesFile, JSON.stringify(updates, null, 2));
