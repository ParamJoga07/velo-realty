import React from 'react';
import { IKContext } from 'imagekitio-react';
import { Upload, X, CheckCircle2, Plus } from 'lucide-react';
import API_BASE_URL, { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from '../config';

interface MultiImageUploadProps {
  onSuccess: (urls: string[]) => void;
  folder?: string;
  currentImages?: string[];
  token: string;
}

export function MultiImageUpload({ onSuccess, folder = '/gallery', currentImages = [], token }: MultiImageUploadProps) {
  const [images, setImages] = React.useState<string[]>(currentImages);
  const [uploadingCount, setUploadingCount] = React.useState(0);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCount(files.length);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const auth = await authenticator(); // Get a FRESH signature for EACH file
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
      formData.append('signature', auth.signature);
      formData.append('expire', auth.expire.toString());
      formData.append('token', auth.token);
      formData.append('folder', folder);
      formData.append('useUniqueFileName', 'true');

      try {
        const res = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error('Upload failed for file', file.name, err);
      }
      setUploadingCount(prev => prev - 1);
    }

    const updatedImages = [...images, ...newUrls];
    setImages(updatedImages);
    onSuccess(updatedImages);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onSuccess(updated);
  };

  return (
    <div className="multi-upload-v3">
      <div className="multi-upload-grid">
        {images.map((url, idx) => (
          <div key={idx} className="multi-preview-item">
            <img src={url} alt="Gallery" />
            <button className="remove-btn" onClick={() => removeImage(idx)}>
              <X size={14} />
            </button>
            <div className="status-tag"><CheckCircle2 size={10} /> CDN</div>
          </div>
        ))}
        
        <label className="add-more-card">
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
          {uploadingCount > 0 ? (
            <div className="upload-loader">
              <div className="spinner"></div>
              <span>{uploadingCount} Left</span>
            </div>
          ) : (
            <>
              <Plus size={24} />
              <span>Add 4K Assets</span>
            </>
          )}
        </label>
      </div>

      <style>{`
        .multi-upload-v3 {
          width: 100%;
          margin-top: 1rem;
        }
        .multi-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
        }
        .multi-preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .multi-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 69, 58, 0.9);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .multi-preview-item:hover .remove-btn {
          opacity: 1;
        }
        .status-tag {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(0,0,0,0.7);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          color: var(--teal-500);
          display: flex;
          align-items: center;
          gap: 3px;
          font-weight: 800;
        }
        .add-more-card {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 1px dashed rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
          color: rgba(255,255,255,0.4);
        }
        .add-more-card:hover {
          border-color: var(--teal-500);
          background: rgba(0, 168, 150, 0.05);
          color: var(--teal-500);
        }
        .add-more-card span {
          font-size: 0.75rem;
          font-weight: 700;
        }
        .upload-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 168, 150, 0.1);
          border-top-color: var(--teal-500);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
