const QRCode = require('qrcode');

/**
 * Generate QR code Data URL (Base64 PNG) for a given target URL
 * @param {string} url - The URL to encode in the QR code
 * @param {object} options - Optional styling configuration
 * @returns {Promise<string>} Base64 Data URL
 */
const generateQRCodeDataUrl = async (url, options = {}) => {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      color: {
        dark: '#26332B', // Brand text color
        light: '#FFFFFF',
      },
      width: 400,
      ...options,
    };
    return await QRCode.toDataURL(url, qrOptions);
  } catch (err) {
    console.error('[QRGenerator] Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code image Buffer for direct file downloads or streaming
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise<Buffer>}
 */
const generateQRCodeBuffer = async (url, options = {}) => {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      color: {
        dark: '#26332B',
        light: '#FFFFFF',
      },
      width: 600,
      ...options,
    };
    return await QRCode.toBuffer(url, qrOptions);
  } catch (err) {
    console.error('[QRGenerator] Error generating QR buffer:', err);
    throw new Error('Failed to generate QR image buffer');
  }
};

module.exports = {
  generateQRCodeDataUrl,
  generateQRCodeBuffer,
};
