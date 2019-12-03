const { promisify } = require('util');
const fs = require('fs');
const webExt = require('web-ext').default;
const fetch = require('node-fetch');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const readJson = async (path) => {
  const text = await readFile(path);
  return JSON.parse(text);
};

const writeJson = async (path, obj) => {
  const text = JSON.stringify(obj, null, 2);
  await writeFile(path, text);
};

const baseUrl = 'https://enolgor.es/speeddial';
const manifestFilePath = './docs/manifest.json';
const updatesFilePath = './docs/updates.json';

(async () => {

  const manifestFile = await readJson(manifestFilePath);
  const updatesFile = await readJson(updatesFilePath);

  const version = manifestFile.version;
  const extensionID = manifestFile.applications.gecko.id;

  const lastManifestRaw = await fetch(`${baseUrl}/manifest.json`, { method: 'Get' });
  const lastManifest = await lastManifestRaw.json();
  const lastVersion = lastManifest.version;

  console.log(`Last version was: ${lastVersion}, version in manifest is: ${version}`);

  if (lastVersion === version) {
    console.log('No new version to package');
    return;
  }

  const result = await webExt.cmd.sign({
    artifactsDir: './docs',
    sourceDir: './docs',
    apiKey: process.env['WEB_EXT_API_KEY'],
    apiSecret: process.env['WEB_EXT_API_SECRET'],
  },{
    shouldExitProgram: false,
  });

  if (result.success) {
    const [, extFilePath] = result.downloadedFiles[0].split('/');
    const update_link = `${baseUrl}/${extFilePath}`;
    updatesFile.addons[extensionID].updates = [{
      version,
      update_link,
    }];
    await writeJson(updatesFilePath, updatesFile);
  }

})();


