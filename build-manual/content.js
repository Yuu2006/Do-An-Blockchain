(() => {
  // contents/interceptor.ts
  var config = {
    matches: ["https://app.uniswap.org/*", "https://app.sushi.com/*"],
    run_at: "document_start",
    all_frames: true
  };
  var INJECTED_SCRIPT = `
(function() {
  const originalRequest = window.ethereum ? window.ethereum.request : null;
  if (!originalRequest) return;

  // Common DEX router addresses
  const DEX_ROUTERS = {
    UNISWAP_V2: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'.toLowerCase(),
    UNISWAP_V3: '0xE592427A0AEce92De3Edee1F18E0157C05861564'.toLowerCase(),
    SUSHISWAP: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'.toLowerCase(),
  };

  // Detect if transaction is a swap
  function isSwapTransaction(tx) {
    if (!tx.to) return false;
    const to = tx.to.toLowerCase();
    return Object.values(DEX_ROUTERS).includes(to);
  }

  // Analyze transaction for sandwich risk
  function analyzeSandwichRisk(tx) {
    const risk = {
      level: 'LOW',
      factors: []
    };

    // Check if it's a DEX swap
    if (isSwapTransaction(tx)) {
      risk.factors.push('DEX swap detected');
      
      // Large value = higher risk
      if (tx.value && parseInt(tx.value, 16) > 1e18) { // > 1 ETH
        risk.level = 'MEDIUM';
        risk.factors.push('Large transaction value');
      }

      // Check gas price - very high gas = potential front-running
      if (tx.gasPrice || tx.maxFeePerGas) {
        const gasPrice = parseInt(tx.maxFeePerGas || tx.gasPrice, 16);
        if (gasPrice > 100e9) { // > 100 gwei
          risk.level = 'MEDIUM';
          risk.factors.push('High gas price - may attract MEV');
        }
      }

      // No slippage protection in data = HIGH risk
      if (tx.data && tx.data.length > 10) {
        // This is a simplified check - in reality you'd decode the function call
        // to check slippage parameters
        risk.factors.push('Swap transaction - verify slippage settings');
      }
    }

    return risk;
  }

  window.ethereum.request = async (args) => {
    if (args.method === 'eth_sendTransaction') {
      const tx = args.params[0];
      const riskAnalysis = analyzeSandwichRisk(tx);
      
      console.log("\u{1F6A8} SandwichDetector: Transaction detected!", {
        transaction: tx,
        risk: riskAnalysis
      });
      
      const event = new CustomEvent('SD_INTERCEPT', {
        detail: {
          transaction: tx,
          risk: riskAnalysis,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
    return originalRequest.call(window.ethereum, args);
  };

  console.log("\u2705 Sandwich Detector Injected - Monitoring DEX transactions");
})();
`;
  var inject = () => {
    const script = document.createElement("script");
    script.textContent = INJECTED_SCRIPT;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  };
  inject();
  window.addEventListener("SD_INTERCEPT", (event) => {
    const txData = event.detail;
    chrome.runtime.sendMessage({
      type: "TX_DETECTED",
      data: txData
    });
  });
})();
