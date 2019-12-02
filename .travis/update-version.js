const fs = require('fs');

const manifestFile = 'static/manifest.json';
const updatesFile = 'static/updates.json';
const addonUUID = '{ef720942-f75b-49ae-a823-10424ccb67aa}';

const manifest = JSON.parse(fs.readFileSync(manifestFile));

const updates = JSON.parse(fs.readFileSync(updatesFile));

const commitMsg = process.env['TRAVIS_COMMIT_MESSAGE'];

console.log(`Commit Message: ${commitMsg}`);

if (commitMsg) {
  const [, version] = commitMsg.split('Version: ');
  if (version) {
    console.log(`Detected version change: ${manifest.version} -> ${version}`);
    manifest.version = version.trim();
    updates.addons[addonUUID].updates[0].version = version.trim();
  }
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
fs.writeFileSync(updatesFile, JSON.stringify(updates, null, 2));

console.log(fs.readFileSync(manifestFile));
