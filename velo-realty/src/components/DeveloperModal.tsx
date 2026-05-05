import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { CORRIDOR_MAPS } from './maps/CorridorMaps';
import type { DeveloperProfile, ProjectDetail } from '../types';
import './DeveloperModal.css';

type DeveloperModalProps = {
  developerName: string;
  onClose: () => void;
};

import API_BASE_URL from '../config';

export function DeveloperModal({ developerName, onClose }: DeveloperModalProps) {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch developer by name (partial match via search API)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/developer-profiles/search?name=${encodeURIComponent(developerName)}`
        );
        const data = await res.json();
        if (!data.error) {
          setProfile(data as DeveloperProfile);
        }
      } catch (err) {
        console.error('Failed to fetch developer:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [developerName]);

  const fetchProjectDetail = async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${slug}`);
      const data: ProjectDetail = await res.json();
      setSelectedProject(data);
      setActiveImageIdx(0);
    } catch (err) {
      console.error('Failed to fetch project:', err);
    }
  };

  // --- PROJECT DETAIL VIEW ---
  if (selectedProject) {
    const images = selectedProject.images || [];
    const highlights = selectedProject.highlights?.split(';').map(h => h.trim()).filter(Boolean) || [];

    return (
      <div className="dev-modal-overlay" onClick={onClose}>
        <div className="dev-modal-content dev-modal-project" onClick={(e) => e.stopPropagation()}>
          <button className="dev-modal-close" onClick={onClose}>×</button>
          <button className="dev-modal-back" onClick={() => setSelectedProject(null)}>
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

              {selectedProject.description && (
                <div className="pd-section">
                  <h4>About</h4>
                  <p className="pd-desc">{selectedProject.description}</p>
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
    );
  }

  // --- DEVELOPER PROFILE VIEW ---
  return (
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
                <span className="dev-chip">🏗️ {profile.projects.length} Projects</span>
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
                    <span className="dev-projects-count">{profile.projects.length} projects</span>
                  </div>
                  <div className="dev-projects-grid corridor-grid">
                    {profile.projects.map((project) => (
                      <div
                        key={project.id}
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Projects Grid for Developers */}
                <div className="dev-projects-header">
                  <h3>Active Portfolio</h3>
                  <span className="dev-projects-count">{profile.projects.length} projects</span>
                </div>
                <div className="dev-projects-grid">
                  {profile.projects.map((project) => (
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
  );
}
