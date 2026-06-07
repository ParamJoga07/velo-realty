import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ServicesHub.css';
import { Calculator, Home, BarChart3, Compass, Briefcase, Key, ArrowRight, X, User, Phone, Mail, Sparkles, Gift, Crown, MapPin, Activity, Clock } from 'lucide-react';
import API_BASE_URL from '../config';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'calculator' | 'service';
  color: string;
}

export function ServicesHub() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'tenants' | 'agents'>('buyers');
  const [selectedCalc, setSelectedCalc] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [location, setLocation] = useState('Hitech City, Hyderabad');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (_pos) => {
          setLocation('Live: Hitech City Corridor');
        },
        () => setLocation('Hitech City, Hyderabad')
      );
    }

    // Scroll lock for modal
    if (showReferralModal || selectedCalc || selectedServiceId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, [showReferralModal, selectedCalc, selectedServiceId]);

  const services: Record<string, Service[]> = {
    buyers: [
      { id: 'loan', title: 'EMI Calculator', description: 'Precision financial planning for high-value acquisitions.', icon: <Calculator size={32} />, type: 'calculator', color: '#00a896' },
      { id: 'valuation', title: 'Asset Valuation', description: 'Real-time estimation of your property portfolio worth.', icon: <BarChart3 size={32} />, type: 'calculator', color: '#3b82f6' },
      { id: 'vastu', title: 'Vastu Analysis', description: 'Harmonize your living space for prosperity.', icon: <Compass size={32} />, type: 'service', color: '#f59e0b' },
      { id: 'interior', title: 'Interior Design', description: 'Executive aesthetics for your premium residence.', icon: <Home size={32} />, type: 'service', color: '#8b5cf6' },
      { id: 'management', title: 'Asset Management', description: 'Expert oversight for your strategic real estate.', icon: <Briefcase size={32} />, type: 'service', color: '#ef4444' },
      { id: 'sell', title: 'Liquidate Asset', description: 'Maximum velocity for your property transactions.', icon: <Key size={32} />, type: 'service', color: '#10b981' },
    ],
    tenants: [
      { id: 'rent-eligibility', title: 'Rent Threshold', description: 'Calculate sustainable rent based on your income.', icon: <Calculator size={32} />, type: 'calculator', color: '#00a896' },
      { id: 'relocation', title: 'Relocation Suite', description: 'Seamless concierge transition to your new home.', icon: <ArrowRight size={32} />, type: 'service', color: '#3b82f6' },
    ],
    agents: [
      { id: 'comm-calc', title: 'Incentive Engine', description: 'Track your high-performance growth rewards.', icon: <Calculator size={32} />, type: 'calculator', color: '#00a896' },
      { id: 'lead-gen', title: 'Corridor Intel', description: 'Access elite leads and strategic market data.', icon: <BarChart3 size={32} />, type: 'service', color: '#f59e0b' },
    ]
  };

  return (
    <section id="services-ecosystem" className="section services-hub-section">
      <div className="container">
        <div className="section-head center">
          <div>
            <p className="eyebrow">Strategic Ecosystem</p>
            <h2>Everything You Need, Accelerated.</h2>
          </div>
        </div>

        <div className="services-nav-tabs">
          <div className="tab-glider" style={{ 
            transform: `translateX(${activeTab === 'buyers' ? '0' : activeTab === 'tenants' ? '100%' : '200%'})` 
          }}></div>
          <button className={`nav-tab-btn ${activeTab === 'buyers' ? 'active' : ''}`} onClick={() => setActiveTab('buyers')}>Buyers</button>
          <button className={`nav-tab-btn ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>Tenants</button>
          <button className={`nav-tab-btn ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>Agents</button>
        </div>

        <div className="strategic-dashboard-layout">
          <div className="hub-executive-screen">
            <div className="screen-edge-glow"></div>
            <div className="dashboard-content">
              <div className="live-stat">
                <div className="stat-label"><MapPin size={12} /> Geographical Node</div>
                <p>{location}</p>
              </div>
              <div className="live-stat">
                <div className="stat-label"><Clock size={12} /> Strategic Time</div>
                <p>{currentTime}</p>
              </div>
              <div className="live-stat">
                <div className="stat-label"><Activity size={12} /> Market Momentum</div>
                <p className="teal-text">+14.2%</p>
              </div>
            </div>
            <div className="screen-scan-line"></div>
          </div>

          <div className="services-display-grid tile-grid">
            {services[activeTab].map((service, index) => (
              <div 
                key={service.id} 
                className="service-tile-module"
                onClick={() => service.type === 'calculator' ? setSelectedCalc(service.id) : setSelectedServiceId(service.id)}
                style={{ '--accent-color': service.color, animationDelay: `${index * 0.05}s` } as any}
              >
                <div className="tile-inner">
                  <div className="tile-icon">{service.icon}</div>
                  <div className="tile-info">
                    <h3>{service.title}</h3>
                    {service.type === 'calculator' && <span className="tile-badge">Tool</span>}
                  </div>
                </div>
                <div className="tile-hover-border"></div>
              </div>
            ))}
          </div>
        </div>

        <div id="refer-earn" className="referral-banner-premium">
          <div className="referral-text-content">
            <h3>Refer a High-Net-Worth Peer</h3>
            <p>Unlock elite rewards and strategic investment credits for every successful acquisition within your trusted network.</p>
            <div className="referral-perks-row">
              <div className="perk-item"><Gift size={18} /><span>Luxury Travel</span></div>
              <div className="perk-item"><Crown size={18} /><span>Gold & Jewelry</span></div>
              <div className="perk-item"><Sparkles size={18} /><span>Elite Hampers</span></div>
            </div>
            <button className="btn-referral-launch" onClick={() => setShowReferralModal(true)}>
              Start Referring Now <ArrowRight size={18} />
            </button>
          </div>
          <div className="referral-visual-side">
            <div className="reward-cards-track">
              <div className="reward-mini-card"><div className="reward-icon-box"><Gift size={20} /></div><div className="reward-info-text"><span>Luxury Travel</span><p>Global Trips</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Crown size={20} /></div><div className="reward-info-text"><span>Exclusive Gold</span><p>24K Reward</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Sparkles size={20} /></div><div className="reward-info-text"><span>Elite Hampers</span><p>Luxury Curation</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Activity size={20} /></div><div className="reward-info-text"><span>Stock Credits</span><p>Invest Credits</p></div></div>
              {/* Duplicate for infinite loop */}
              <div className="reward-mini-card"><div className="reward-icon-box"><Gift size={20} /></div><div className="reward-info-text"><span>Luxury Travel</span><p>Global Trips</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Crown size={20} /></div><div className="reward-info-text"><span>Exclusive Gold</span><p>24K Reward</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Sparkles size={20} /></div><div className="reward-info-text"><span>Elite Hampers</span><p>Luxury Curation</p></div></div>
              <div className="reward-mini-card"><div className="reward-icon-box"><Activity size={20} /></div><div className="reward-info-text"><span>Stock Credits</span><p>Invest Credits</p></div></div>
            </div>
          </div>
        </div>
      </div>

      {selectedCalc === 'loan' && createPortal(<EMICalculator onClose={() => setSelectedCalc(null)} />, document.body)}
      {selectedCalc === 'valuation' && createPortal(<ValuationTool onClose={() => setSelectedCalc(null)} />, document.body)}
      {selectedCalc === 'rent-eligibility' && createPortal(<RentCalculator onClose={() => setSelectedCalc(null)} />, document.body)}
      {selectedCalc === 'comm-calc' && createPortal(<IncentiveCalculator onClose={() => setSelectedCalc(null)} />, document.body)}
      {showReferralModal && createPortal(<ReferralModal onClose={() => setShowReferralModal(false)} />, document.body)}
      {selectedServiceId && createPortal(<ServiceDetailModal id={selectedServiceId} onClose={() => setSelectedServiceId(null)} />, document.body)}
    </section>
  );
}

