'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  userId: string;
}

export function QRCodeDisplay({ userId }: QRCodeDisplayProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <QRCodeSVG value={userId} size={240} fgColor="#FFFFFF" bgColor="transparent" />
    </div>
  );
}
