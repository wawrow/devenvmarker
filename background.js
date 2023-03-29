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

async function updateActiveTab(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') return 
  const rules = await getRules();

  function updateTab(tabs) {
    let tab = tabs[0];
    for (const rule of rules) {
      const regex = new RegExp(rule.regex, 'i');
      if (regex.test(tab.url)) {
        // browser.browserAction.setIcon({ path: 'icon.png', tabId: tab.id });
        // browser.browserAction.setTitle({ title: 'Tab Modifier', tabId: tab.id });
        console.debug("Tab updated", tab.url, rule)
        let updatedTitle = rule.prefix + ' ' + tab.title;
        browser.tabs.executeScript({
          code: `document.title = "${updatedTitle}";`,
        });

        break;
      }
    }
  }

  browser.tabs.query({ currentWindow: true, active: true }).then(updateTab);
}


// function updateTab(tab) {
//   browser.storage.sync.get('configs').then(({ configs }) => {
//     const configs = getRules();

//     for (const config of configs) {
//       const regex = new RegExp(config.regex);
//       if (regex.test(tab.url)) {
//         browser.tabs.executeScript(tab.id, {
//           code: `document.title = "${config.prefix}" + document.title;`
//         });
//         applyColor(tab.url, config.color);
//         browser.tabs.sendMessage(tab.id, { color: config.color });
//         break;
//       }
//     }
//   });
// }

// background.js
async function applyColor(url, color) {
  console.debug('applyColor', url, color);
  const tabs = await browser.tabs.query({ url });
  const css = `
    :root {
      --custom-tab-color: ${color};
    }
    body::before {
      content: "";
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: var(--custom-tab-color);
      z-index: 99999;
    }
    body {
      margin-top: 4px;
    }
  `;

  for (const tab of tabs) {
    browser.tabs.insertCSS(tab.id, { code: css });
  }
}

// Rest of the code remains the same.


// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     updateTab(tab);
//   }
// });

// browser.tabs.onCreated.addListener(updateTab);
browser.tabs.onUpdated.addListener(updateActiveTab);
// browser.tabs.onActivated.addListener(updateActiveTab);
// browser.windows.onFocusChanged.addListener(updateActiveTab);