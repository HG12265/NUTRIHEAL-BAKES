import React from 'react';
import { Flame, Beef, Wheat, Droplets, Apple, Compass, Sparkles, Activity } from 'lucide-react';

const metricMeta = {
  energy: { label: 'Energy', unit: 'kcal', icon: Flame, color: '#E06D53', bg: '#FDF2F0' },
  protein: { label: 'Protein', unit: 'g', icon: Beef, color: '#3E8E41', bg: '#EFF8F0' },
  carbohydrate: { label: 'Carbohydrates', unit: 'g', icon: Wheat, color: '#D9A441', bg: '#FDF7E7' },
  totalFat: { label: 'Total Fat', unit: 'g', icon: Droplets, color: '#8B5E3C', bg: '#F9F1EB' },
  dietaryFibre: { label: 'Dietary Fibre', unit: 'g', icon: Apple, color: '#6B8E6B', bg: '#EFF5EF' },
  iron: { label: 'Iron', unit: 'mg', icon: Compass, color: '#5B7065', bg: '#F0F4F2' },
  calcium: { label: 'Calcium', unit: 'mg', icon: Sparkles, color: '#4A7C9A', bg: '#EDF5F9' },
  sodium: { label: 'Sodium', unit: 'mg', icon: Activity, color: '#9B6188', bg: '#F7EDF5' },
};

export const NutrientMetricCard = ({ metricKey, value }) => {
  const meta = metricMeta[metricKey] || {
    label: metricKey,
    unit: '',
    icon: Sparkles,
    color: '#6B8E6B',
    bg: '#EFF5EF',
  };

  const Icon = meta.icon;

  return (
    <div
      className="card"
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: meta.bg,
          color: meta.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} />
      </div>

      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'block',
          }}
        >
          {meta.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--text)',
            }}
          >
            {value ?? 0}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {meta.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NutrientMetricCard;
