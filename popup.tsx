import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"

interface TxData {
  transaction: any
  risk: {
    level: 'LOW' | 'MEDIUM' | 'HIGH'
    factors: string[]
  }
  timestamp: number
}

function IndexPopup() {
  const [txData, setTxData] = useState<TxData | null>(null)
  const [history, setHistory] = useState<TxData[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "TX_DETECTED") {
        setTxData(msg.data)
        setHistory(prev => [msg.data, ...prev.slice(0, 9)]) // Keep last 10
      }
    })
  }, [])

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'HIGH': return '#ff4444'
      case 'MEDIUM': return '#ffaa00'
      case 'LOW': return '#44ff44'
      default: return '#888'
    }
  }

  return (
    <div style={{ padding: 16, width: 400, fontFamily: 'system-ui' }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>🛡️ Sandwich Detector</h1>
      <p style={{ margin: '8px 0', color: '#666', fontSize: 12 }}>
        Monitoring DEX transactions for sandwich attack risks
      </p>

      {txData ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ 
            padding: 12, 
            borderRadius: 8, 
            background: '#f8f8f8',
            border: `2px solid ${getRiskColor(txData.risk.level)}`
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <strong>Latest Transaction</strong>
              <span style={{ 
                padding: '4px 8px',
                borderRadius: 4,
                background: getRiskColor(txData.risk.level),
                color: 'white',
                fontSize: 11,
                fontWeight: 'bold'
              }}>
                {txData.risk.level} RISK
              </span>
            </div>
            
            <div style={{ fontSize: 12, color: '#333' }}>
              <div><strong>To:</strong> {txData.transaction.to?.slice(0, 10)}...</div>
              <div><strong>Value:</strong> {parseInt(txData.transaction.value || '0', 16) / 1e18} ETH</div>
              
              {txData.risk.factors.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Risk Factors:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                    {txData.risk.factors.map((factor, i) => (
                      <li key={i}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {history.length > 1 && (
            <div style={{ marginTop: 12 }}>
              <strong style={{ fontSize: 12 }}>Recent Transactions:</strong>
              <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 4 }}>
                {history.slice(1).map((tx, i) => (
                  <div key={i} style={{
                    padding: 6,
                    marginTop: 4,
                    background: '#f0f0f0',
                    borderRadius: 4,
                    fontSize: 11,
                    borderLeft: `3px solid ${getRiskColor(tx.risk.level)}`
                  }}>
                    {new Date(tx.timestamp).toLocaleTimeString()} - {tx.risk.level} risk
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: 20,
          textAlign: 'center',
          color: '#888',
          background: '#f8f8f8',
          borderRadius: 8,
          marginTop: 16
        }}>
          No transactions detected yet.<br/>
          <span style={{ fontSize: 12 }}>Visit Uniswap or SushiSwap to start monitoring.</span>
        </div>
      )}
    </div>
  )
}

// Mount the app
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<IndexPopup />);
}
