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
      
      const value = parseInt(tx.value || '0x0', 16);
      const gasPrice = tx.maxFeePerGas || tx.gasPrice;
      const gasPriceWei = gasPrice ? parseInt(gasPrice, 16) : 0;

      // MEDIUM RISK: Value between 1-10 ETH
      if (value >= 1e18 && value < 10e18) {
        risk.level = 'MEDIUM';
        risk.factors.push('Medium transaction value (1-10 ETH)');
      }

      // MEDIUM RISK: Gas price 100-500 gwei
      if (gasPriceWei >= 100e9 && gasPriceWei < 500e9) {
        risk.level = 'MEDIUM';
        risk.factors.push('High gas price (100-500 gwei) - may attract MEV');
      }

      // HIGH RISK: Very large value (>= 10 ETH)
      if (value >= 10e18) {
        risk.level = 'HIGH';
        risk.factors.push('Very large transaction value (>= 10 ETH) - prime target for sandwich attacks');
      }

      // HIGH RISK: Extremely high gas (>= 500 gwei)
      if (gasPriceWei >= 500e9) {
        risk.level = 'HIGH';
        risk.factors.push('Extremely high gas price (>= 500 gwei) - major MEV bait');
      }

      // HIGH RISK: Combination of large value (>= 5 ETH) + high gas (>= 200 gwei)
      if (value >= 5e18 && gasPriceWei >= 200e9) {
        risk.level = 'HIGH';
        risk.factors.push('Large value with high gas - critical sandwich risk');
      }

      // Slippage warning
      if (tx.data && tx.data.length > 10) {
        risk.factors.push('Swap transaction - verify slippage settings');
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
