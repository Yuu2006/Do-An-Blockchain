(() => {
  // background.ts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TX_DETECTED") {
      chrome.runtime.sendMessage(message).catch(() => {
      });
    }
  });
  console.log("\u{1F7E2} Sandwich Detector Background Script Loaded");
})();
