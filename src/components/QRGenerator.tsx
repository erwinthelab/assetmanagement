import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

export default function QRGenerator({ value, size = 128 }: QRGeneratorProps) {
  return (
    <div className="flex justify-center bg-white p-4 rounded-lg shadow-sm">
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}
