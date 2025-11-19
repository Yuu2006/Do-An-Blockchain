(function() {
  const originalRequest = window.ethereum ? window.ethereum.request : null;
  if (!originalRequest) {
    console.log("❌ No ethereum provider found");
    return;
  }

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
      const value = parseInt(tx.value || '0x0', 16);
      if (value > 1e18) { // > 1 ETH
        risk.level = 'MEDIUM';
        risk.factors.push('Large transaction value');
      }

      // Very large value = HIGH risk
      if (value > 10e18) { // > 10 ETH
        risk.level = 'HIGH';
        risk.factors.push('Very large transaction value - prime target for sandwich attacks');
      }

      // Check gas price - very high gas = potential front-running
      if (tx.gasPrice || tx.maxFeePerGas) {
        const gasPrice = parseInt(tx.maxFeePerGas || tx.gasPrice || '0x0', 16);
        if (gasPrice > 100e9) { // > 100 gwei
          risk.level = 'MEDIUM';
          risk.factors.push('High gas price - may attract MEV');
        }
        
        // Extremely high gas = HIGH risk
        if (gasPrice > 500e9) { // > 500 gwei
          risk.level = 'HIGH';
          risk.factors.push('Extremely high gas price - major MEV bait');
        }
      }

      // Combination of large value + high gas = HIGH risk
      if (value > 5e18 && tx.maxFeePerGas && parseInt(tx.maxFeePerGas, 16) > 200e9) {
        risk.level = 'HIGH';
        risk.factors.push('Large value with high gas - critical sandwich risk');
      }

      // No slippage protection in data = HIGH risk
      if (tx.data && tx.data.length > 10) {
        risk.factors.push('Swap transaction - verify slippage settings');
        
        // If it's a large swap, lack of slippage check is HIGH risk
        if (value > 1e18) {
          risk.level = 'HIGH';
          risk.factors.push('Large swap without visible slippage protection - HIGH RISK');
        }
      }
    }

    return risk;
  }

  window.ethereum.request = async (args) => {
    if (args.method === 'eth_sendTransaction') {
      const tx = args.params[0];
      const riskAnalysis = analyzeSandwichRisk(tx);
      
      console.log("🚨 SandwichDetector: Transaction detected!", {
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

  console.log("✅ Sandwich Detector Injected - Monitoring DEX transactions");
})();
