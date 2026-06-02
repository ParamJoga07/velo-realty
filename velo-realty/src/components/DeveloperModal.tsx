import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { CORRIDOR_MAPS } from './maps/CorridorMaps';
import type { DeveloperProfile, ProjectDetail } from '../types';
import './DeveloperModal.css';

type DeveloperModalProps = {
  developerName: string;
  onClose: () => void;
  theme?: 'light' | 'dark';
  compareIds?: number[];
  onToggleCompare?: (propertyId: number) => void;
};

import API_BASE_URL from '../config';

// Brochure modal component (inline)
function BrochureModal({ projectName, onClose }: { projectName: string; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `Brochure request for "${projectName}". Please send the brochure to the provided contact details.`,
          property_id: null
        })
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => onClose(), 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="brochure-modal-overlay" onClick={onClose}>
      <div className="brochure-modal-card" onClick={e => e.stopPropagation()}>
        <button className="brochure-modal-close" onClick={onClose}>×</button>
        <div className="brochure-modal-header">
          <div className="brochure-icon">📄</div>
          <h3>Download Brochure</h3>
          <p className="brochure-project-name">{projectName}</p>
          <p className="brochure-subtitle">Our team will send the brochure to you shortly.</p>
        </div>
        <form onSubmit={handleSubmit} className="brochure-form">
          {status === 'success' ? (
            <div className="brochure-success">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
              <h4>Request Sent!</h4>
              <p>We'll send the brochure to your email soon.</p>
            </div>
          ) : (
            <>
              <div className="brochure-field">
                <label>Full Name</label>
                <input type="text" required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="brochure-field">
                <label>Email Address</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="brochure-field">
                <label>Phone Number</label>
                <input type="tel" required placeholder="+91 XXXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              {status === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  Failed to submit. Please try again.
                </p>
              )}
              <div className="brochure-actions">
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Request Brochure'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export function DeveloperModal({ developerName, onClose, compareIds = [], onToggleCompare }: DeveloperModalProps) {
  const { data: profile, isLoading: isLoadingProfile } = useQuery<DeveloperProfile>({
    queryKey: ['developer', developerName],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/developer-profiles/search?name=${encodeURIComponent(developerName)}`
      );
      if (!res.ok) {
        throw new Error('Developer profile not found');
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.detail) throw new Error(data.detail);
      return data as DeveloperProfile;
    },
    enabled: !!developerName
  });

  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [brochureProject, setBrochureProject] = useState<string | null>(null);

  const { data: selectedProject, isLoading: isLoadingProject, error: projectError } = useQuery<ProjectDetail>({
    queryKey: ['project', selectedProjectSlug],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(selectedProjectSlug as string)}`);
      if (!res.ok) {
        throw new Error('Project not found');
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.detail) throw new Error(data.detail);
      return data;
    },
    enabled: !!selectedProjectSlug
  });

  const loading = isLoadingProfile || (selectedProjectSlug ? isLoadingProject : false);

  const fetchProjectDetail = (slug: string) => {
    setSelectedProjectSlug(slug);
    setActiveImageIdx(0);
  };

  // --- PROJECT DETAIL VIEW ---
  if (selectedProjectSlug && projectError) {
    return (
      <div className="dev-modal-overlay" onClick={onClose}>
        <div className="dev-modal-content dev-modal-project" onClick={(e) => e.stopPropagation()}>
          <button className="dev-modal-close" onClick={onClose}>×</button>
          <button className="dev-modal-back" onClick={() => setSelectedProjectSlug(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to {profile?.name || 'Developer'}
          </button>
          <div className="dev-modal-empty" style={{ marginTop: '4rem' }}>
            <div className="dev-empty-icon">⚠️</div>
            <h3>Project Not Found</h3>
            <p>{(projectError as Error).message || 'Unable to load project details.'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    const images = selectedProject.images || [];
    const highlights = selectedProject.highlights?.split(';').map(h => h.trim()).filter(Boolean) || [];
    const amenities = selectedProject.amenities?.split(',').map((a: string) => a.trim()).filter(Boolean) || [];

    return (
      <>
        {brochureProject && <BrochureModal projectName={brochureProject} onClose={() => setBrochureProject(null)} />}
        <div className="dev-modal-overlay" onClick={onClose}>
          <div className="dev-modal-content dev-modal-project" onClick={(e) => e.stopPropagation()}>
            <button className="dev-modal-close" onClick={onClose}>×</button>
            <button className="dev-modal-back" onClick={() => setSelectedProjectSlug(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back to {profile?.name || 'Developer'}
            </button>

            <div className="project-detail-grid">
              {/* Image Gallery */}
              <div className="pd-gallery">
                <div className="pd-gallery-main">
                  {images.length > 0 ? (
                    <img src={images[activeImageIdx]?.image_url} alt={selectedProject.name} />
                  ) : (
                    <div className="pd-gallery-empty">🏗️</div>
                  )}
                  {images.length > 1 && (
                    <>
                      <button className="gallery-nav gallery-prev" onClick={() => setActiveImageIdx(i => i > 0 ? i - 1 : images.length - 1)}>‹</button>
                      <button className="gallery-nav gallery-next" onClick={() => setActiveImageIdx(i => i < images.length - 1 ? i + 1 : 0)}>›</button>
                    </>
                  )}
                  <span className="gallery-count">{activeImageIdx + 1}/{images.length}</span>
                </div>
                {images.length > 1 && (
                  <div className="pd-gallery-thumbs">
                    {images.map((img, idx) => (
                      <img
                        key={img.id}
                        src={img.image_url}
                        alt=""
                        className={`pd-thumb ${idx === activeImageIdx ? 'active' : ''}`}
                        onClick={() => setActiveImageIdx(idx)}
                      />
                    ))}
                  </div>
                )}

                {/* Brochure button under gallery */}
                <button
                  className="brochure-cta-btn"
                  onClick={() => setBrochureProject(selectedProject.name)}
                >
                  📄 Download Brochure
                </button>
              </div>

              {/* Info Panel */}
              <div className="pd-info">
                <div className="pd-header">
                  <span className={`pd-status-pill ${(selectedProject.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedProject.status || 'N/A'}
                  </span>
                  <h2 className="pd-title">{selectedProject.name}</h2>
                  <p className="pd-location">📍 {selectedProject.location}{selectedProject.sub_location ? ` — ${selectedProject.sub_location}` : ''}</p>
                </div>

                {selectedProject.description && (
                  <div className="pd-section" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.8rem' }}>About</h4>
                    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedProject.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <li key={i} style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
                          {line.replace(/^[-\*•]\s*/, '').trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specs */}
                <div className="pd-specs">
                  {selectedProject.price_range && (
                    <div className="pd-spec accent"><span className="pd-spec-label">Price</span><span className="pd-spec-val">{selectedProject.price_range}</span></div>
                  )}
                  {selectedProject.configurations && (
                    <div className="pd-spec"><span className="pd-spec-label">Config</span><span className="pd-spec-val">{selectedProject.configurations}</span></div>
                  )}
                  {selectedProject.land_area && (
                    <div className="pd-spec"><span className="pd-spec-label">Land</span><span className="pd-spec-val">{selectedProject.land_area}</span></div>
                  )}
                  {selectedProject.structure && (
                    <div className="pd-spec"><span className="pd-spec-label">Structure</span><span className="pd-spec-val">{selectedProject.structure}</span></div>
                  )}
                  {selectedProject.total_units && (
                    <div className="pd-spec"><span className="pd-spec-label">Units</span><span className="pd-spec-val">{selectedProject.total_units}</span></div>
                  )}
                  {selectedProject.size_range && (
                    <div className="pd-spec"><span className="pd-spec-label">Sizes</span><span className="pd-spec-val">{selectedProject.size_range}</span></div>
                  )}
                  {selectedProject.open_space && (
                    <div className="pd-spec"><span className="pd-spec-label">Open Space</span><span className="pd-spec-val">{selectedProject.open_space}</span></div>
                  )}
                  {selectedProject.possession && (
                    <div className="pd-spec"><span className="pd-spec-label">Possession</span><span className="pd-spec-val">{selectedProject.possession}</span></div>
                  )}
                  {selectedProject.clubhouse_size && (
                    <div className="pd-spec"><span className="pd-spec-label">Clubhouse</span><span className="pd-spec-val">{selectedProject.clubhouse_size}</span></div>
                  )}
                </div>

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div className="pd-section">
                    <h4>✦ Key Highlights</h4>
                    <div className="pd-chips">
                      {highlights.map((h, i) => <span key={i} className="pd-chip">{h}</span>)}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div className="pd-section">
                    <h4>🏊 Amenities</h4>
                    <div className="pd-amenities-chips">
                      {amenities.map((a: string, i: number) => <span key={i} className="pd-amenity-chip">{a}</span>)}
                    </div>
                  </div>
                )}

                {selectedProject.connectivity && (
                  <div className="pd-section">
                    <h4>🔗 Connectivity</h4>
                    <p className="pd-desc">{selectedProject.connectivity}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- DEVELOPER PROFILE VIEW ---
  return (
    <>
      {brochureProject && <BrochureModal projectName={brochureProject} onClose={() => setBrochureProject(null)} />}
      <div className="dev-modal-overlay" onClick={onClose}>
        <div className="dev-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="dev-modal-close" onClick={onClose}>×</button>

          {loading ? (
            <div className="dev-modal-loading">
              <div className="dev-loading-spinner" />
              <p>Loading developer profile...</p>
            </div>
          ) : profile ? (
            <>
              {/* Developer Header */}
              <div className={`dev-profile-header ${profile.type?.toLowerCase().includes('corridor') ? 'corridor-mode' : ''}`}>
                <div className="dev-header-main">
                  {profile.logo_url && !profile.type?.toLowerCase().includes('corridor') && (
                    <div className="dev-header-image">
                      <img src={profile.logo_url} alt={profile.name} />
                    </div>
                  )}
                  <div className="dev-header-text">
                    <div className="dev-profile-badge">{profile.type || 'A-List Developer'}</div>
                    <h2 className="dev-profile-name">{profile.name}</h2>
                  </div>
                </div>
                <p className="dev-profile-about">{profile.about}</p>
                <div className="dev-profile-chips">
                  {profile.founded_year && <span className="dev-chip">🏛️ Est. {profile.founded_year}</span>}
                  {profile.headquarters && <span className="dev-chip">📍 {profile.headquarters}</span>}
                  <span className="dev-chip">🏗️ {profile.project_count || profile.project_items?.length || 0} Projects</span>
                </div>
              </div>

              {profile.type?.toLowerCase().includes('corridor') ? (
                <div className="corridor-detail-split">
                  <div className="corridor-map-side">
                    {CORRIDOR_MAPS[profile.slug] || CORRIDOR_MAPS[profile.name.toLowerCase().replace(/\s+/g, '-')] || (
                      <div className="map-placeholder">
                        <MapPin size={40} />
                        <p>Map view for {profile.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="corridor-list-side">
                    <div className="dev-projects-header">
                      <h3>Active Properties</h3>
                      <span className="dev-projects-count">{(profile.project_items?.length || 0) + (profile.properties?.length || 0)} assets</span>
                    </div>
                    <div className="dev-projects-grid corridor-grid">
                      {(profile.properties || []).map((prop: any) => (
                        <div key={`prop-${prop.id}`} className="dev-project-card property-variant">
                           <div className="dpc-image">
                              <img src={prop.image} alt={prop.title} />
                              <div className="dpc-badge">{prop.status}</div>
                           </div>
                           <div className="dpc-body">
                              <h4 className="dpc-name">{prop.title}</h4>
                              <p className="dpc-location">{prop.location}</p>
                              <div className="dpc-footer">
                                 <span className="dpc-price">{prop.price}</span>
                                 <span className="dpc-config">{prop.beds}B • {prop.area} FT²</span>
                              </div>
                              {onToggleCompare && (
                                <button
                                  className={`compare-card-btn ${compareIds.includes(prop.id) ? 'active' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleCompare(prop.id);
                                  }}
                                  style={{ marginTop: '0.75rem', width: '100%' }}
                                >
                                  {compareIds.includes(prop.id) ? '✓ Compare' : '+ Compare'}
                                </button>
                              )}
                           </div>
                        </div>
                      ))}

                      {(profile.project_items || []).map((project: any) => (
                        <div
                          key={`proj-${project.id}`}
                          className="dev-project-card"
                          onClick={() => fetchProjectDetail(project.slug)}
                        >
                          <div className="dpc-image">
                            {project.primary_image ? (
                              <img src={project.primary_image} alt={project.name} />
                            ) : (
                              <div className="dpc-image-placeholder">🏢</div>
                            )}
                            <div className="dpc-badge">{project.status}</div>
                            <div className="dpc-overlay"><span>View Details</span></div>
                          </div>
                          <div className="dpc-body">
                            <h4 className="dpc-name">{project.name}</h4>
                            <p className="dpc-location">{project.location}</p>
                            <div className="dpc-footer">
                              <span className="dpc-price">{project.price_range}</span>
                              <span className="dpc-config">{project.configurations}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                              <button
                                className="dpc-brochure-btn"
                                style={{ flex: 1 }}
                                onClick={e => { e.stopPropagation(); setBrochureProject(project.name); }}
                              >
                                📄 Brochure
                              </button>
                              {onToggleCompare && project.id && (
                                <button
                                  className={`compare-card-btn ${compareIds.includes(project.id) ? 'active' : ''}`}
                                  style={{ flex: 1 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleCompare(project.id);
                                  }}
                                >
                                  {compareIds.includes(project.id) ? '✓ Compare' : '+ Compare'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="dev-projects-header">
                    <h3>Active Portfolio</h3>
                    <span className="dev-projects-count">
                      {(profile.project_items?.length || 0) + (profile.properties?.length || 0)} assets
                    </span>
                  </div>
                  <div className="dev-projects-grid">
                    {/* Render Properties */}
                    {(profile.properties || []).map((prop: any) => (
                      <div key={`prop-${prop.id}`} className="dev-project-card property-variant">
                         <div className="dpc-image">
                            <img src={prop.image} alt={prop.title} />
                            <div className={`dpc-badge ${prop.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                              {prop.status}
                            </div>
                         </div>
                         <div className="dpc-body">
                            <h4 className="dpc-name">{prop.title}</h4>
                            <p className="dpc-location">📍 {prop.location}</p>
                            <div className="dpc-footer">
                               <span className="dpc-price">{prop.price}</span>
                               <span className="dpc-config">{prop.beds}B • {prop.area} FT²</span>
                            </div>
                            {onToggleCompare && (
                              <button
                                className={`compare-card-btn ${compareIds.includes(prop.id) ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleCompare(prop.id);
                                }}
                                style={{ marginTop: '0.75rem', width: '100%' }}
                              >
                                {compareIds.includes(prop.id) ? '✓ Compare' : '+ Compare'}
                              </button>
                            )}
                         </div>
                      </div>
                    ))}

                    {/* Render Projects */}
                    {(profile.project_items || []).map((project: any) => (
                      <div
                        key={project.id}
                        className="dev-project-card"
                        onClick={() => fetchProjectDetail(project.slug)}
                      >
                        <div className="dpc-image">
                          {project.primary_image ? (
                            <img src={project.primary_image} alt={project.name} />
                          ) : (
                            <div className="dpc-image-placeholder">
                              <span>🏗️</span>
                            </div>
                          )}
                          {project.status && (
                            <span className={`dpc-badge ${(project.status).toLowerCase().replace(/\s+/g, '-')}`}>
                              {project.status}
                            </span>
                          )}
                          <div className="dpc-overlay">
                            <span>View Details →</span>
                          </div>
                        </div>
                        <div className="dpc-body">
                          <h4 className="dpc-name">{project.name}</h4>
                          <p className="dpc-location">📍 {project.location}</p>
                          <div className="dpc-footer">
                            {project.price_range && <span className="dpc-price">{project.price_range}</span>}
                            <span className="dpc-config">{project.configurations || project.project_type}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <button
                              className="dpc-brochure-btn"
                              style={{ flex: 1 }}
                              onClick={e => { e.stopPropagation(); setBrochureProject(project.name); }}
                            >
                              📄 Brochure
                            </button>
                            {onToggleCompare && project.id && (
                              <button
                                className={`compare-card-btn ${compareIds.includes(project.id) ? 'active' : ''}`}
                                style={{ flex: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleCompare(project.id);
                                }}
                              >
                                {compareIds.includes(project.id) ? '✓ Compare' : '+ Compare'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="dev-modal-empty">
              <div className="dev-empty-icon">🏢</div>
              <h3>{developerName}</h3>
              <p>Developer portfolio details coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
