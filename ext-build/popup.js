let txData = null;
let history = [];

// Load saved data when popup opens
chrome.storage.local.get(['latestTx', 'txHistory'], (result) => {
  if (result.latestTx) {
    txData = result.latestTx;
  }
  if (result.txHistory) {
    history = result.txHistory;
  }
  render();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TX_DETECTED") {
    txData = msg.data;
    history = [msg.data, ...history.slice(0, 9)]; // Keep last 10
    
    // Save to storage
    chrome.storage.local.set({
      latestTx: txData,
      txHistory: history
    });
    
    render();
  }
});

function getRiskColor(level) {
  switch(level) {
    case 'HIGH': return '#ff4444';
    case 'MEDIUM': return '#ffaa00';
    case 'LOW': return '#44ff44';
    default: return '#888';
  }
}

function getRiskClass(level) {
  return `risk-${level.toLowerCase()}`;
}

function render() {
  const content = document.getElementById('content');
  
  if (!txData) {
    content.innerHTML = `
      <div class="empty-state">
        No transactions detected yet.<br>
        <small>Visit Uniswap or SushiSwap to start monitoring.</small>
      </div>
    `;
    return;
  }

  const value = parseInt(txData.transaction.value || '0', 16) / 1e18;
  const toAddress = txData.transaction.to || 'Unknown';
  
  let html = `
    <div class="tx-card" style="border-color: ${getRiskColor(txData.risk.level)}">
      <div class="tx-header">
        <strong>Latest Transaction</strong>
        <span class="risk-badge ${getRiskClass(txData.risk.level)}">
          ${txData.risk.level} RISK
        </span>
      </div>
      
      <div class="tx-details">
        <div><strong>To:</strong> ${toAddress.slice(0, 10)}...</div>
        <div><strong>Value:</strong> ${value.toFixed(4)} ETH</div>
        
        ${txData.risk.factors.length > 0 ? `
          <div class="risk-factors">
            <strong>Risk Factors:</strong>
            <ul>
              ${txData.risk.factors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  if (history.length > 1) {
    html += `
      <div class="history">
        <strong style="font-size: 12px;">Recent Transactions:</strong>
        <div style="max-height: 200px; overflow: auto; margin-top: 4px;">
          ${history.slice(1).map(tx => `
            <div class="history-item" style="border-left-color: ${getRiskColor(tx.risk.level)}">
              ${new Date(tx.timestamp).toLocaleTimeString()} - ${tx.risk.level} risk
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  content.innerHTML = html;
}

// Initial render
render();
