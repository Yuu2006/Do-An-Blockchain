// Background script to relay messages between content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TX_DETECTED") {
    // Broadcast to all extension pages (including popup)
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignore errors if popup is not open
    })
  }
})

console.log("🟢 Sandwich Detector Background Script Loaded")
