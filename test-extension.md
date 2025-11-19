# Testing Sandwich Detector Extension

## Check if Extension is Loaded:

1. Open Chrome DevTools (F12) on SushiSwap/Uniswap
2. Go to Console tab
3. Look for these messages:
   - ✅ "Sandwich Detector Injected - Monitoring DEX transactions"
   - ✅ "Sandwich Detector Content Script Loaded"

## Test Without Tokens:

### Method 1: Check window.ethereum is hooked
In the console, type:
```javascript
window.ethereum.request.toString()
```
If it shows "async (args) => {" with our code, it's working!

### Method 2: Manually trigger a test event
Paste this in the console:
```javascript
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap V2 Router
    value: '0xDE0B6B3A7640000', // 1 ETH
    data: '0x7ff36ab5'
  }]
}).catch(e => console.log('Expected error:', e))
```
This will trigger the detector without sending a real transaction!

### Method 3: Use a Testnet
- Switch to Sepolia or Goerli testnet in MetaMask
- Get free testnet ETH from a faucet
- Test on testnet Uniswap
