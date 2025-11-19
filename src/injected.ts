export const INJECTED_SCRIPT = `
(function() {
  const originalRequest = window.ethereum ? window.ethereum.request : null;
  if (!originalRequest) return;

  window.ethereum.request = async (args) => {
    if (args.method === 'eth_sendTransaction') {
      console.log("🚨 SandwichDetector: Transaction detected!", args.params[0]);
      
      const event = new CustomEvent('SD_INTERCEPT', {
        detail: args.params[0]
      });
      window.dispatchEvent(event);
    }
    return originalRequest(args);
  };

  console.log("✅ Sandwich Detector Injected");
})();
`
