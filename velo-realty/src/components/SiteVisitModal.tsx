import { useState, useEffect, useRef } from 'react'
import { Building2, MapPin, Calendar, Clock } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './SiteVisitModal.css'
import API_BASE_URL from '../config'

interface Project {
  id: number
  name: string
  location: string
  project_type: string
  price_range: string | null
}

interface Developer {
  id: number
  name: string
  logo_url: string | null
  projects: Project[]
}

interface SiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
]

export function SiteVisitModal({ isOpen, onClose, triggerRef }: SiteVisitModalProps) {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loadingDevs, setLoadingDevs] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1) // 1=property, 2=date-time, 3=contact
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [animOrigin, setAnimOrigin] = useState({ x: '50%', y: '50%' })
  const overlayRef = useRef<HTMLDivElement>(null)

  // Compute animation origin from trigger button position
  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const x = `${rect.left + rect.width / 2}px`
      const y = `${rect.top + rect.height / 2}px`
      setAnimOrigin({ x, y })
    }
  }, [isOpen, triggerRef])

  // Fetch developers + projects on first open
  useEffect(() => {
    if (isOpen && developers.length === 0) {
      setLoadingDevs(true)
      fetch(`${API_BASE_URL}/api/developers-with-projects`)
        .then(r => r.json())
        .then(data => setDevelopers(data))
        .catch(() => {})
        .finally(() => setLoadingDevs(false))
    }
  }, [isOpen, developers.length])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const resetAll = () => {
    setSelectedDeveloper(null); setSelectedProject(null)
    setSelectedDate(null); setSelectedTime('')
    setName(''); setEmail(''); setPhone(''); setMessage('')
    setStep(1); setSuccess(false); setError('')
  }

  const handleClose = () => { resetAll(); onClose() }

  const canGoStep2 = !!selectedProject
  const canGoStep3 = !!selectedDate && !!selectedTime
  const canSubmit = !!name.trim() && !!email.trim() && !!phone.trim()

  const handleSubmit = async () => {
    if (!canSubmit || !selectedDate) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/site-visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, message,
          developer_id: selectedDeveloper?.id ?? null,
          project_id: selectedProject?.id ?? null,
          visit_date: selectedDate.toISOString().split('T')[0],
          visit_time: selectedTime,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Minimum date: tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)

  if (!isOpen) return null

  return (
    <div
      className="sv-overlay"
      ref={overlayRef}
      style={{ '--sv-origin-x': animOrigin.x, '--sv-origin-y': animOrigin.y } as React.CSSProperties}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose() }}
    >
      <div className={`sv-panel ${isOpen ? 'sv-panel--open' : ''}`} role="dialog" aria-modal="true" aria-label="Schedule a Site Visit">
        {/* Header */}
        <div className="sv-header">
          <div className="sv-header-left">
            <div className="sv-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className="sv-title">Schedule a Site Visit</h2>
              <p className="sv-subtitle">We'll arrange a personal tour for you</p>
            </div>
          </div>
          <button className="sv-close" onClick={handleClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {!success && (
          <div className="sv-steps">
            {['Property', 'Date & Time', 'Your Details'].map((label, i) => (
              <button
                key={label}
                className={`sv-step ${step === i + 1 ? 'sv-step--active' : ''} ${step > i + 1 ? 'sv-step--done' : ''}`}
                onClick={() => { if (i + 1 < step) setStep(i + 1) }}
                disabled={i + 1 > step}
              >
                <span className="sv-step-num">
                  {step > i + 1 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : i + 1}
                </span>
                <span className="sv-step-label">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="sv-body">

          {/* SUCCESS STATE */}
          {success && (
            <div className="sv-success">
              <div className="sv-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="40" height="40">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="20 6 9 17 4 12" transform="translate(2,2) scale(0.75)"/>
                </svg>
              </div>
              <h3>Visit Booked!</h3>
              <p>
                Your site visit to <strong>{selectedProject?.name}</strong> is confirmed for{' '}
                <strong>{selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                {' '}at <strong>{selectedTime}</strong>.
              </p>
              <p className="sv-success-note">Our team will reach you at <strong>{phone}</strong> to confirm details.</p>
              <button className="sv-btn sv-btn-primary" onClick={handleClose}>Done</button>
            </div>
          )}

          {/* STEP 1 — Property Selection */}
          {!success && step === 1 && (
            <div className="sv-step-content">
              <h3 className="sv-section-title">Select Developer &amp; Project</h3>

              {loadingDevs ? (
                <div className="sv-loading">Loading projects…</div>
              ) : (
                <>
                  {/* Developer Dropdown */}
                  <div className="sv-field">
                    <label className="sv-label">Developer</label>
                    <div className="sv-select-wrapper">
                      <select
                        className="sv-select"
                        value={selectedDeveloper?.id ?? ''}
                        onChange={(e) => {
                          const dev = developers.find(d => d.id === Number(e.target.value)) ?? null
                          setSelectedDeveloper(dev)
                          setSelectedProject(null)
                        }}
                      >
                        <option value="">— Choose a Developer —</option>
                        {developers.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <span className="sv-select-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Project Dropdown (cascades from developer) */}
                  <div className="sv-field">
                    <label className="sv-label">Project</label>
                    <div className="sv-select-wrapper">
                      <select
                        className="sv-select"
                        value={selectedProject?.id ?? ''}
                        disabled={!selectedDeveloper}
                        onChange={(e) => {
                          const proj = selectedDeveloper?.projects.find(p => p.id === Number(e.target.value)) ?? null
                          setSelectedProject(proj)
                        }}
                      >
                        <option value="">
                          {selectedDeveloper ? '— Choose a Project —' : '← Select developer first'}
                        </option>
                        {selectedDeveloper?.projects.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.location}
                          </option>
                        ))}
                      </select>
                      <span className="sv-select-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Selected project info card */}
                  {selectedProject && (
                    <div className="sv-project-card">
                      <div className="sv-project-card-header">
                        {selectedDeveloper?.logo_url && (
                          <img src={selectedDeveloper.logo_url} alt={selectedDeveloper.name} className="sv-dev-logo" />
                        )}
                        <div>
                          <div className="sv-project-name">{selectedProject.name}</div>
                          <div className="sv-project-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} style={{ color: 'var(--teal-500)' }} />
                            <span>{selectedProject.location}</span>
                            {selectedProject.project_type && <span style={{ opacity: 0.6 }}>· {selectedProject.project_type}</span>}
                          </div>
                        </div>
                      </div>
                      {selectedProject.price_range && (
                        <div className="sv-project-price">₹ {selectedProject.price_range}</div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="sv-footer">
                <button
                  className="sv-btn sv-btn-primary"
                  disabled={!canGoStep2}
                  onClick={() => setStep(2)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Time */}
          {!success && step === 2 && (
            <div className="sv-step-content">
              <h3 className="sv-section-title">Pick Your Preferred Date &amp; Time</h3>

              {/* Calendar */}
              <div className="sv-calendar-wrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={minDate}
                  filterDate={(d) => d.getDay() !== 0} // No Sundays
                  inline
                  calendarClassName="sv-calendar"
                />
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="sv-timeslots-section">
                  <div className="sv-timeslots-label">Available Time Slots</div>
                  <div className="sv-timeslots">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        className={`sv-slot ${selectedTime === slot ? 'sv-slot--active' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                        type="button"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="sv-footer">
                <button className="sv-btn sv-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="sv-btn sv-btn-primary"
                  disabled={!canGoStep3}
                  onClick={() => setStep(3)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Contact Details */}
          {!success && step === 3 && (
            <div className="sv-step-content">
              <h3 className="sv-section-title">Your Contact Details</h3>

              {/* Booking Summary */}
              <div className="sv-summary">
                <div className="sv-summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} style={{ color: 'var(--teal-500)' }} /> Project</span>
                  <strong>{selectedProject?.name}</strong>
                </div>
                <div className="sv-summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} style={{ color: 'var(--teal-500)' }} /> Location</span>
                  <strong>{selectedProject?.location}</strong>
                </div>
                <div className="sv-summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} style={{ color: 'var(--teal-500)' }} /> Date</span>
                  <strong>{selectedDate?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div className="sv-summary-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} style={{ color: 'var(--teal-500)' }} /> Time</span>
                  <strong>{selectedTime}</strong>
                </div>
              </div>

              <div className="sv-fields">
                <div className="sv-field">
                  <label className="sv-label">Full Name *</label>
                  <input
                    className="sv-input"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="sv-field-row">
                  <div className="sv-field">
                    <label className="sv-label">Email *</label>
                    <input
                      className="sv-input"
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="sv-field">
                    <label className="sv-label">Phone *</label>
                    <input
                      className="sv-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div className="sv-field">
                  <label className="sv-label">Message (optional)</label>
                  <textarea
                    className="sv-textarea"
                    placeholder="Any specific requirements or questions?"
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="sv-error">{error}</div>}

              <div className="sv-footer">
                <button className="sv-btn sv-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="sv-btn sv-btn-primary sv-btn-submit"
                  disabled={!canSubmit || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <span className="sv-spinner" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Book Site Visit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
