const defaultRules = [
  {
    regex: 'dev',
    color: '#02DF02',
    prefix: '[[🛠️Dev]]',
  },
  {
    regex: 'int',
    color: '#AA00FF',
    prefix: '[[🔗Int]]',
  },
  {
    regex: 'uat',
    color: '#D0FF00',
    prefix: '[[🧪UAT]]',
  },
  {
    regex: 'prod',
    color: '#C70B0B',
    prefix: '[[🚀Prod]]',
  },
];

async function getRules() {
  const storageData = await browser.storage.sync.get('rules');
  if (!storageData.rules) {
    await browser.storage.sync.set({ rules: defaultRules });
    return defaultRules;
  }
  return storageData.rules;
}