let vpnConnected = false;
let startTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'connect') {
    vpnConnected = true;
    startTime = new Date().getTime();
    sendResponse({ success: true, startTime });
  } else if (message.action === 'disconnect') {
    vpnConnected = false;
    startTime = null;
    sendResponse({ success: true });
  } else if (message.action === 'getStatus') {
    sendResponse({ vpnConnected, startTime });
  }else if (message.action === "setProxy") {
    setProxyConfig(true);
  } else if (message.action === "clearProxy") {
    setProxyConfig(false);
  } else if (message.action === "setIcon") {
    setIcon(message.evil);
  }
  return true; // Keep the message channel open for sendResponse
});


function setProxyConfig(enabled) {
  if (enabled) {
    chrome.proxy.settings.set(
      {
        value: {
          mode: "fixed_servers",
          rules: {
            singleProxy: {
              scheme: "http", host: "43.153.237.252", port: 3128
            }
          }
        },
        scope: "regular"
      }
    );
  } else {
    chrome.proxy.settings.clear(
      {
        scope: "regular"
      }
    );
  }
}

function setIcon(evil) {
  if (evil == 1) {
      chrome.action.setIcon({ path: 'media/sexygayman.png' });
  } else {
      chrome.action.setIcon({ path: 'media/sexyman.png' });
  }
}