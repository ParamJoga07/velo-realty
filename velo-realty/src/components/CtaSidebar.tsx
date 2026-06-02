import { useRef } from 'react';
import { Compass, Calendar } from 'lucide-react';
import './CtaSidebar.css';

interface CtaSidebarProps {
  onScheduleClick?: (ref: React.RefObject<HTMLButtonElement | null>) => void
}

export function CtaSidebar({ onScheduleClick }: CtaSidebarProps) {
  const scheduleButtonRef = useRef<HTMLButtonElement | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cta-sidebar">
      <div className="cta-sidebar-line top-line"></div>
      
      <button 
        onClick={() => scrollToSection('our-properties')} 
        className="cta-button explore" 
        aria-label="Explore Projects"
      >
        <div className="cta-icon-wrapper">
          <Compass size={20} />
        </div>
        <span className="cta-tooltip">Explore Projects</span>
      </button>

      <button 
        ref={scheduleButtonRef}
        onClick={() => {
          if (onScheduleClick) {
            onScheduleClick(scheduleButtonRef);
          } else {
            scrollToSection('contact');
          }
        }} 
        className="cta-button schedule" 
        aria-label="Schedule Site Visit"
      >
        <div className="cta-icon-wrapper">
          <Calendar size={20} />
        </div>
        <span className="cta-tooltip">Schedule Site Visit</span>
      </button>

      <a 
        href="https://wa.me/917207214848?text=Hi,%20I'd%20like%20to%20schedule%20a%20site%20visit%20with%20Velo%20Realty." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="cta-button whatsapp" 
        aria-label="WhatsApp Now"
      >
        <div className="cta-icon-wrapper">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.052 14.185 1.025 12.008 1.025c-5.442 0-9.87 4.372-9.874 9.8-.001 1.739.486 3.438 1.411 4.937L2.52 21.244l4.127-1.511zm11.332-6.843c-.274-.137-1.62-.8-1.87-.893-.249-.093-.43-.137-.61.137-.18.274-.7.893-.857 1.077-.158.184-.316.207-.59.07-.274-.137-1.157-.426-2.204-1.36-c.815-.727-1.366-1.624-1.526-1.899-.16-.274-.017-.423.12-.559.124-.121.274-.321.412-.481.137-.16.184-.274.274-.457.093-.184.046-.344-.023-.481-.07-.137-.61-1.472-.835-2.02-.22-.53-.443-.457-.61-.466-.157-.008-.339-.01-.52-.01-.18 0-.474.068-.722.34-.249.274-.95.93-.95 2.27 0 1.34.975 2.635 1.11 2.82.137.184 1.92 2.931 4.65 4.11 2.73 1.18 2.73.786 3.223.74.493-.046 1.62-.663 1.85-1.303.229-.64.229-1.19.16-1.302-.069-.115-.25-.207-.525-.344z"/>
          </svg>
        </div>
        <span className="cta-tooltip">WhatsApp Now</span>
      </a>

      <div className="cta-sidebar-line bottom-line"></div>
    </div>
  );
}
