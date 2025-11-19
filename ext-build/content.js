// Inject the script into the page
const inject = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
};

inject();

// Listen for interception events
window.addEventListener("SD_INTERCEPT", (event) => {
  const txData = event.detail;
  
  console.log("📨 Content script received transaction:", txData);

  // Check if extension context is still valid
  if (!chrome.runtime?.id) {
    console.warn("⚠️ Extension context invalidated. Please refresh the page.");
    return;
  }

  chrome.runtime.sendMessage({
    type: "TX_DETECTED",
    data: txData
  }).catch(err => {
    console.error("Failed to send message to background:", err);
  });
});

console.log("✅ Sandwich Detector Content Script Loaded");
