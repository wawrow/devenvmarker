// Default configurations
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

  if (storageData.rules === undefined) {
    await browser.storage.sync.set({ configs: defaultRules });
    return defaultRules;
  }

  return storageData.rules;
}

const cssCode = `
html {
  border: 10px solid #800000; /* Change the color as needed */
  box-sizing: border-box;
  z-index: 9999
}
`;




async function updateTab(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') return 
  const rules = await getRules();

  function updateTab(tabs) {
    let tab = tabs[0];
    for (const rule of rules) {
      const regex = new RegExp(rule.regex, 'i');
      if (regex.test(tab.url)) {
        if(tab.title.startsWith(rule.prefix)) {
          break;
        }

        browser.tabs.executeScript({
          code: `
            document.title = "${rule.prefix} ${tab.title}";
            if(devBox) {
              devBox.style.display = 'block';
              devBox.style.backgroundColor = "${rule.color}";
              devBox.textContent = "${rule.prefix}";
            }
            `,
        });
        break;
      }
    }
  }

  browser.tabs.query({ currentWindow: true, active: true }).then(updateTab);
}

browser.tabs.onCreated.addListener(updateTab);
browser.tabs.onUpdated.addListener(updateTab);
browser.tabs.onActivated.addListener(updateTab);
browser.windows.onFocusChanged.addListener(updateTab);

//Init Rules
getRules();