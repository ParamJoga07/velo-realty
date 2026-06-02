import { useEffect, useState } from 'react';
import './LoadingScreen.css';

// Real-estate ticker items for the diagonal bands
const TICKER_ROWS = [
  // Band 1 — Locations & projects (scrolls left → right)
  [
    'KOKAPET', 'MY HOME RAKA', 'FINANCIAL DISTRICT', 'PRESTIGE GOLDEN GROVE',
    'GACHIBOWLI', 'BRIGADE GATEWAY', 'NARSINGI', 'APARNA SAROVAR',
    'HITEC CITY', 'VAMSIRAM JYOTHI', 'TELLAPUR', 'RAMKY ONE GALAXIA',
    'BACHUPALLY', 'INCOR PBEL CITY', 'KOMPALLY', 'CYBERCITY'
  ],
  // Band 2 — Stats & prices (scrolls right → left)
  [
    'KOKAPET ₹12,500/sqft', 'CAGR +42%', 'GACHIBOWLI ₹9,800/sqft',
    'NARSINGI ₹7,600/sqft', 'CAGR +38%', 'FINANCIAL DISTRICT ₹11,200/sqft',
    'TELLAPUR ₹6,800/sqft', 'CAGR +31%', 'BACHUPALLY ₹5,900/sqft',
    'KOMPALLY ₹5,400/sqft', 'CAGR +29%', 'HITEC CITY ₹10,500/sqft'
  ],
  // Band 3 — Developer names (scrolls left → right)
  [
    'MY HOME CONSTRUCTIONS', 'PRESTIGE GROUP', 'BRIGADE ENTERPRISES',
    'APARNA CONSTRUCTIONS', 'VAMSIRAM BUILDERS', 'RAMKY GROUP',
    'INCOR INFRASTRUCTURE', 'LODHA GROUP', 'GODREJ PROPERTIES',
    'PURAVANKARA', 'SOBHA DEVELOPERS', 'TATA HOUSING'
  ],
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('INITIALIZING VELOCITY');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 2;
      });
    }, 20);

    const phases = [
      { t: 0,  p: 'INITIALIZING VELOCITY' },
      { t: 30, p: 'MAPPING HYDERABAD CORRIDORS' },
      { t: 60, p: 'SYNCING A-LIST DEVELOPERS' },
      { t: 90, p: 'VELO READY' },
    ];
    const phaseTimers = phases.map(ph => setTimeout(() => setPhase(ph.p), ph.t * 12));

    return () => {
      clearInterval(timer);
      phaseTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="ls-screen">
      {/* Subtle grid overlay */}
      <div className="ls-grid-bg" />

      {/* === Diagonal Ticker Bands === */}
      <div className="ls-bands-wrapper">
        {/* Band 1 — tilted up-right, scrolls left */}
        <div className="ls-band ls-band-1">
          <div className="ls-band-track ls-track-left">
            {[...TICKER_ROWS[0], ...TICKER_ROWS[0]].map((item, i) => (
              <span key={i} className="ls-band-item">
                <span className="ls-band-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Band 2 — flat (horizontal), scrolls right */}
        <div className="ls-band ls-band-2">
          <div className="ls-band-track ls-track-right">
            {[...TICKER_ROWS[1], ...TICKER_ROWS[1]].map((item, i) => (
              <span key={i} className="ls-band-item ls-band-item--accent">
                <span className="ls-band-dot ls-band-dot--green" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Band 3 — tilted down-right, scrolls left */}
        <div className="ls-band ls-band-3">
          <div className="ls-band-track ls-track-left ls-track-slow">
            {[...TICKER_ROWS[2], ...TICKER_ROWS[2]].map((item, i) => (
              <span key={i} className="ls-band-item">
                <span className="ls-band-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* === Centre Logo & Progress === */}
      <div className="ls-center">
        {/* Skyline Animation */}
        <div className="ls-logo-wrap">
          <svg className="ls-skyline-svg" viewBox="0 0 120 120">
            {/* Ground */}
            <line x1="5" y1="110" x2="115" y2="110" className="ls-ground-line" />
            
            {/* Building 1 */}
            <path className="ls-bldg-line ls-delay-1" d="M15,110 V80 H25 V110" />
            {/* Building 2 */}
            <path className="ls-bldg-line ls-delay-2" d="M30,110 V60 H45 V110" />
            {/* Main Tower (Velo) */}
            <path className="ls-bldg-line ls-tower ls-delay-3" d="M50,110 V30 L60,20 L70,30 V110" />
            {/* Building 4 */}
            <path className="ls-bldg-line ls-delay-4" d="M75,110 V50 H90 V110" />
            {/* Building 5 */}
            <path className="ls-bldg-line ls-delay-5" d="M95,110 V75 H105 V110" />

            {/* Velo V that drops in */}
            <path className="ls-velo-v-drop" d="M55,45 L60,58 L65,45" />

            {/* Glowing windows that appear later */}
            <g className="ls-windows">
              <rect x="34" y="70" width="3" height="3" />
              <rect x="40" y="70" width="3" height="3" />
              <rect x="34" y="80" width="3" height="3" />
              <rect x="40" y="80" width="3" height="3" />
              <rect x="34" y="90" width="3" height="3" />
              <rect x="40" y="90" width="3" height="3" />

              <rect x="79" y="60" width="3" height="3" />
              <rect x="85" y="60" width="3" height="3" />
              <rect x="79" y="75" width="3" height="3" />
              <rect x="85" y="75" width="3" height="3" />
              <rect x="79" y="90" width="3" height="3" />
              <rect x="85" y="90" width="3" height="3" />
            </g>
          </svg>
          <div className="ls-ring" />
          <div className="ls-glow" />
        </div>

        {/* Info */}
        <div className="ls-info">
          <div className="ls-percent">{progress}<span className="ls-pct-sign">%</span></div>
          <div className="ls-phase">{phase}</div>
          <div className="ls-bar-outer">
            <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
            <div className="ls-bar-glow" style={{ left: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
