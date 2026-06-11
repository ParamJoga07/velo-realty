import React from 'react';
import './ColorPreview.css';

interface ColorPreviewProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ theme, onThemeToggle }) => {
  return (
    <div className="color-preview-page page" data-theme={theme}>
      <header className="color-preview-header">
        <div className="preview-container">
          <div className="header-flex">
            <div>
              <a href="/" className="back-link">← Back to Main App</a>
              <h1>Color Token System Preview</h1>
              <p className="subtitle">Premium Design System — B · Grove Palette</p>
            </div>
            <button onClick={onThemeToggle} className="theme-toggle-btn">
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </header>

      <main className="preview-container preview-main-content">
        {/* Token Section */}
        <section className="preview-section">
          <h2>1. Palette & Surface Tokens</h2>
          <div className="token-grid">
            <div className="token-group">
              <h3>Surfaces</h3>
              <div className="token-cards-row">
                <div className="token-preview-card" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                  <span className="token-label">--bg-page</span>
                  <span className="token-value">#F8F8F3</span>
                  <span className="token-desc">Warm linen base page background</span>
                </div>
                <div className="token-preview-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span className="token-label">--bg-surface</span>
                  <span className="token-value">#FFFFFF</span>
                  <span className="token-desc">Elevated content cards, navbars</span>
                </div>
                <div className="token-preview-card" style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)' }}>
                  <span className="token-label">--bg-surface-alt</span>
                  <span className="token-value">#EEF1E9</span>
                  <span className="token-desc">Alternate sections and fills</span>
                </div>
                <div className="token-preview-card" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <span className="token-label">--bg-elevated</span>
                  <span className="token-value">#FAFBF8</span>
                  <span className="token-desc">Modals, dropdown panels</span>
                </div>
              </div>
            </div>

