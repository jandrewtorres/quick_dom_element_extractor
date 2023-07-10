// Background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'elementClicked') {
      // Forward the message to the user interface
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  });
  