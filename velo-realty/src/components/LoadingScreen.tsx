import { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';

type LoadingScreenProps = {
  theme?: 'light' | 'dark';
  dataLoaded: boolean;
  onComplete: () => void;
};

// Investment and city corridor facts to engage the user
const REAL_ESTATE_FACTS = [
  "Kokapet is known as the 'Golden Mile' of Hyderabad real estate, showing up to +42% CAGR in recent years.",
  "Hyderabad's Outer Ring Road (ORR) is a 158 km expressway connecting all major IT hubs and growth zones.",
  "Tellapur villa developments have seen massive demand, with a projected capital appreciation of +20% by Q4 2027.",
  "Financial District is home to some of the world's largest corporate and technology campuses.",
  "Narsingi has emerged as a key residential hotspot due to its immediate access to Gachibowli and the ORR.",
  "Velo Realty's analytics engine scans A-List developer portfolios to locate high-yield, off-market villa and high-rise opportunities.",
  "Tellapur and Mokila are top picks for premium villa residences, offering modern lifestyles close to IT corridors.",
  "Hyderabad leads major Indian metropolitan areas in structured commercial office absorption and rental yields."
];

// Live price data feeds for the interactive floating bubbles
const PRICE_FEEDS = [
  { area: "Kokapet", price: "₹12,500 / sft", cagr: "+42% CAGR" },
  { area: "Gachibowli", price: "₹9,800 / sft", cagr: "+38% CAGR" },
  { area: "Financial Dist", price: "₹11,200 / sft", cagr: "+31% CAGR" },
  { area: "Tellapur", price: "₹6,800 / sft", cagr: "+20% CAGR" },
  { area: "Narsingi", price: "₹7,600 / sft", cagr: "+35% CAGR" },
  { area: "Mokila", price: "₹5,200 / sft", cagr: "+28% CAGR" },
  { area: "Bachupally", price: "₹5,900 / sft", cagr: "+25% CAGR" },
  { area: "Kompally", price: "₹5,400 / sft", cagr: "+22% CAGR" },
  { area: "Manikonda", price: "₹6,900 / sft", cagr: "+27% CAGR" },
  { area: "Miyapur", price: "₹5,800 / sft", cagr: "+21% CAGR" },
  { area: "Kollur", price: "₹6,300 / sft", cagr: "+29% CAGR" },
  { area: "Hitec City", price: "₹10,500 / sft", cagr: "+33% CAGR" }
];

export function LoadingScreen({ theme = 'dark', dataLoaded, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('INITIALIZING VELOCITY');
  const [factIndex, setFactIndex] = useState(0);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  
  // Interactive floating price feeds
  const [pricingNodes, setPricingNodes] = useState<Array<{
    id: number;
    area: string;
    price: string;
    cagr: string;
    x: number;
    y: number;
    driftType: number;
  }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spawnBurstRef = useRef<((x: number, y: number) => void) | null>(null);

  // Auto-progress counter
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        // Auto-increment logic
        if (!dataLoaded) {
          // Slow down and wait for data near completion
          if (prev < 88) return prev + 0.4;
          if (prev < 98) return prev + 0.1;
          return prev; // Cap at 98%
        } else {
          // Speed up to 100% since data is loaded
          return prev + 1.8;
        }
      });
    }, 30);

    return () => clearInterval(timer);
  }, [dataLoaded]);

  // Phase controller and completion callback
  useEffect(() => {
    if (progress < 25) {
      setPhase('INITIALIZING VELOCITY');
    } else if (progress < 55) {
      setPhase('MAPPING HYDERABAD CORRIDORS');
    } else if (progress < 80) {
      setPhase('SYNCING A-LIST DEVELOPERS');
    } else if (progress < 99) {
      setPhase('HARMONIZING REAL-TIME FEEDS');
    } else {
      setPhase('VELO READY');
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  // Helper to generate a random coordinate that avoids overlaps and the center logo
  const getRandPosition = (existing: any[] = []) => {
    let x = 0;
    let y = 0;
    let attempts = 0;
    
    while (attempts < 150) {
      // Pick coordinates (stay within safe viewport margins)
      x = Math.random() * 74 + 8; // 8% to 82%
      y = Math.random() * 56 + 18; // 18% to 74%
      
      const distFromCenter = Math.sqrt((x - 50) * (x - 50) + (y - 50) * (y - 50));
      const tooCloseToOther = existing.some(e => {
        const dx = e.x - x;
        const dy = e.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 13; // closer packing bounds
      });
      
      if (distFromCenter > 20 && !tooCloseToOther) {
        break;
      }
      attempts++;
    }
    
    // Safety fallback if no non-overlapping coordinates found in attempts
    if (attempts >= 150) {
      x = Math.random() * 74 + 8;
      y = Math.random() * 56 + 18;
    }
    
    return { x, y };
  };

  // Initialize interactive pricing nodes
  useEffect(() => {
    const initialNodes = [];
    const usedIndices = new Set<number>();
    
    while (initialNodes.length < 10) {
      const idx = Math.floor(Math.random() * PRICE_FEEDS.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        const { x, y } = getRandPosition(initialNodes);
        initialNodes.push({
          id: Date.now() + initialNodes.length,
          area: PRICE_FEEDS[idx].area,
          price: PRICE_FEEDS[idx].price,
          cagr: PRICE_FEEDS[idx].cagr,
          x,
          y,
          driftType: Math.floor(Math.random() * 3) + 1
        });
      }
    }
    setPricingNodes(initialNodes);
  }, []);

  // Auto-cycle trivia facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % REAL_ESTATE_FACTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Cleanup old ripples and floating texts
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatingTexts]);

  // Interactive Node Garden Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    };

    const particles: Particle[] = [];
    const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 16000));

    const isLight = theme === 'light';
    const particleColor = isLight ? 'rgba(0, 120, 110, 0.45)' : 'rgba(0, 168, 150, 0.4)';
    const cursorLineColorPrefix = isLight ? 'rgba(0, 120, 110, ' : 'rgba(0, 168, 150, ';
    const mutualLineColorPrefix = isLight ? 'rgba(0, 120, 110, ' : 'rgba(0, 168, 150, ';
    const sparkColor = isLight ? 'rgba(5, 150, 105, 0.85)' : 'rgba(16, 185, 129, 0.85)';

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 2 + 1,
        color: particleColor
      });
    }

    let mouseX = -9999;
    let mouseY = -9999;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseLeave);

    // Particle burst handler
    spawnBurstRef.current = (x: number, y: number) => {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 1.2,
          color: sparkColor
        });

        if (particles.length > 180) {
          particles.shift();
        }
      }
    };

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Cursor attraction & lines
        if (mouseX !== -9999 && mouseY !== -9999) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x += dx * 0.008; // pull particle
            p.y += dy * 0.008;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `${cursorLineColorPrefix}${0.16 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mutual lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${mutualLineColorPrefix}${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseLeave);
    };
  }, [theme]);

  // Screen click speed booster
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Ripple wave effect
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple].slice(-10));

    // 2. Booster floating text
    const phrases = ["+5% Velo!", "+5% Boost!", "Supercharged!", "Accelerating!", "Turbine Active!", "+5% Speed"];
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    const newText = { id: Date.now() + 1, x, y, text };
    setFloatingTexts((prev) => [...prev, newText].slice(-10));

    // 3. Spawns canvas particle burst
    if (spawnBurstRef.current) {
      spawnBurstRef.current(x, y);
    }

    // 4. Boost loader progress
    setProgress((prev) => {
      if (prev >= 100) return 100;
      const cap = dataLoaded ? 100 : 98;
      return Math.min(cap, prev + 5);
    });

    // 5. Cycle facts immediately on click
    setFactIndex((prev) => (prev + 1) % REAL_ESTATE_FACTS.length);
  };

  // Node click speed booster (popping price card)
  const handleNodeClick = (nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from triggering parent screen click
    
    const node = pricingNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Get parent bounds for exact click offset positioning
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    const clickX = e.clientX - (parentRect?.left || 0);
    const clickY = e.clientY - (parentRect?.top || 0);

    // 1. Spark canvas particle burst
    if (spawnBurstRef.current) {
      spawnBurstRef.current(clickX, clickY);
    }

    // 2. Spawn concentric click ripple
    const newRipple = { id: Date.now(), x: clickX, y: clickY };
    setRipples((prev) => [...prev, newRipple].slice(-10));

    // 3. Spawn floating text with valuation +10% boost
    const newText = {
      id: Date.now() + 1,
      x: clickX,
      y: clickY,
      text: `${node.area} Pop! +10% Velo`
    };
    setFloatingTexts((prev) => [...prev, newText].slice(-10));

    // 4. Boost loader progress by 10%
    setProgress((prev) => {
      if (prev >= 100) return 100;
      const cap = dataLoaded ? 100 : 98;
      return Math.min(cap, prev + 10);
    });

    // 5. Instantly replace the clicked price card with a different random corridor
    setPricingNodes((prev) => {
      const activeAreas = prev.filter(n => n.id !== nodeId).map(n => n.area);
      const availableFeeds = PRICE_FEEDS.filter(f => !activeAreas.includes(f.area));
      
      const feed = availableFeeds.length > 0
        ? availableFeeds[Math.floor(Math.random() * availableFeeds.length)]
        : PRICE_FEEDS[Math.floor(Math.random() * PRICE_FEEDS.length)];
        
      const pos = getRandPosition(prev.filter(n => n.id !== nodeId));
      
      return prev.map(n => {
        if (n.id === nodeId) {
          return {
            id: Date.now() + 5,
            area: feed.area,
            price: feed.price,
            cagr: feed.cagr,
            x: pos.x,
            y: pos.y,
            driftType: Math.floor(Math.random() * 3) + 1
          };
        }
        return n;
      });
    });
  };

  return (
    <div className="ls-screen" data-theme={theme} onClick={handleScreenClick}>
      {/* Background Interactive canvas */}
      <canvas ref={canvasRef} className="ls-canvas" />

      {/* Grid overlay */}
      <div className="ls-grid-bg" />

      {/* Spawning concentric click ripples */}
      {ripples.map((r) => (
        <div key={r.id} className="ls-ripple" style={{ left: r.x, top: r.y }} />
      ))}

      {/* Spawning floating text boost animations */}
      {floatingTexts.map((ft) => (
        <div key={ft.id} className="ls-floating-text" style={{ left: ft.x, top: ft.y }}>
          {ft.text}
        </div>
      ))}

      {/* Floating interactive pricing nodes */}
      {pricingNodes.map((node) => (
        <div
          key={node.id}
          className={`ls-price-node ls-drift-${node.driftType}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onClick={(e) => handleNodeClick(node.id, e)}
        >
          <span className="ls-price-node-area">{node.area}</span>
          <span className="ls-price-node-val">{node.price}</span>
          <span className="ls-price-node-cagr">{node.cagr}</span>
        </div>
      ))}

      {/* Logo and Progress Area */}
      <div className="ls-center">
        <div className="ls-logo-wrap">
          <svg className="ls-skyline-svg" viewBox="0 0 120 120">
            {/* Ground line */}
            <line x1="5" y1="110" x2="115" y2="110" className="ls-ground-line" />
            {/* Building silhouettes */}
            <path className="ls-bldg-line ls-delay-1" d="M15,110 V80 H25 V110" />
            <path className="ls-bldg-line ls-delay-2" d="M30,110 V60 H45 V110" />
            {/* Main Velo Tower */}
            <path className="ls-bldg-line ls-tower ls-delay-3" d="M50,110 V30 L60,20 L70,30 V110" />
            <path className="ls-bldg-line ls-delay-4" d="M75,110 V50 H90 V110" />
            <path className="ls-bldg-line ls-delay-5" d="M95,110 V75 H105 V110" />

            {/* Inward dropping V logo */}
            <path className="ls-velo-v-drop" d="M55,45 L60,58 L65,45" />

            {/* Glowing windows */}
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
          <div className="ls-percent">
            {Math.floor(progress)}
            <span className="ls-pct-sign">%</span>
          </div>
          <div className="ls-phase">{phase}</div>
          <div className="ls-bar-outer">
            <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
            <div className="ls-bar-glow" style={{ left: `${progress}%` }} />
          </div>
        </div>

        <div className="ls-tap-hint">TAP SCREEN OR PRICE BUBBLES TO ACCELERATE</div>
      </div>

      {/* Trivia facts box at the bottom */}
      <div className="ls-trivia-box">
        <div className="ls-trivia-hdr">VELO REAL ESTATE TRIVIA</div>
        <div className="ls-trivia-txt">{REAL_ESTATE_FACTS[factIndex]}</div>
      </div>
    </div>
  );
}
