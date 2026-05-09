import React from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import API_BASE_URL, { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from '../config';

interface ImageUploadProps {
  onSuccess: (url: string) => void;
  onLoading?: (isLoading: boolean) => void;
  folder?: string;
  currentImage?: string;
  label?: string;
  token: string;
}

export function ImageUpload({ onSuccess, onLoading, folder = '/general', currentImage, label, token }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState(currentImage || '');

  const authenticator = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/imagekit/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Auth failed');
      const data = await response.json();
      return {
        signature: data.signature,
        token: data.token,
        expire: data.expire,
      };
    } catch (error) {
      console.error('Authentication error', error);
      throw error;
    }
  };

  const onError = (err: any) => {
    console.error('Upload Error', err);
    setIsUploading(false);
    onLoading?.(false);
    alert('Upload failed. Please try again.');
  };

  const handleSuccess = (res: any) => {
    const url = res.url;
    setPreview(url);
    setIsUploading(false);
    onLoading?.(false);
    onSuccess(url);
  };

  const onUploadStart = () => {
    setIsUploading(true);
    onLoading?.(true);
  };

  return (
    <IKContext
      publicKey={IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="image-upload-v3">
        {label && <label className="upload-label">{label}</label>}
        <div className="upload-container-v3">
          {preview ? (
            <div className="preview-box">
              <img src={preview} alt="Preview" />
              <div className="preview-overlay-actions">
                <button className="remove-preview" onClick={() => { setPreview(''); onSuccess(''); }}>
                  <X size={14} />
                </button>
                <label htmlFor="ik-upload-input" className="change-btn">
                  Change Image
                </label>
              </div>
              <div className="upload-status-badge success">
                <CheckCircle2 size={12} /> Live on CDN
              </div>
            </div>
          ) : (
            <label htmlFor="ik-upload-input" className="upload-placeholder">
              {isUploading ? (
                <div className="upload-spinner"></div>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Click to upload 4K Asset</span>
                  <small>ImageKit.io Optimized</small>
                </>
              )}
            </label>
          )}
          
          <IKUpload
            id="ik-upload-input"
            fileName="velo_asset"
            folder={folder}
            useUniqueFileName={true}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadStart={onUploadStart}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <style>{`
        .image-upload-v3 {
          margin-bottom: 1.5rem;
        }
        .upload-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        .upload-container-v3 {
          width: 100%;
          min-height: 120px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .upload-container-v3:hover {
          border-color: var(--teal-500);
          background: rgba(0, 168, 150, 0.02);
        }
        .upload-placeholder {
          height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
        }
        .upload-placeholder span {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .upload-placeholder small {
          font-size: 0.7rem;
          opacity: 0.6;
        }
        .preview-box {
          position: relative;
          height: 180px;
          width: 100%;
        }
        .preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-box:hover .preview-overlay-actions {
          opacity: 1;
        }
        .preview-overlay-actions {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(4px);
        }
        .change-btn {
          padding: 0.6rem 1.2rem;
          background: var(--teal-500);
          color: white;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .change-btn:hover {
          transform: scale(1.05);
        }
        .remove-preview {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 69, 58, 0.9);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        .upload-status-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          color: var(--teal-500);
          border: 1px solid rgba(0, 168, 150, 0.2);
        }
        .upload-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0, 168, 150, 0.1);
          border-top-color: var(--teal-500);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </IKContext>
  );
}
