import React, { useState, useRef } from 'react';
import { parseOtpAuthUri, TOTPEntry } from '../utils/totp';
import { addEntry } from '../utils/storage';
import jsQR from 'jsqr';
import QrScanner from 'qr-scanner';

interface RegistrationPageProps {
  onEntryAdded: (entry: TOTPEntry) => void;
  onBack: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onEntryAdded, onBack }) => {
  const [uri, setUri] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'upload' | 'camera'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const processQRCode = (qrData: string) => {
    setError('');
    setSuccess('');

    const entry = parseOtpAuthUri(qrData.trim());
    if (!entry) {
      setError('Invalid QR code format. Expected otpauth:// URI');
      return;
    }

    try {
      addEntry(entry);
      onEntryAdded(entry);
      setSuccess('2FA entry added successfully!');
      setUri('');
      setTimeout(() => {
        setSuccess('');
        onBack();
      }, 1500);
    } catch (err) {
      setError('Failed to add entry');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uri.trim()) {
      setError('Please enter an otpauth URI');
      return;
    }
    processQRCode(uri.trim());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            processQRCode(code.data);
          } else {
            setError('No QR code found in the image');
          }
        }
      };
      
      img.onerror = () => {
        setError('Failed to load image');
      };
      
      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Failed to process image');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startCameraScanning = async () => {
    if (!videoRef.current) return;
    
    setError('');
    setIsScanning(true);
    
    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          processQRCode(result.data);
          stopCameraScanning();
        },
        {
          onDecodeError: (err) => {
            // Ignore decode errors during scanning
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      qrScannerRef.current = qrScanner;
      await qrScanner.start();
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  const stopCameraScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      stopCameraScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-pixel-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-pixel font-bold text-pixel-text">
          ADD NEW AUTHENTICATOR
        </h2>
        <p className="mt-2 text-center text-sm font-pixel text-pixel-muted">
          Choose your preferred method below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-pixel-surface py-8 px-4 shadow-pixel-lg rounded-pixel border-2 border-pixel-primary sm:px-10">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b-2 border-pixel-text">
              <nav className="-mb-px flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className={`py-2 px-3 border-b-2 font-pixel font-bold text-sm rounded-pixel ${
                    activeTab === 'manual'
                      ? 'border-pixel-accent text-pixel-accent bg-pixel-bg'
                      : 'border-transparent text-pixel-muted hover:text-pixel-text hover:bg-pixel-primary'
                  }`}
                >
                  MANUAL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 px-3 border-b-2 font-pixel font-bold text-sm rounded-pixel ${
                    activeTab === 'upload'
                      ? 'border-pixel-accent text-pixel-accent bg-pixel-bg'
                      : 'border-transparent text-pixel-muted hover:text-pixel-text hover:bg-pixel-primary'
                  }`}
                >
                  UPLOAD
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className={`py-2 px-3 border-b-2 font-pixel font-bold text-sm rounded-pixel ${
                    activeTab === 'camera'
                      ? 'border-pixel-accent text-pixel-accent bg-pixel-bg'
                      : 'border-transparent text-pixel-muted hover:text-pixel-text hover:bg-pixel-primary'
                  }`}
                >
                  SCAN
                </button>
              </nav>
            </div>
          </div>

          {/* Manual Entry Tab */}
          {activeTab === 'manual' && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="uri" className="block text-sm font-pixel font-bold text-pixel-text">
                  OTP AUTH URI
                </label>
                <div className="mt-1">
                  <textarea
                    id="uri"
                    name="uri"
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border-2 border-pixel-text rounded-pixel bg-pixel-bg text-pixel-text font-pixel placeholder-pixel-muted focus:outline-none focus:border-pixel-accent sm:text-sm shadow-pixel-inset"
                    placeholder="otpauth://totp/Example:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example"
                    value={uri}
                    onChange={(e) => setUri(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm font-pixel text-pixel-muted">
                  Example: otpauth://totp/Google:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Google
                </p>
              </div>

              {error && (
                <div className="rounded-pixel bg-pixel-bg border-2 border-pixel-red p-4 shadow-pixel">
                  <div className="text-sm font-pixel text-pixel-red">{error}</div>
                </div>
              )}

              {success && (
                <div className="rounded-pixel bg-pixel-bg border-2 border-pixel-green p-4 shadow-pixel">
                  <div className="text-sm font-pixel text-pixel-green">{success}</div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-primary hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                >
                  {'<< BACK'}
                </button>
                <button
                  type="submit"
                  className="flex-1 justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-accent hover:bg-pixel-purple hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                >
                  {'ADD ENTRY >>'}
                </button>
              </div>
            </form>
          )}

          {/* Upload QR Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-pixel font-bold text-pixel-text mb-2">
                  UPLOAD QR CODE IMAGE
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pixel-text border-dashed rounded-pixel bg-pixel-bg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-pixel-muted"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm font-pixel text-pixel-text">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-pixel-surface rounded-pixel font-pixel font-bold text-pixel-accent hover:text-pixel-purple focus-within:outline-none px-2 py-1 border-2 border-pixel-accent"
                      >
                        <span>UPLOAD FILE</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1 font-pixel">or drag and drop</p>
                    </div>
                    <p className="text-xs font-pixel text-pixel-muted">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="w-full justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-primary hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
              >
                {'<< BACK'}
              </button>
            </div>
          )}

          {/* Camera Scan Tab */}
          {activeTab === 'camera' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-pixel font-bold text-pixel-text mb-2">
                  SCAN QR CODE WITH CAMERA
                </label>
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-64 bg-pixel-bg rounded-pixel border-2 border-pixel-text"
                    style={{ display: isScanning ? 'block' : 'none' }}
                  />
                  {!isScanning && (
                    <div className="w-full h-64 bg-pixel-bg rounded-pixel border-2 border-pixel-text flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-pixel-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-pixel text-pixel-muted">
                          CLICK START TO BEGIN SCANNING
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-primary hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                >
                  {'<< BACK'}
                </button>
                {!isScanning ? (
                  <button
                    type="button"
                    onClick={startCameraScanning}
                    className="flex-1 justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-green hover:bg-pixel-accent hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                  >
                    {'START SCAN >>'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCameraScanning}
                    className="flex-1 justify-center py-3 px-4 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-red hover:bg-pixel-purple hover:shadow-pixel-inset focus:outline-none transition-all duration-150 animate-pixel-pulse"
                  >
                    STOP SCAN
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;