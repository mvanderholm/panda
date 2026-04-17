// Native implementation — uses @kichiyaki/react-native-barcode-generator
import Barcode from '@kichiyaki/react-native-barcode-generator';

export default function BarcodeDisplay({ value, width = 1.5, height = 80, maxWidth }) {
  return (
    <Barcode
      value={value}
      format="CODE128"
      width={width}
      height={height}
      maxWidth={maxWidth}
    />
  );
}
