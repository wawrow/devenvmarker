const configContainer = document.getElementById('config-container');
const addConfigButton = document.getElementById('add-config');
// const saveButton = document.getElementById('save-config');
const resetButton = document.getElementById('reset-config');

function createConfigElement(config) {
  const configElement = document.createElement("div");
  configElement.className = "grid grid-cols-5 gap-4 my-2 config";
  configElement.id = config.id;

  const regexInput = document.createElement("input");
  regexInput.type = "text";
  regexInput.value = config.regex;
  regexInput.className = "col-span-2";
  configElement.appendChild(regexInput);

  const prefixInput = document.createElement("input");
  prefixInput.type = "text";
  prefixInput.value = config.prefix;
  configElement.appendChild(prefixInput);

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = config.color;
  configElement.appendChild(colorInput);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600";
  configElement.appendChild(removeButton);

  removeButton.addEventListener("click", () => {
    configElement.remove();
    saveConfigs();
  });

  regexInput.addEventListener("input", saveConfigs);
  prefixInput.addEventListener("input", saveConfigs);
  colorInput.addEventListener("input", saveConfigs);

  return configElement;
}

function saveConfigs() {
  const rules = Array.from(document.querySelectorAll('.config')).map(configElement => {
    const inputs = configElement.querySelectorAll('input');
    return { regex: inputs[0].value, prefix: inputs[1].value, color: inputs[2].value };
  });

  browser.storage.sync.set({ rules });
}

function loadConfigs() {
  browser.storage.sync.get('rules').then(({ rules }) => {
    if (!rules) return;
    configContainer.innerHTML = '';
    rules.forEach(rule => configContainer.appendChild(createConfigElement(rule)));
  });
}

// saveButton.addEventListener('click', saveConfigs);
// resetButton.addEventListener('click', () => {
//   browser.storage.sync.set({ rules: defaultRules });
//   loadConfigs();
// });

addConfigButton.addEventListener('click', () => {
  configContainer.appendChild(createConfigElement({ regex: '', prefix: '', color: '#000000' }));
});

getRules();
loadConfigs();
