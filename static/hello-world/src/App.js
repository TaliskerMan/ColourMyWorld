import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';

const PALETTE = [
  "#1D2125", "#44546F", "#8C9BAB", "#C1C7D0", "#0052CC", "#0065FF", "#2684FF", "#B3D4FF",
  "#008DA6", "#00B8D9", "#00C7E6", "#B3F5FF", "#006644", "#36B37E", "#57D9A3", "#ABF5D1",
  "#FF991F", "#FFAB00", "#FFC400", "#FFF0B3", "#DE350B", "#FF5630", "#FF7452", "#FFEBE6"
];

function App() {
  const [context, setContext] = useState(null);
  const [text, setText] = useState("STATUS");
  const [color, setColor] = useState(PALETTE[4]);

  useEffect(() => {
    console.log("[CMW] App component mounted. Attempting to getContext()....");
    // Attempt to get context safely, defaulting to empty object if it fails.
    view.getContext().then(ctx => {
      console.log("[CMW] getContext() resolved successfully with:", ctx);
      if (ctx) {
        setContext(ctx);
        if (ctx.extension && ctx.extension.config) {
          console.log("[CMW] Found existing config:", ctx.extension.config);
          if (ctx.extension.config.text) setText(ctx.extension.config.text);
          if (ctx.extension.config.color) setColor(ctx.extension.config.color);
        } else {
          console.log("[CMW] No config found in context.extension");
        }
      } else {
        console.warn("[CMW] getContext() returned null or undefined.", ctx);
        setContext({ extension: { type: 'unknown' } });
      }
    }).catch(err => {
      console.error("[CMW] Error retrieving context:", err);
      setContext({ extension: { type: 'unknown' } }); // Fallback
    });
  }, []);

  // While waiting for context, show a loading state instead of completely blank screen
  if (!context) {
    console.log("[CMW] Render: Waiting for context...");
    return <div style={{ padding: '10px' }}>Loading CMW...</div>;
  }

  // Determine if we are in view or edit mode
  // The inline macro iframe is small (e.g. 24px tall). The config modal is large (e.g. 400px+ tall).
  // We use window.innerHeight to reliably distinguish them.
  const isViewMode = window.innerHeight < 200;
  console.log(`[CMW] Render: Mode=${isViewMode ? 'View' : 'Edit/Config'}, window.innerHeight=${window.innerHeight}`);

  if (isViewMode) {
    return (
      <span style={{
        display: 'inline-block',
        backgroundColor: color,
        color: '#FFFFFF',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '700',
        lineHeight: '1',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
        margin: '0',
        whiteSpace: 'nowrap',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif'
      }}>
        {text}
      </span>
    );
  }

  // Render edit/config mode
  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif' }}>
      <h3 style={{ marginTop: 0 }}>Configure Colour My World Status</h3>
      <p style={{ fontSize: '12px', color: '#666' }}>
        <strong>Note:</strong> This app uses a standard 24-color palette that is not explicitly ADA-compliant. By using this application, you acknowledge you are using non-standard status colors.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status Text:</label>
        <input
          id="status-text"
          name="status-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '2px solid #dfe1e6', borderRadius: '3px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Color:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
          {PALETTE.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                backgroundColor: c,
                height: '30px',
                borderRadius: '3px',
                cursor: 'pointer',
                border: color === c ? '3px solid #000' : '1px solid #dfe1e6',
                boxShadow: color === c ? '0 0 0 2px #fff inset' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <strong style={{ display: 'block', marginBottom: '10px' }}>Preview: </strong>
        <span style={{
          display: 'inline-block',
          backgroundColor: color,
          color: '#FFFFFF',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: '700',
          lineHeight: '1',
          textTransform: 'uppercase',
          verticalAlign: 'middle'
        }}>
          {text}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #dfe1e6', paddingTop: '20px' }}>
        <button
          onClick={() => {
            console.log("[CMW] Submitting configuration:", { text, color });
            view.submit({ config: { text, color } });
          }}
          style={{
            backgroundColor: '#0052CC',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Configuration
        </button>
        <button
          onClick={() => {
            view.close();
          }}
          style={{
            backgroundColor: 'transparent',
            color: '#42526E',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default App;