            <div className="token-group">
              <h3>Borders & Dividers</h3>
              <div className="token-cards-row">
                <div className="token-preview-card" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', borderStyle: 'solid', borderWidth: '1px' }}>
                  <span className="token-label">--border-subtle</span>
                  <span className="token-value">#E7EAE0</span>
                  <span className="token-desc">Subtle hairline layout dividers</span>
                </div>
                <div className="token-preview-card" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderStyle: 'solid', borderWidth: '1px' }}>
                  <span className="token-label">--border-default</span>
                  <span className="token-value">#D5D9CC</span>
                  <span className="token-desc">Card boundaries, input outlines</span>
                </div>
                <div className="token-preview-card" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-strong)', borderStyle: 'solid', borderWidth: '2px' }}>
                  <span className="token-label">--border-strong</span>
                  <span className="token-value">#2F5D50</span>
                  <span className="token-desc">Focus outlines and headers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="preview-section">
          <h2>2. Typography Tokens</h2>
          <div className="typography-box" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', borderStyle: 'solid', borderWidth: '1px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Heading 1 (var(--text-primary) - #1C241E)</h3>
            <p className="text-secondary-desc" style={{ color: 'var(--text-secondary)' }}>
              Body text: Velo Realty provides an elite investment framework with premium real estate listings (var(--text-secondary) - #3F463E).
            </p>
            <p className="text-muted-desc" style={{ color: 'var(--text-muted)' }}>
              Captions & metadata: Updated 2 hours ago • pre-launch status (var(--text-muted) - #6F776D).
            </p>
            <div className="inverse-box" style={{ background: 'var(--primary)', color: 'var(--text-inverse)' }}>
              Inverse Text: Forest Sage Brand Background with pure white labels (var(--text-inverse) - #FFFFFF)
            </div>
          </div>
        </section>

        {/* Action Tones & States */}
        <section className="preview-section">
          <h2>3. Action Tones & Interactive States</h2>
          <div className="actions-flex">
            <div className="action-col">
              <h3>Primary Brand Actions (Forest Sage)</h3>
              <div className="button-states-list">
                <div>
                  <button className="preview-btn" style={{ background: 'var(--primary)', color: 'var(--text-inverse)', border: 'none' }}>
                    Default State
                  </button>
                  <span className="btn-state-label">--primary (#2F5D50)</span>
                </div>
                <div>
                  <button className="preview-btn" style={{ background: 'var(--primary-hover)', color: 'var(--text-inverse)', border: 'none' }}>
                    Hover State
                  </button>
                  <span className="btn-state-label">--primary-hover (#264B41)</span>
                </div>
                <div>
                  <button className="preview-btn" style={{ background: 'var(--primary-active)', color: 'var(--text-inverse)', border: 'none' }}>
                    Active State
                  </button>
                  <span className="btn-state-label">--primary-active (#1E3932)</span>
                </div>
                <div>
                  <button className="preview-btn" disabled style={{ background: 'var(--primary-subtle)', color: 'var(--text-muted)', border: 'none', cursor: 'not-allowed' }}>
                    Disabled
                  </button>
                  <span className="btn-state-label">--primary-subtle (#E3EDE8)</span>
                </div>
              </div>
            </div>

            <div className="action-col">
              <h3>Accent Highlight Actions (Warm Gold)</h3>
              <div className="button-states-list">
                <div>
                  <button className="preview-btn" style={{ background: 'var(--accent)', color: 'var(--text-inverse)', border: 'none' }}>
                    Accent Highlight
                  </button>
                  <span className="btn-state-label">--accent (#C29A45)</span>
                </div>
                <div>
                  <button className="preview-btn" style={{ background: 'var(--accent-hover)', color: 'var(--text-inverse)', border: 'none' }}>
                    Accent Hover
                  </button>
                  <span className="btn-state-label">--accent-hover (#A68235)</span>
                </div>
                <div>
                  <div className="accent-subtle-badge" style={{ background: 'var(--accent-subtle)', color: 'var(--primary)', border: '1px solid var(--accent)' }}>
                    Golden Badge Accent Subtle
                  </div>
                  <span className="btn-state-label">--accent-subtle (#F5EFDC)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs & Forms */}
        <section className="preview-section">
          <h2>4. Form States</h2>
          <div className="form-preview-grid">
            <div className="form-group-sample">
              <label style={{ color: 'var(--text-primary)' }}>Standard Label</label>
              <input type="text" placeholder="Default placeholder (var(--text-muted))" className="preview-input" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }} />
            </div>
            <div className="form-group-sample">
              <label style={{ color: 'var(--text-primary)' }}>Focus State</label>
              <input type="text" value="Active search/input typing..." className="preview-input focus-simulated" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', boxShadow: '0 0 0 3px rgba(47, 93, 80, 0.18)' }} />
            </div>
          </div>
        </section>

        {/* Semantics Alert Section */}
        <section className="preview-section">
          <h2>5. Semantic Alerts</h2>
          <div className="semantic-grid">
            <div className="semantic-chip" style={{ background: 'var(--success-subtle)', borderColor: 'var(--success)', borderStyle: 'solid', borderWidth: '1px', color: 'var(--success)' }}>
              <strong>✓ Success:</strong> Action completed successfully (var(--success-subtle) / var(--success))
            </div>
            <div className="semantic-chip" style={{ background: 'var(--warning-subtle)', borderColor: 'var(--warning)', borderStyle: 'solid', borderWidth: '1px', color: 'var(--warning)' }}>
              <strong>⚠ Warning:</strong> Check details before pre-launch (var(--warning-subtle) / var(--warning))
            </div>
            <div className="semantic-chip" style={{ background: 'var(--error-subtle)', borderColor: 'var(--error)', borderStyle: 'solid', borderWidth: '1px', color: 'var(--error)' }}>
              <strong>✗ Error:</strong> High-risk investment threshold reached (var(--error-subtle) / var(--error))
            </div>
            <div className="semantic-chip" style={{ background: 'var(--info-subtle)', borderColor: 'var(--info)', borderStyle: 'solid', borderWidth: '1px', color: 'var(--info)' }}>
              <strong>ℹ Info:</strong> Pre-Launch registration window open (var(--info-subtle) / var(--info))
            </div>
          </div>
        </section>

        {/* Elevation Shadows Section */}
        <section className="preview-section">
          <h2>6. Elevational Shadows</h2>
          <div className="shadows-row">
            <div className="shadow-preview-card" style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4>Small Shadow (--shadow-sm)</h4>
              <p>For chips, sliders and filter tab selectors</p>
            </div>
            <div className="shadow-preview-card" style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-subtle)' }}>
              <h4>Medium Shadow (--shadow-md)</h4>
              <p>For property listing cards and dropdown menus</p>
            </div>
            <div className="shadow-preview-card" style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>
              <h4>Large Shadow (--shadow-lg)</h4>
              <p>For modular details, blog popups and sidebar panels</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
