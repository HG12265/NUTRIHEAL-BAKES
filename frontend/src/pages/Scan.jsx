import React from 'react';
import QRScanner from '../components/scanner/QRScanner';

const Scan = () => {
  return (
    <div
      style={{
        padding: '30px 16px 60px',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <QRScanner />
    </div>
  );
};

export default Scan;
