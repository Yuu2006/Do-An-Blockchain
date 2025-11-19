# 🛡️ Sandwich Detector

A Chrome extension that detects and warns about potential sandwich attack risks on DEX (Decentralized Exchange) transactions.

## 🎯 Features

- **Real-time Transaction Monitoring** - Intercepts `eth_sendTransaction` calls before they're sent
- **Risk Level Detection** - Analyzes transactions and assigns LOW, MEDIUM, or HIGH risk levels
- **Visual Alerts** - Color-coded popup showing transaction details and risk factors
- **Transaction History** - Keeps track of the last 10 intercepted transactions
- **Multi-DEX Support** - Works with Uniswap V2/V3, SushiSwap, and other DEX routers

## 📋 Risk Detection Criteria

### 🟢 LOW Risk
- Swaps < 1 ETH
- Gas price < 100 gwei
- Normal ETH transfers (non-DEX)

### 🟡 MEDIUM Risk
- Swaps between **1-10 ETH**
- Gas price between **100-500 gwei**

### 🔴 HIGH Risk
- Swaps **≥ 10 ETH** - Prime target for sandwich attacks
- Gas price **≥ 500 gwei** - Major MEV bait
- Combo: **≥ 5 ETH + ≥ 200 gwei** - Critical sandwich risk

---

## 🚀 Setup Instructions

### Prerequisites
- Google Chrome or Chromium-based browser
- MetaMask or another Web3 wallet extension

### Installation Steps

1. **Clone or download this repository**
```bash
git clone <repository-url>
cd sandwich-detector
```

2. **The extension is already built in the `ext-build` folder**
   - No build process needed if using the pre-built version
   - Files included: `manifest.json`, `popup.html`, `popup.js`, `background.js`, `content.js`, `injected.js`, `assets/`

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"**
   - Select the `ext-build` folder from this repository

4. **Verify installation**
   - You should see "Sandwich Detector" in your extensions list
   - The extension icon should appear in your Chrome toolbar
   - If not visible, click the puzzle icon 🧩 and pin "Sandwich Detector"

---

## 🧪 Testing the Extension

### Method 1: Using the Test Page (Recommended)

1. **Open the test page**
   - Double-click `test.html` in the repository
   - Or navigate to: `file:///path/to/sandwich-detector/test.html`

2. **Check extension status**
   - Click the "Check if Extension is Loaded" button
   - You should see: ✅ "Sandwich Detector is ACTIVE and hooking transactions!"

3. **Test different risk levels**

   **🟢 LOW Risk:**
   - Click "Small Swap (0.1 ETH)" 
   - Click "Normal ETH Transfer"
   
   **🟡 MEDIUM Risk:**
   - Click "Medium Swap (2 ETH)"
   - Click "High Gas Swap (150 gwei)"
   
   **🔴 HIGH Risk:**
   - Click "Very Large Swap (10 ETH)"
   - Click "Extreme Gas Swap (500 gwei)"
   - Click "Large + High Gas (5 ETH, 200 gwei)"

4. **View results**
   - Click the **Sandwich Detector icon** in your toolbar
   - The popup will show:
     - Latest transaction details
     - Risk level with color-coded badge
     - Risk factors detected
     - Transaction history

5. **Expected behavior**
   - Console logs will show transaction interception
   - MetaMask errors are **normal** (transactions are rejected after analysis)
   - Popup persists transaction data even when closed

### Method 2: Testing on Real DEX Sites

1. **Visit a supported DEX**
   - https://app.uniswap.org
   - https://app.sushi.com

2. **Connect your wallet**
   - Make sure MetaMask is installed and connected

3. **Start a swap (but don't complete it!)**
   - Select tokens and enter an amount
   - Click "Swap" button
   - The extension will intercept the transaction

4. **Check the popup**
   - Click the extension icon to see risk analysis
   - Review the risk factors before proceeding

⚠️ **Warning:** The extension will analyze real transactions, but you can cancel them in MetaMask if the risk is too high.

---

## 🔍 Debugging

### If the extension isn't working:

1. **Check extension is loaded**
   - Go to `chrome://extensions/`
   - Ensure "Sandwich Detector" is enabled

2. **Reload the extension**
   - Click the reload icon 🔄 on the extension card
   - **Important:** Refresh any open web pages after reloading

3. **Check console logs**
   - Open DevTools (F12) on the test page
   - Look for these messages:
     - ✅ "Sandwich Detector Content Script Loaded"
     - ✅ "Sandwich Detector Injected - Monitoring DEX transactions"
     - 🚨 "SandwichDetector: Transaction detected!"

4. **Inspect popup**
   - Right-click the extension icon
   - Select "Inspect popup"
   - Check console for any errors

5. **Check background script**
   - Go to `chrome://extensions/`
   - Click "Service worker" under Sandwich Detector
   - Look for: 🟢 "Sandwich Detector Background Script Loaded"

### Common Issues

**"Extension context invalidated" error:**
- Solution: Reload the extension, then **refresh the web page**

**Popup shows "No transactions detected":**
- Check if you reloaded the extension after making changes
- Verify the test page is using the correct file path
- Check browser console for errors

**Content script not loading:**
- Verify `manifest.json` permissions are correct
- Check that `injected.js` is in the `ext-build` folder
- Ensure web accessible resources are properly configured

---

## 📁 Project Structure

```
sandwich-detector/
├── ext-build/              # Built extension (ready to load)
│   ├── manifest.json       # Extension configuration
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Popup logic
│   ├── background.js       # Background service worker
│   ├── content.js          # Content script
│   ├── injected.js         # Injected page script (risk analysis)
│   └── assets/
│       └── icon.png        # Extension icon
├── test.html               # Test page for extension
├── manifest.json           # Source manifest
├── popup.html              # Source popup
├── popup.js                # Source popup script
├── background.js           # Source background script
├── content.js              # Source content script
├── injected.js             # Source injected script
└── README.md               # This file
```

---

## 🛠️ Development

### Making Changes

1. **Edit source files** in the root directory
2. **Copy to ext-build**:
```bash
cp manifest.json popup.html popup.js background.js content.js injected.js ext-build/
```
3. **Reload extension** at `chrome://extensions/`
4. **Refresh test page** to apply changes

### Modifying Risk Detection

Edit `injected.js` - function `analyzeSandwichRisk()`:
- Adjust value thresholds
- Modify gas price limits
- Add new risk factors
- Customize risk messages

---

## 📝 How It Works

1. **Content Script** (`content.js`) injects into web pages
2. **Injected Script** (`injected.js`) hooks `window.ethereum.request`
3. **Transaction Interception** occurs before wallet confirmation
4. **Risk Analysis** evaluates transaction parameters
5. **Message Passing** sends data to background script
6. **Storage** persists transaction data
7. **Popup Display** shows results when opened

---

## 🔐 Privacy & Security

- ✅ All analysis happens **locally** in your browser
- ✅ No data is sent to external servers
- ✅ No transaction data is stored permanently
- ✅ Extension only reads transaction data, never modifies it
- ✅ Open source - audit the code yourself

---

## 📄 License

This project is open source. Use at your own risk.

---

## ⚠️ Disclaimer

This extension is for **educational and informational purposes only**. It provides risk assessments based on transaction parameters but **cannot guarantee** protection against sandwich attacks or other MEV (Maximal Extractable Value) exploits.

**Always:**
- Review transactions carefully before confirming
- Use appropriate slippage settings
- Consider using MEV protection services (Flashbots, private RPCs)
- Understand the risks of DeFi trading

**The developers are not responsible for any financial losses.**