// --- REFINED CALCULATORS WITH MANUAL INPUT ---

function IncentiveCalculator({ onClose }: { onClose: () => void }) {
  const [volume, setVolume] = useState(50000000);
  const [perc, setPerc] = useState(2);
  const earnings = Math.round(volume * (perc / 100));

  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className="calc-modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        <div className="calc-header"><Briefcase size={24} className="accent-text" /><h2>Incentive Engine</h2></div>
        <div className="calc-layout-grid">
          <div className="calc-controls">
            <div className="smart-input-group">
              <div className="input-header"><label>Deal Volume (₹)</label><input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} /></div>
              <input type="range" min="10000000" max="500000000" step="1000000" value={volume} onChange={e => setVolume(Number(e.target.value))} />
            </div>
            <div className="smart-input-group">
              <div className="input-header"><label>Commission %</label><input type="number" step="0.1" value={perc} onChange={e => setPerc(Number(e.target.value))} /></div>
              <input type="range" min="0.5" max="5" step="0.1" value={perc} onChange={e => setPerc(Number(e.target.value))} />
            </div>
          </div>
          <div className="calc-display-panel center-aligned">
            <div className="valuation-result">
              <span>Potential Earnings</span>
              <h3>₹{earnings.toLocaleString()}</h3>
              <p>Performance-Based Reward Projection</p>
            </div>
            <button className="btn-calc-apply">Generate Growth Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EMICalculator({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const emi = Math.round((amount * (rate / 12 / 100) * Math.pow(1 + (rate / 12 / 100), tenure * 12)) / (Math.pow(1 + (rate / 12 / 100), tenure * 12) - 1));
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - amount;

  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className="calc-modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        <div className="calc-header"><Calculator size={24} className="accent-text" /><h2>Strategic EMI Planner</h2></div>
        <div className="calc-layout-grid">
          <div className="calc-controls">
            <div className="smart-input-group">
              <div className="input-header"><label>Loan Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
              <input type="range" min="1000000" max="100000000" step="100000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
              <div className="range-labels"><span>10L</span><span>10Cr</span></div>
            </div>
            <div className="smart-input-group">
              <div className="input-header"><label>Interest Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} /></div>
              <input type="range" min="5" max="15" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} />
              <div className="range-labels"><span>5%</span><span>15%</span></div>
            </div>
            <div className="smart-input-group">
              <div className="input-header"><label>Tenure (Years)</label><input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} /></div>
              <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} />
              <div className="range-labels"><span>1y</span><span>30y</span></div>
            </div>
          </div>
          <div className="calc-display-panel">
            <div className="display-main"><span>Monthly EMI</span><h3>₹{emi.toLocaleString()}</h3></div>
            <div className="display-stats">
              <div className="stat-card"><span>Total Interest</span><p>₹{totalInterest.toLocaleString()}</p></div>
              <div className="stat-card"><span>Total Principal</span><p>₹{amount.toLocaleString()}</p></div>
            </div>
            <div className="mini-chart">
              <div className="bar-p" style={{ width: `${(amount / totalPayment) * 100}%` }}></div>
              <div className="bar-i" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
            </div>
            <button className="btn-calc-apply">Request Elite Pre-Approval</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValuationTool({ onClose }: { onClose: () => void }) {
  const [area, setArea] = useState(2500);
  const [rate, setRate] = useState(12000);

  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className="calc-modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        <div className="calc-header"><BarChart3 size={24} className="accent-text" /><h2>Asset Valuation Estimator</h2></div>
        <div className="calc-layout-grid">
          <div className="calc-controls">
            <div className="smart-input-group">
              <div className="input-header"><label>Area (Sq.Ft)</label><input type="number" value={area} onChange={e => setArea(Number(e.target.value))} /></div>
              <input type="range" min="500" max="20000" step="100" value={area} onChange={e => setArea(Number(e.target.value))} />
            </div>
            <div className="smart-input-group">
              <div className="input-header"><label>Rate (₹/Sq.Ft)</label><input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} /></div>
              <input type="range" min="3000" max="40000" step="500" value={rate} onChange={e => setRate(Number(e.target.value))} />
            </div>
          </div>
          <div className="calc-display-panel center-aligned">
            <div className="valuation-result">
              <span>Estimated Asset Value</span>
              <h3>₹{(area * rate / 10000000).toFixed(2)} Cr</h3>
              <p>Current Corridor Intelligence Applied</p>
            </div>
            <button className="btn-calc-apply">Download Valuation Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RentCalculator({ onClose }: { onClose: () => void }) {
  const [income, setIncome] = useState(250000);
  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className="calc-modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        <div className="calc-header"><Key size={24} className="accent-text" /><h2>Rent Threshold Tool</h2></div>
        <div className="calc-layout-grid">
          <div className="calc-controls">
            <div className="smart-input-group">
              <div className="input-header"><label>Monthly Net Income</label><input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} /></div>
              <input type="range" min="50000" max="2000000" step="10000" value={income} onChange={e => setIncome(Number(e.target.value))} />
            </div>
          </div>
          <div className="calc-display-panel center-aligned">
            <div className="valuation-result">
              <span>Suggested Max Rent</span>
              <h3>₹{Math.round(income * 0.3).toLocaleString()}</h3>
              <p>Optimized for Sustainable Luxury Living</p>
            </div>
            <button className="btn-calc-apply">View Matching Rentals</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REFINED REFERRAL MODAL WITH FLUID ANIMATIONS ---

function ReferralModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    referrer_name: '', referrer_email: '', friend_name: '', friend_contact: '', investment_intent: 'Luxury Apartment'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/referrals`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (res.ok) setTimeout(() => setStatus('success'), 800);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className={`referral-modal-window ${status === 'success' ? 'success' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        
        {status !== 'success' ? (
          <div className="ref-modal-content">
            <div className="ref-modal-header">
              <Crown className="accent-text" size={32} />
              <h2>Strategic Referral</h2>
              <p>Leverage your network for premium rewards.</p>
            </div>
            <form className="elite-ref-form" onSubmit={handleSubmit}>
              <div className="form-split">
                <div className="form-col">
                  <h4>Referrer</h4>
                  <div className="elite-input"><User size={18} /><input type="text" placeholder="Your Full Name" required value={formData.referrer_name} onChange={e => setFormData({...formData, referrer_name: e.target.value})} /></div>
                  <div className="elite-input"><Mail size={18} /><input type="email" placeholder="Professional Email" required value={formData.referrer_email} onChange={e => setFormData({...formData, referrer_email: e.target.value})} /></div>
                </div>
                <div className="form-col">
                  <h4>Peer</h4>
                  <div className="elite-input"><User size={18} /><input type="text" placeholder="Peer Full Name" required value={formData.friend_name} onChange={e => setFormData({...formData, friend_name: e.target.value})} /></div>
                  <div className="elite-input"><Phone size={18} /><input type="text" placeholder="Contact Number" required value={formData.friend_contact} onChange={e => setFormData({...formData, friend_contact: e.target.value})} /></div>
                </div>
              </div>
              <div className="intent-selector">
                <label>Strategic Intent</label>
                <div className="intent-chips">
                  {['Luxury Apartment', 'Premium Villa', 'Commercial Asset', 'Strategic Plot'].map(intent => (
                    <button key={intent} type="button" className={`intent-chip ${formData.investment_intent === intent ? 'active' : ''}`} onClick={() => setFormData({...formData, investment_intent: intent})}>{intent}</button>
                  ))}
                </div>
              </div>
              <button className="btn-ref-submit" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Authenticating...' : 'Transmit Referral'}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-reveal animate-in">
            <div className="sparkle-wrap">
              <Sparkles size={60} className="sparkle-icon" />
              <div className="success-ring"></div>
            </div>
            <h2>Transmission Successful</h2>
            <p>Our concierge will reach out to your peer with absolute priority. Your reward track is now active.</p>
            <button className="btn-close-success" onClick={onClose}>Close Portal</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Rich data mapping for services from Website Changesss.docx
const SERVICES_DETAIL: Record<string, {
  subtitle: string;
  description: string;
  benefitsTitle: string;
  benefits: string[];
  ctaText: string;
  icon: string;
}> = {
  vastu: {
    subtitle: "Balance Tradition with Modern Living",
    description: "For many homebuyers and investors, Vastu plays an important role in creating spaces that promote positivity, harmony, and well-being. Our Vastu Analysis service provides expert guidance on property selection, layout planning, and directional alignments based on traditional Vastu principles. Whether you're purchasing a new property or evaluating an existing one, our insights help you make informed decisions aligned with your personal preferences and beliefs. We combine practical real estate expertise with traditional Vastu considerations to provide balanced recommendations.",
    benefitsTitle: "Our Services Include:",
    benefits: [
      "Residential Vastu Assessment",
      "Commercial Property Evaluation",
      "Plot & Villa Analysis",
      "Space Planning Recommendations",
      "Entrance & Directional Guidance",
      "Property Selection Support"
    ],
    ctaText: "Book a Vastu Consultation",
    icon: "Compass"
  },
  interior: {
    subtitle: "Design Spaces That Reflect Your Lifestyle",
    description: "A well-designed space is more than just aesthetics—it's about creating an environment that enhances comfort, functionality, and value. At Velo Realty, we offer personalized interior design solutions tailored to your lifestyle, preferences, and property type. Whether you're furnishing a luxury villa, modern apartment, office space, or investment property, our design experts help transform empty spaces into beautiful, practical environments. From concept development and space planning to material selection and project execution, we ensure every detail reflects quality and sophistication. Our approach combines creativity, functionality, and attention to detail to deliver spaces that are both elegant and timeless.",
    benefitsTitle: "Our Services Include:",
    benefits: [
      "Residential Interior Design",
      "Luxury Villa Interiors",
      "Apartment Makeovers",
      "Space Planning & Layout Optimization",
      "Furniture & Decor Consultation",
      "Turnkey Interior Solutions"
    ],
    ctaText: "Schedule a Design Consultation",
    icon: "Home"
  },
  management: {
    subtitle: "Maximize the Value of Your Real Estate Investments",
    description: "Real estate ownership requires ongoing management to preserve value and generate optimal returns. Our Asset Management services are designed to help property owners protect, maintain, and grow their investments with confidence. Whether you own a single property or an extensive portfolio, we provide strategic support that helps improve asset performance while reducing the complexities of ownership. Our team works closely with investors and property owners to ensure every asset continues to deliver long-term value and financial stability.",
    benefitsTitle: "Our Services Include:",
    benefits: [
      "Property Performance Monitoring",
      "Tenant Coordination",
      "Property Maintenance Oversight",
      "Portfolio Review & Advisory",
      "Investment Strategy Support",
      "Asset Value Optimization"
    ],
    ctaText: "Talk to an Asset Management Expert",
    icon: "Briefcase"
  },
  sell: {
    subtitle: "Strategic Property Exit Solutions",
    description: "Selling a property requires more than simply listing it on the market. It requires proper positioning, market intelligence, and access to qualified buyers. Our Asset Liquidation services help property owners sell residential, commercial, and investment assets efficiently while maximizing value. We evaluate market conditions, determine the right pricing strategy, and connect you with serious buyers to facilitate a smooth transaction. Whether you're restructuring your portfolio, unlocking capital, or planning your next investment, we help you achieve your objectives with confidence.",
    benefitsTitle: "Our Services Include:",
    benefits: [
      "Property Valuation Support",
      "Market Positioning Strategy",
      "Qualified Buyer Network",
      "Transaction Coordination",
      "Investment Exit Planning",
      "Fast & Transparent Closures"
    ],
    ctaText: "Request a Property Evaluation",
    icon: "Key"
  },
  relocation: {
    subtitle: "Making Every Move Seamless",
    description: "Relocating to a new city or community involves many important decisions. Our Relocation Suite is designed to simplify the process and provide a stress-free transition for individuals, families, professionals, and NRIs. From identifying the right neighborhood to assisting with property selection and local guidance, our team supports you at every step of your relocation journey. Whether you're moving for work, investment, education, or lifestyle reasons, we help you settle in with confidence.",
    benefitsTitle: "Our Services Include:",
    benefits: [
      "Residential Relocation Assistance",
      "NRI Relocation Support",
      "Area & Neighborhood Guidance",
      "Property Search Assistance",
      "School & Infrastructure Insights",
      "End-to-End Relocation Coordination"
    ],
    ctaText: "Get Relocation Assistance",
    icon: "ArrowRight"
  },
  "lead-gen": {
    subtitle: "Market Intelligence for Smarter Investments",
    description: "The best investment opportunities are often identified before the market recognizes them. Our Corridor Intel service provides data-driven insights into emerging growth corridors, infrastructure developments, and future investment hotspots. We continuously monitor market trends, government initiatives, connectivity projects, commercial expansion, and development activity to help investors make informed decisions backed by research rather than speculation. Whether you're looking for long-term appreciation, rental income, or strategic portfolio growth, our market intelligence helps you stay ahead of the curve.",
    benefitsTitle: "What You'll Gain:",
    benefits: [
      "Emerging Investment Hotspots",
      "Infrastructure Growth Analysis",
      "Future Development Insights",
      "Location Appreciation Forecasts",
      "Builder & Project Intelligence",
      "Strategic Investment Recommendations"
    ],
    ctaText: "Request Market Intelligence Report",
    icon: "BarChart3"
  }
};

function ServiceDetailModal({ id, onClose }: { id: string, onClose: () => void }) {
  const serviceDetail = SERVICES_DETAIL[id];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!serviceDetail) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: email || 'no-email@velo.com',
          message: `Specialized Service Inquiry: "${serviceDetail.ctaText}" (Service ID: ${id})`,
          property_id: null
        })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const renderIcon = () => {
    switch (serviceDetail.icon) {
      case 'Compass': return <Compass size={24} className="accent-text" />;
      case 'Home': return <Home size={24} className="accent-text" />;
      case 'Briefcase': return <Briefcase size={24} className="accent-text" />;
      case 'Key': return <Key size={24} className="accent-text" />;
      case 'ArrowRight': return <ArrowRight size={24} className="accent-text" />;
      case 'BarChart3': return <BarChart3 size={24} className="accent-text" />;
      default: return <Sparkles size={24} className="accent-text" />;
    }
  };

  return (
    <div className="calc-modal-overlay" onClick={onClose}>
      <div className="calc-modal-window" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X /></button>
        <div className="calc-header">
          {renderIcon()}
          <div>
            <h2>{serviceDetail.ctaText.replace('Book a ', '').replace('Schedule a ', '').replace('Talk to an ', '').replace('Request a ', '').replace('Get ', '').replace('Request ', '')}</h2>
            <p className="accent-text" style={{ fontSize: '0.9rem', margin: '2px 0 0 0', opacity: 0.8 }}>{serviceDetail.subtitle}</p>
          </div>
        </div>
        
        <div className="calc-layout-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
          <div className="calc-info-pane" style={{ paddingRight: '1rem' }}>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--body-color)', opacity: 0.9, marginBottom: '1.25rem' }}>
              {serviceDetail.description}
            </p>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal-500)', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              {serviceDetail.benefitsTitle}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--body-color)', opacity: 0.85, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {serviceDetail.benefits.map((b, i) => (
                <li key={i} style={{ fontSize: '0.88rem' }}>{b}</li>
              ))}
            </ul>
          </div>
          
          <div className="calc-display-panel" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '14px', padding: '1.25rem' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem' }}>✓</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>Request Received</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--body-color)', opacity: 0.7, margin: 0 }}>An advisor will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#ffffff' }}>Consultation Request</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="service-lead-name" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
                  <input
                    id="service-lead-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="service-modal-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="service-lead-phone" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Contact Number</label>
                  <input
                    id="service-lead-phone"
                    type="tel"
                    required
                    placeholder="+91 Contact number"
                    className="service-modal-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="service-lead-email" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Email Address</label>
                  <input
                    id="service-lead-email"
                    type="email"
                    placeholder="you@domain.com"
                    className="service-modal-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0 }}>Submission failed. Please try again.</p>
                )}
                <button className="btn-calc-apply" type="submit" disabled={status === 'submitting'} style={{ marginTop: '0.5rem' }}>
                  {status === 'submitting' ? 'Sending Request...' : serviceDetail.ctaText}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
