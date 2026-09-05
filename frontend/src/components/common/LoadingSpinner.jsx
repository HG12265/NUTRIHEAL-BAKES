import React from 'react';

export const LoadingSpinner = ({ size = 28, message = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '30px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '380px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '200px',
          backgroundColor: '#EBE5D6',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ height: '14px', width: '35%', backgroundColor: '#EBE5D6', borderRadius: '4px' }} />
        <div style={{ height: '22px', width: '80%', backgroundColor: '#EBE5D6', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '100%', backgroundColor: '#EBE5D6', borderRadius: '4px' }} />
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: '24px', width: '30%', backgroundColor: '#EBE5D6', borderRadius: '4px' }} />
          <div style={{ height: '36px', width: '45%', backgroundColor: '#EBE5D6', borderRadius: '20px' }} />
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
