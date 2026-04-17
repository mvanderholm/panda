// Web implementation — renders a CODE128 barcode onto a <canvas> via JsBarcode
import { useEffect, useRef } from 'react';

export default function BarcodeDisplay({ value, width = 2, height = 80, maxWidth }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    import('jsbarcode').then(mod => {
      const JsBarcode = mod.default || mod;
      try {
        JsBarcode(canvasRef.current, value, {
          format: 'CODE128',
          width,
          height,
          displayValue: false,
          margin: 4,
        });
      } catch (e) {
        // value may contain characters unsupported by CODE128 — fail silently
      }
    });
  }, [value, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: maxWidth || '100%', display: 'block' }}
    />
  );
}
