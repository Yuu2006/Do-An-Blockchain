// Background script to relay messages and store transaction data
let latestTx = null;
let txHistory = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TX_DETECTED") {
    console.log("🔔 Background received TX:", message.data);
    
    // Store the transaction
    latestTx = message.data;
    txHistory = [message.data, ...txHistory.slice(0, 9)];
    
    // Save to storage so popup can access it
    chrome.storage.local.set({
      latestTx: latestTx,
      txHistory: txHistory
    });
    
    // Try to notify popup if it's open
    chrome.runtime.sendMessage(message).catch(() => {
      console.log("Popup not open, transaction saved to storage");
    });
  }
  return true;
});

console.log("🟢 Sandwich Detector Background Script Loaded");
