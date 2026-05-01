import type { Property } from '../types';
import './DeveloperModal.css';

type DeveloperModalProps = {
  developerName: string;
  projects: Property[];
  onClose: () => void;
};

export function DeveloperModal({ developerName, projects, onClose }: DeveloperModalProps) {
  // If no real projects found, generate mock data for visual demonstration
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: 991,
      title: `${developerName} Skyline Towers`,
      location: 'Financial District',
      price: '₹1.8 Cr',
      type: 'Apartment' as const,
      listingType: 'Pre-Launch' as const,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 992,
      title: `${developerName} Emerald Villas`,
      location: 'Kokapet',
      price: '₹7.5 Cr',
      type: 'Villa' as const,
      listingType: 'Off-Plan' as const,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 993,
      title: `${developerName} Business Hub`,
      location: 'Narsingi',
      price: '₹95 Lakhs',
      type: 'Commercial Space' as const,
      listingType: 'Ready' as const,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const isCorridor = ['North Corridor', 'South Corridor', 'East Corridor', 'West Corridor'].includes(developerName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <p className="eyebrow">{isCorridor ? 'Growth Corridor' : 'A-List Developer'}</p>
          <h2>{developerName}</h2>
          <p className="section-subtitle">{isCorridor ? 'Strategic Hub & Investment Timeline' : 'Current Portfolio & Active Launches'}</p>
        </div>
        
        <div className="modal-grid">
          {displayProjects.map((project) => (
            <div key={project.id} className="project-mini-card">
              <div className="mini-card-image">
                <img src={project.image} alt={project.title} />
                <span className="mini-badge">{project.listingType}</span>
              </div>
              <div className="mini-card-info">
                <h4>{project.title}</h4>
                <p>{project.location}</p>
                <div className="mini-card-meta">
                  <strong>{project.price}</strong>
                  <span>{project.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
