import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import jsQR from 'jsqr';
import {
  Camera,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Upload,
  ShoppingBag,
  SwitchCamera,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const QRScanner = () => {
  const navigate = useNavigate();
  const [scanStatus, setScanStatus] = useState('scanning'); // scanning, validating, success, error, not_found, camera_error
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedRawText, setScannedRawText] = useState('');
  const [foundProduct, setFoundProduct] = useState(null);
  const [sampleProducts, setSampleProducts] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Load sample products for instant 1-click simulator
  useEffect(() => {
    isMountedRef.current = true;
    const fetchSampleProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success && isMountedRef.current) {
          setSampleProducts(res.data.data.slice(0, 5));
        }
      } catch {
        // silent fallback
      }
    };
    fetchSampleProducts();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Extract Product ID, SKU, or slug from any scanned QR text or URL
   */
  const extractProductIdentifier = (qrText) => {
    if (!qrText || typeof qrText !== 'string') return null;
    const cleanText = qrText.trim();

    // 1. URL format: http(s)://.../product(s)/:id
    const urlMatch = cleanText.match(/\/products?\/([a-zA-Z0-9_-]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    // 2. Direct 24-character hex MongoDB ObjectId
    const objectIdMatch = cleanText.match(/[0-9a-fA-F]{24}/);
    if (objectIdMatch) {
      return objectIdMatch[0];
    }

    // 3. SKU or Batch pattern e.g. NHB-RAG-001 or NHB-BRD-004
    const skuMatch = cleanText.match(/NHB-[A-Z0-9-]+/i);
    if (skuMatch) {
      return skuMatch[0];
    }

    // 4. Raw fallback (slug or name)
    return cleanText;
  };

  /**
   * Core QR Resolution Handler
   */
  const processScannedCode = async (decodedText) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Stop scanning loop
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    setScannedRawText(decodedText);
    setScanStatus('validating');
    setErrorMessage('');

    const identifier = extractProductIdentifier(decodedText);

    if (!identifier) {
      setScanStatus('error');
      setErrorMessage('The scanned QR code is empty or does not contain a valid product code.');
      isProcessingRef.current = false;
      return;
    }

    try {
      // Call backend API to locate product
      const res = await api.get(`/products/${identifier}`);
      if (res.data.success && res.data.data) {
        setFoundProduct(res.data.data);
        setScanStatus('success');

        // Stop camera tracks once found
        stopCamera();

        // Redirect after brief visual feedback
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate(`/product/${res.data.data._id}`);
          }
        }, 1200);
      } else {
        setScanStatus('not_found');
        setErrorMessage(`Product not found in NutriHeal Bakes database. (Scanned: "${decodedText}")`);
        isProcessingRef.current = false;
      }
    } catch (err) {
      setScanStatus('not_found');
      setErrorMessage(
        `Scanned: "${decodedText}". No matching NutriHeal Bakes product found in database.`
      );
      isProcessingRef.current = false;
    }
  };

  /**
   * Stop camera tracks cleanly
   */
  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Continuous Camera Scanning Loop with native BarcodeDetector and jsQR
   */
  const startScanningLoop = () => {
    // Check if native BarcodeDetector is supported in browser
    const hasBarcodeDetector = 'BarcodeDetector' in window;
    let barcodeDetector = null;
    if (hasBarcodeDetector) {
      try {
        barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        barcodeDetector = null;
      }
    }

    const scanFrame = async () => {
      if (isProcessingRef.current || !isMountedRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        // Fast-path: Native browser BarcodeDetector API
        if (barcodeDetector) {
          try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              processScannedCode(barcodes[0].rawValue);
              return;
            }
          } catch {
            // fallback to jsQR
          }
        }

        // Secondary path: Canvas + jsQR with both normal and inverted attempts
        try {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });

            if (code && code.data) {
              processScannedCode(code.data);
              return;
            }
          }
        } catch {
          // continue loop
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameIdRef.current = requestAnimationFrame(scanFrame);
  };

  /**
   * Start Camera Stream
   */
  const startCamera = async (cameraId = null) => {
    stopCamera();
    isProcessingRef.current = false;
    setErrorMessage('');
    setScanStatus('scanning');

    try {
      // Enumerate available video inputs
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        if (isMountedRef.current) {
          setAvailableCameras(videoDevices);
        }
      } catch {
        // silent
      }

      let constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      if (cameraId) {
        constraints.video.deviceId = { exact: cameraId };
      } else {
        // Prefer rear camera on mobile, or user webcam
        constraints.video.facingMode = { ideal: 'environment' };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && isMountedRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              startScanningLoop();
            }).catch((playErr) => {
              console.warn('Video play error:', playErr);
            });
          }
        };

        setScanStatus('scanning');
        setErrorMessage('');
      }
    } catch (err) {
      console.warn('[QRScanner] getUserMedia error:', err);
      // If environment camera failed, try simple fallback: video: true
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current && isMountedRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                startScanningLoop();
              });
            }
          };
          setScanStatus('scanning');
          setErrorMessage('');
          return;
        }
      } catch (fallbackErr) {
        console.warn('[QRScanner] Fallback getUserMedia failed:', fallbackErr);
      }

      if (isMountedRef.current) {
        setScanStatus('camera_error');
        setErrorMessage(
          'Unable to access camera. Please allow camera permissions or upload a QR image below.'
        );
      }
    }
  };

  /**
   * Switch front/back camera
   */
  const handleSwitchCamera = () => {
    if (availableCameras.length <= 1) return;
    const currentIndex = availableCameras.findIndex(
      (c) => c.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    setSelectedCameraId(nextCamera.deviceId);
    startCamera(nextCamera.deviceId);
  };

  /**
   * Upload QR Image & Instant Decode with multi-scale & inversion attempts
   */
  const handleFileProcess = (file) => {
    if (!file) return;

    setScanStatus('validating');
    setErrorMessage('');
    isProcessingRef.current = true;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setUploadedPreview(previewUrl);

    // Stop live scanning loop
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Check native BarcodeDetector first
          if ('BarcodeDetector' in window) {
            try {
              const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
              const barcodes = await detector.detect(img);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                isProcessingRef.current = false;
                processScannedCode(barcodes[0].rawValue);
                return;
              }
            } catch {
              // fallback to jsQR
            }
          }

          // Test multi-scale dimensions for high-res smartphone photos
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;
          const scales = [1.0, 800 / Math.max(origW, origH), 500 / Math.max(origW, origH)];

          for (const scale of scales) {
            if (scale > 1.2) continue; // Don't upscale tiny images too much
            const targetW = Math.max(100, Math.floor(origW * Math.min(1.0, scale)));
            const targetH = Math.max(100, Math.floor(origH * Math.min(1.0, scale)));

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, targetW, targetH);

            const imageData = ctx.getImageData(0, 0, targetW, targetH);
            const code = jsQR(imageData.data, targetW, targetH, {
              inversionAttempts: 'attemptBoth',
            });

            if (code && code.data) {
              isProcessingRef.current = false;
              processScannedCode(code.data);
              return;
            }

            // Also test horizontally mirrored (selfie mode)
            ctx.save();
            ctx.clearRect(0, 0, targetW, targetH);
            ctx.translate(targetW, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, targetW, targetH);
            ctx.restore();

            const mirroredData = ctx.getImageData(0, 0, targetW, targetH);
            const mirroredCode = jsQR(mirroredData.data, targetW, targetH, {
              inversionAttempts: 'attemptBoth',
            });

            if (mirroredCode && mirroredCode.data) {
              isProcessingRef.current = false;
              processScannedCode(mirroredCode.data);
              return;
            }
          }

          // No QR found
          setScanStatus('error');
          setErrorMessage(
            'Could not find a readable QR code in this image. Please upload a clear photo or screenshot.'
          );
          isProcessingRef.current = false;
        } catch (err) {
          setScanStatus('error');
          setErrorMessage('Error decoding uploaded image: ' + err.message);
          isProcessingRef.current = false;
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    e.target.value = ''; // Reset input to allow selecting same file again
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileProcess(file);
    }
  };

  /**
   * 1-Click Test Simulator for sample products
   */
  const handleSimulateScan = (product) => {
    processScannedCode(`http://localhost:5173/product/${product._id}`);
  };

  // Mount effect: Start camera
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', padding: '20px' }}>
      {/* Hidden offscreen canvas for frame pixel processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div
        className="card"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Camera size={28} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          Scan Your Product
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Place the QR code inside the frame to view verified nutrition and batch details.
        </p>

        {/* Viewfinder Frame Container */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            height: '340px',
            margin: '0 auto 24px',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#111813',
            boxShadow: '0 10px 30px rgba(38, 51, 43, 0.25)',
            border: '3px solid var(--primary)',
          }}
        >
          {/* Direct HTML5 Video element */}
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Reticle Corner Guides */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '36px',
              height: '36px',
              borderTop: '4px solid #D9A441',
              borderLeft: '4px solid #D9A441',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderTop: '4px solid #D9A441',
              borderRight: '4px solid #D9A441',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '36px',
              height: '36px',
              borderBottom: '4px solid #D9A441',
              borderLeft: '4px solid #D9A441',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderBottom: '4px solid #D9A441',
              borderRight: '4px solid #D9A441',
              pointerEvents: 'none',
            }}
          />

          {/* Animated Laser Sweep Line */}
          {scanStatus === 'scanning' && <div className="scanner-laser" />}

          {/* Upload Preview Overlay */}
          {uploadedPreview && scanStatus === 'validating' && (
            <img
              src={uploadedPreview}
              alt="Uploaded QR Preview"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#111813',
              }}
            />
          )}

          {/* Validating State Overlay */}
          {scanStatus === 'validating' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(38, 51, 43, 0.88)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: 'var(--highlight-gold)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '14px',
                }}
              />
              <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                Verifying Product QR...
              </strong>
            </div>
          )}

          {/* Success State Overlay */}
          {scanStatus === 'success' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(62, 142, 65, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                padding: '20px',
                zIndex: 10,
              }}
            >
              <CheckCircle2 size={54} style={{ marginBottom: '12px' }} />
              <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem', marginBottom: '6px' }}>
                Product Verified!
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#EBF7EC', fontWeight: 600 }}>
                {foundProduct?.name}
              </p>
              <span style={{ fontSize: '0.8rem', color: '#D4EED6', marginTop: '4px' }}>
                Opening nutrition dashboard...
              </span>
            </div>
          )}
        </div>

        {/* Camera Controls Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {availableCameras.length > 1 && (
            <button
              onClick={handleSwitchCamera}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
              title="Switch between front/back camera"
            >
              <SwitchCamera size={16} /> Switch Camera
            </button>
          )}

          <button
            onClick={() => startCamera(selectedCameraId)}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px' }}
          >
            <RefreshCw size={15} /> Restart Camera
          </button>
        </div>

        {/* Live Scanning Status Text */}
        {scanStatus === 'scanning' && (
          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--primary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'inline-block',
                animation: 'pulse 1s infinite',
              }}
            />
            Camera Active • Ready to detect QR
          </p>
        )}

        {/* Error / Not Found / Camera Error Alert Box */}
        {(scanStatus === 'error' ||
          scanStatus === 'not_found' ||
          scanStatus === 'camera_error') && (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--danger-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(211, 69, 69, 0.25)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <AlertCircle
              size={22}
              color="var(--danger)"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'var(--danger)', fontSize: '0.95rem', marginBottom: '4px' }}>
                {scanStatus === 'not_found'
                  ? 'Product Not Found'
                  : scanStatus === 'camera_error'
                  ? 'Camera Notice'
                  : 'QR Scan Error'}
              </h4>
              <p style={{ color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                {errorMessage}
              </p>
              {scannedRawText && (
                <code
                  style={{
                    display: 'block',
                    marginTop: '6px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    wordBreak: 'break-all',
                  }}
                >
                  Scanned content: {scannedRawText}
                </code>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(scanStatus === 'error' ||
            scanStatus === 'not_found' ||
            scanStatus === 'camera_error') && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => startCamera(selectedCameraId)}
                className="btn btn-primary btn-sm"
              >
                <RotateCcw size={15} />
                Try Scanning Again
              </button>
              <Link to="/" className="btn btn-outline btn-sm">
                Back to Home
              </Link>
            </div>
          )}

          {/* Upload QR Image & Browse Products Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <label
              className="btn btn-gold btn-sm"
              style={{
                cursor: 'pointer',
                margin: 0,
                fontWeight: 700,
              }}
            >
              <Upload size={16} />
              Upload QR Image / Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <Link to="/products" className="btn btn-outline-brown btn-sm">
              <ShoppingBag size={16} />
              Browse Products Instead
            </Link>
          </div>
        </div>

        {/* 1-Click Test Simulator for Verification */}
        {sampleProducts.length > 0 && (
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px dashed var(--border)',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent-brown)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              ⚡ Instant 1-Click QR Test Simulator
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sampleProducts.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleSimulateScan(p)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                    color: 'var(--text)',
                    fontWeight: 600,
                  }}
                  title={`Simulate scanning QR code for ${p.name}`}
                >
                  ⚡ Scan "{p.name.split(' ')[0]}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
