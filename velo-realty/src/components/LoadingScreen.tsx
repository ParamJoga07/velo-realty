import { useEffect, useState } from 'react';
import './LoadingScreen.css';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('CALIBRATING');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    const phases = [
      { t: 0, p: 'INITIALIZING VELOCITY' },
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
    <div className="loading-screen-v2">
      <div className="loading-grid-bg"></div>
      <div className="loading-container">
        <div className="loading-visual-wrap">
          <svg className="loading-svg" viewBox="0 0 100 100">
            {/* Architectural Grid Sketch */}
            <path className="sketch-line" d="M10,90 L90,90 L90,10 L10,10 Z" />
            <path className="sketch-line delay-1" d="M20,90 L20,30 L80,30 L80,90" />
            <path className="sketch-line delay-2" d="M40,90 L40,50 L60,50 L60,90" />
            
            {/* The Velo V */}
            <path className="velo-v-path" d="M30,30 L50,70 L70,30" />
          </svg>
          <div className="velocity-ring"></div>
          <div className="glow-point"></div>
        </div>

        <div className="loading-info">
          <div className="loading-percentage">{progress}%</div>
          <div className="loading-phase-text">{phase}</div>
          <div className="loading-bar-outer">
            <div className="loading-bar-inner" style={{ width: `${progress}%` }}></div>
            <div className="loading-bar-glow" style={{ left: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
