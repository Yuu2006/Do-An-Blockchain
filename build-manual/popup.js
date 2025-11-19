(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // popup.tsx
  var import_react = __require("react");
  var import_client = __require("react-dom/client");
  var import_jsx_runtime = __require("react/jsx-runtime");
  function IndexPopup() {
    const [txData, setTxData] = (0, import_react.useState)(null);
    const [history, setHistory] = (0, import_react.useState)([]);
    (0, import_react.useEffect)(() => {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "TX_DETECTED") {
          setTxData(msg.data);
          setHistory((prev) => [msg.data, ...prev.slice(0, 9)]);
        }
      });
    }, []);
    const getRiskColor = (level) => {
      switch (level) {
        case "HIGH":
          return "#ff4444";
        case "MEDIUM":
          return "#ffaa00";
        case "LOW":
          return "#44ff44";
        default:
          return "#888";
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 16, width: 400, fontFamily: "system-ui" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { style: { margin: 0, fontSize: 20 }, children: "\u{1F6E1}\uFE0F Sandwich Detector" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: "8px 0", color: "#666", fontSize: 12 }, children: "Monitoring DEX transactions for sandwich attack risks" }),
      txData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          padding: 12,
          borderRadius: 8,
          background: "#f8f8f8",
          border: `2px solid ${getRiskColor(txData.risk.level)}`
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Latest Transaction" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: {
              padding: "4px 8px",
              borderRadius: 4,
              background: getRiskColor(txData.risk.level),
              color: "white",
              fontSize: 11,
              fontWeight: "bold"
            }, children: [
              txData.risk.level,
              " RISK"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: "#333" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "To:" }),
              " ",
              txData.transaction.to?.slice(0, 10),
              "..."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Value:" }),
              " ",
              parseInt(txData.transaction.value || "0", 16) / 1e18,
              " ETH"
            ] }),
            txData.risk.factors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Risk Factors:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { margin: "4px 0", paddingLeft: 20 }, children: txData.risk.factors.map((factor, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: factor }, i)) })
            ] })
          ] })
        ] }),
        history.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { fontSize: 12 }, children: "Recent Transactions:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { maxHeight: 200, overflow: "auto", marginTop: 4 }, children: history.slice(1).map((tx, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
            padding: 6,
            marginTop: 4,
            background: "#f0f0f0",
            borderRadius: 4,
            fontSize: 11,
            borderLeft: `3px solid ${getRiskColor(tx.risk.level)}`
          }, children: [
            new Date(tx.timestamp).toLocaleTimeString(),
            " - ",
            tx.risk.level,
            " risk"
          ] }, i)) })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        padding: 20,
        textAlign: "center",
        color: "#888",
        background: "#f8f8f8",
        borderRadius: 8,
        marginTop: 16
      }, children: [
        "No transactions detected yet.",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12 }, children: "Visit Uniswap or SushiSwap to start monitoring." })
      ] })
    ] });
  }
  var root = document.getElementById("root");
  if (root) {
    (0, import_client.createRoot)(root).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndexPopup, {}));
  }
})();
