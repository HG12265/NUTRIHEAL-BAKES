import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Info,
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const categories = ['Cookies', 'Bread', 'Cakes', 'Desserts'];

const AdminProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Form State structured according to the 6 sections
  const [formData, setFormData] = useState({
    // Section 1: Basic Information
    name: '',
    category: 'Cookies',
    description: '',
    sku: '',
    image: '',

    // Section 2: Pricing & Availability
    price: '',
    availability: true,
    servingSize: '30 g',

    // Section 3: Nutrition (Per Serving & Per 100g)
    nutrition: {
      perServing: {
        energy: '',
        protein: '',
        carbohydrate: '',
        totalFat: '',
        dietaryFibre: '',
        iron: '',
        calcium: '',
        sodium: '',
      },
      per100g: {
        energy: '',
        protein: '',
        carbohydrate: '',
        totalFat: '',
        dietaryFibre: '',
        iron: '',
        calcium: '',
        sodium: '',
      },
    },

    // Section 4: Ingredients & Allergens
    ingredientsString: '',
    allergensString: '',

    // Section 5: Storage & Dates
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
    manufacturingDate: new Date().toISOString().split('T')[0],
    bestBeforeDate: '',
    batchNumber: `NHB-${new Date().getFullYear()}-01`,

    // Section 6: QR Code info
    qrCodeUrl: '',
    qrCodeDataUrl: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          if (res.data.success) {
            const p = res.data.data;
            setFormData({
              name: p.name || '',
              category: p.category || 'Cookies',
              description: p.description || '',
              sku: p.sku || '',
              image: p.image || '',
              price: p.price ?? '',
              availability: p.availability ?? true,
              servingSize: p.nutrition?.servingSize || '30 g',
              nutrition: {
                perServing: {
                  energy: p.nutrition?.perServing?.energy ?? '',
                  protein: p.nutrition?.perServing?.protein ?? '',
                  carbohydrate: p.nutrition?.perServing?.carbohydrate ?? '',
                  totalFat: p.nutrition?.perServing?.totalFat ?? '',
                  dietaryFibre: p.nutrition?.perServing?.dietaryFibre ?? '',
                  iron: p.nutrition?.perServing?.iron ?? '',
                  calcium: p.nutrition?.perServing?.calcium ?? '',
                  sodium: p.nutrition?.perServing?.sodium ?? '',
                },
                per100g: {
                  energy: p.nutrition?.per100g?.energy ?? '',
                  protein: p.nutrition?.per100g?.protein ?? '',
                  carbohydrate: p.nutrition?.per100g?.carbohydrate ?? '',
                  totalFat: p.nutrition?.per100g?.totalFat ?? '',
                  dietaryFibre: p.nutrition?.per100g?.dietaryFibre ?? '',
                  iron: p.nutrition?.per100g?.iron ?? '',
                  calcium: p.nutrition?.per100g?.calcium ?? '',
                  sodium: p.nutrition?.per100g?.sodium ?? '',
                },
              },
              ingredientsString: p.ingredients ? p.ingredients.join(', ') : '',
              allergensString: p.allergens ? p.allergens.join(', ') : '',
              storageInstructions: p.storageInstructions || '',
              manufacturingDate: p.manufacturingDate
                ? new Date(p.manufacturingDate).toISOString().split('T')[0]
                : '',
              bestBeforeDate: p.bestBeforeDate
                ? new Date(p.bestBeforeDate).toISOString().split('T')[0]
                : '',
              batchNumber: p.batchNumber || '',
              qrCodeUrl: p.qrCodeUrl || '',
              qrCodeDataUrl: p.qrCodeDataUrl || '',
            });
            setImagePreview(p.image || '');
          }
        } catch (err) {
          setError('Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNutritionChange = (mode, field, val) => {
    setFormData((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [mode]: {
          ...prev.nutrition[mode],
          [field]: val === '' ? '' : Number(val),
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || formData.price === '') {
      setError('Please provide Product Name, Category, and Price.');
      return;
    }

    setSaving(true);

    try {
      // Build FormData payload for file upload + JSON fields
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('price', Number(formData.price));
      submitData.append('sku', formData.sku);
      submitData.append('availability', formData.availability);

      // Package Nutrition
      const nutritionPayload = {
        servingSize: formData.servingSize,
        perServing: {
          energy: Number(formData.nutrition.perServing.energy) || 0,
          protein: Number(formData.nutrition.perServing.protein) || 0,
          carbohydrate: Number(formData.nutrition.perServing.carbohydrate) || 0,
          totalFat: Number(formData.nutrition.perServing.totalFat) || 0,
          dietaryFibre: Number(formData.nutrition.perServing.dietaryFibre) || 0,
          iron: Number(formData.nutrition.perServing.iron) || 0,
          calcium: Number(formData.nutrition.perServing.calcium) || 0,
          sodium: Number(formData.nutrition.perServing.sodium) || 0,
        },
        per100g: {
          energy: Number(formData.nutrition.per100g.energy) || 0,
          protein: Number(formData.nutrition.per100g.protein) || 0,
          carbohydrate: Number(formData.nutrition.per100g.carbohydrate) || 0,
          totalFat: Number(formData.nutrition.per100g.totalFat) || 0,
          dietaryFibre: Number(formData.nutrition.per100g.dietaryFibre) || 0,
          iron: Number(formData.nutrition.per100g.iron) || 0,
          calcium: Number(formData.nutrition.per100g.calcium) || 0,
          sodium: Number(formData.nutrition.per100g.sodium) || 0,
        },
      };
      submitData.append('nutrition', JSON.stringify(nutritionPayload));

      // Parse ingredients & allergens comma-separated strings into arrays
      const ingredients = formData.ingredientsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const allergens = formData.allergensString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      submitData.append('ingredients', JSON.stringify(ingredients));
      submitData.append('allergens', JSON.stringify(allergens));

      submitData.append('storageInstructions', formData.storageInstructions);
      if (formData.manufacturingDate) {
        submitData.append('manufacturingDate', formData.manufacturingDate);
      }
      if (formData.bestBeforeDate) {
        submitData.append('bestBeforeDate', formData.bestBeforeDate);
      }
      submitData.append('batchNumber', formData.batchNumber);

      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (isEditMode) {
        await api.put(`/products/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Product updated successfully!', 'success');
      } else {
        await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Product created successfully with dynamic QR code!', 'success');
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size={36} message="Loading product information..." />;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Link
          to="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            fontSize: '0.9rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Mandatory Lab Nutrition Notice */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: 'var(--highlight-gold-light)',
          border: '1px solid rgba(217, 164, 65, 0.4)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          color: '#523E10',
        }}
      >
        <Info size={22} color="#8C6212" style={{ flexShrink: 0 }} />
        <div>
          <strong>Compliance Disclaimer:</strong> Use actual lab-tested nutrition values before publishing product information for customer view.
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>
            Section 1: Basic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ragi Jaggery Cookies"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Description *</label>
            <textarea
              required
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of ingredients, texture, flavor profile..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">SKU / Product Code</label>
              <input
                type="text"
                className="form-input"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. NHB-RAG-001 (Auto-generated if empty)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Image File or URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="product-image-upload"
                />
                <label htmlFor="product-image-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Choose File
                </label>
                {imagePreview && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', alignSelf: 'center' }}>
                    ✓ Image selected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING & AVAILABILITY */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>
            Section 2: Pricing & Availability
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="160"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Serving Size Label</label>
              <input
                type="text"
                className="form-input"
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                placeholder="e.g. 30 g (2 cookies)"
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label className="form-label">Stock Availability</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {formData.availability ? 'Available for Ordering' : 'Out of Stock'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: NUTRITION METRICS */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>
            Section 3: Verified Nutrition Values
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Store nutrient values per serving and per 100g.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Column A: Per Serving */}
            <div style={{ padding: '20px', backgroundColor: 'var(--bg)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', color: 'var(--accent-brown)' }}>
                Values Per Serving ({formData.servingSize || '30g'})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'energy', label: 'Energy (kcal)' },
                  { key: 'protein', label: 'Protein (g)' },
                  { key: 'carbohydrate', label: 'Carbs (g)' },
                  { key: 'totalFat', label: 'Total Fat (g)' },
                  { key: 'dietaryFibre', label: 'Fibre (g)' },
                  { key: 'iron', label: 'Iron (mg)' },
                  { key: 'calcium', label: 'Calcium (mg)' },
                  { key: 'sodium', label: 'Sodium (mg)' },
                ].map((m) => (
                  <div key={m.key} className="form-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {m.label}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      style={{ padding: '8px 10px', fontSize: '0.9rem' }}
                      value={formData.nutrition.perServing[m.key]}
                      onChange={(e) => handleNutritionChange('perServing', m.key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column B: Per 100g */}
            <div style={{ padding: '20px', backgroundColor: 'var(--bg)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', color: 'var(--accent-brown)' }}>
                Values Per 100g
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'energy', label: 'Energy (kcal)' },
                  { key: 'protein', label: 'Protein (g)' },
                  { key: 'carbohydrate', label: 'Carbs (g)' },
                  { key: 'totalFat', label: 'Total Fat (g)' },
                  { key: 'dietaryFibre', label: 'Fibre (g)' },
                  { key: 'iron', label: 'Iron (mg)' },
                  { key: 'calcium', label: 'Calcium (mg)' },
                  { key: 'sodium', label: 'Sodium (mg)' },
                ].map((m) => (
                  <div key={m.key} className="form-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {m.label}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      style={{ padding: '8px 10px', fontSize: '0.9rem' }}
                      value={formData.nutrition.per100g[m.key]}
                      onChange={(e) => handleNutritionChange('per100g', m.key, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: INGREDIENTS & ALLERGENS */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>
            Section 4: Ingredients & Allergens
          </h2>

          <div className="form-group">
            <label className="form-label">Ingredients List (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.ingredientsString}
              onChange={(e) => setFormData({ ...formData, ingredientsString: e.target.value })}
              placeholder="Finger Millet Flour, Organic Jaggery, Coconut Oil, Cardamom"
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Separate ingredients with commas. Only entered items will display on customer pages.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Allergen Information (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.allergensString}
              onChange={(e) => setFormData({ ...formData, allergensString: e.target.value })}
              placeholder="Tree Nuts (Almonds), Dairy (Ghee)"
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Leave blank if product is free of common allergens. Never hardcode allergens.
            </span>
          </div>
        </div>

        {/* SECTION 5: STORAGE & DATES */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>
            Section 5: Storage Instructions & Batch Dates
          </h2>

          <div className="form-group">
            <label className="form-label">Storage Instructions</label>
            <input
              type="text"
              className="form-input"
              value={formData.storageInstructions}
              onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Manufacturing Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Best Before Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.bestBeforeDate}
                onChange={(e) => setFormData({ ...formData, bestBeforeDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Batch Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: QR CODE */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', color: 'var(--primary)' }}>
            Section 6: QR Code Mapping
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Every product maps to a unique QR code pointing to its product page.
          </p>

          {formData.qrCodeDataUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  padding: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                <img src={formData.qrCodeDataUrl} alt="QR Preview" style={{ width: '100%', height: '100%' }} />
              </div>

              <div>
                <span className="badge badge-success" style={{ marginBottom: '6px' }}>
                  QR Code Active
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Target: <strong>{formData.qrCodeUrl}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
              }}
            >
              ⚡ QR Code will be automatically generated upon saving this product.
            </div>
          )}
        </div>

        {/* Save Actions Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '14px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ fontWeight: 700 }}
          >
            <Save size={18} />
            {saving ? 'Saving Product...' : isEditMode ? 'Update Product' : 'Save & Generate QR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
