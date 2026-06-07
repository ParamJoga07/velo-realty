import { useState } from 'react'
import { Search, ArrowLeft, Plus, Check } from 'lucide-react'
import type { Property, Developer } from '../types'
import './DirectCompare.css'

interface DirectCompareProps {
  developers: Developer[]
  properties: Property[]
  onCompare: (id1: number, id2: number) => void
}

type SlotState = {
  step: 'placeholder' | 'developer' | 'project' | 'selected'
  selectedDevName: string | null
  selectedProjId: number | null
}

export function DirectCompare({ developers, properties, onCompare }: DirectCompareProps) {
  const [slotA, setSlotA] = useState<SlotState>({
    step: 'placeholder',
    selectedDevName: null,
    selectedProjId: null,
  })

  const [slotB, setSlotB] = useState<SlotState>({
    step: 'placeholder',
    selectedDevName: null,
    selectedProjId: null,
  })

  const [searchDevA, setSearchDevA] = useState('')
  const [searchDevB, setSearchDevB] = useState('')

  // Filter developers who actually have projects mapped in the properties array
  const activeDevelopers = developers.filter(dev => 
    properties.some(p => p.developer.toLowerCase() === dev.name.toLowerCase())
  )

  const handleSelectDeveloper = (slot: 'A' | 'B', devName: string) => {
    if (slot === 'A') {
      setSlotA({
        step: 'project',
        selectedDevName: devName,
        selectedProjId: null,
      })
      setSearchDevA('')
    } else {
      setSlotB({
        step: 'project',
        selectedDevName: devName,
        selectedProjId: null,
      })
      setSearchDevB('')
    }
  }

  const handleSelectProject = (slot: 'A' | 'B', projId: number) => {
    if (slot === 'A') {
      setSlotA(prev => ({
        ...prev,
        step: 'selected',
        selectedProjId: projId,
      }))
    } else {
      setSlotB(prev => ({
        ...prev,
        step: 'selected',
        selectedProjId: projId,
      }))
    }
  }

  const handleResetSlot = (slot: 'A' | 'B') => {
    if (slot === 'A') {
      setSlotA({
        step: 'placeholder',
        selectedDevName: null,
        selectedProjId: null,
      })
    } else {
      setSlotB({
        step: 'placeholder',
        selectedDevName: null,
        selectedProjId: null,
      })
    }
  }

  const handleBackToDeveloper = (slot: 'A' | 'B') => {
    if (slot === 'A') {
      setSlotA(prev => ({
        ...prev,
        step: 'developer',
        selectedProjId: null,
      }))
    } else {
      setSlotB(prev => ({
        ...prev,
        step: 'developer',
        selectedProjId: null,
      }))
    }
  }

  const getProjectsForDev = (devName: string | null) => {
    if (!devName) return []
    return properties.filter(p => p.developer.toLowerCase() === devName.toLowerCase())
  }

  const getPropertyById = (id: number | null) => {
    if (id === null) return null
    return properties.find(p => p.id === id) || null
  }

  const isReadyToCompare = slotA.selectedProjId !== null && slotB.selectedProjId !== null

  const renderSlotContent = (slot: 'A' | 'B', state: SlotState, searchVal: string, setSearchVal: (v: string) => void) => {
    const matchedProjects = getProjectsForDev(state.selectedDevName)
    const selectedProj = getPropertyById(state.selectedProjId)

    switch (state.step) {
      case 'placeholder':
        return (
          <div 
            className="direct-compare-placeholder"
            onClick={() => setSlotA(prev => slot === 'A' ? { ...prev, step: 'developer' } : prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (slot === 'A') setSlotA(prev => ({ ...prev, step: 'developer' }))
                else setSlotB(prev => ({ ...prev, step: 'developer' }))
              }
            }}
          >
            <div className="placeholder-circle">
              <Plus size={24} />
            </div>
            <h4>Select Project {slot}</h4>
            <p>Choose developer and project</p>
          </div>
        )

      case 'developer':
        const filteredDevs = activeDevelopers.filter(d => 
          d.name.toLowerCase().includes(searchVal.toLowerCase())
        )

        return (
          <div className="direct-compare-step-container">
            <div className="step-header">
              <button 
                className="step-back-btn" 
                onClick={() => {
                  if (slot === 'A') setSlotA({ step: 'placeholder', selectedDevName: null, selectedProjId: null })
                  else setSlotB({ step: 'placeholder', selectedDevName: null, selectedProjId: null })
                }}
                type="button"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h4>Select Developer ({slot})</h4>
            </div>

            <div className="step-search-wrap">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search developer..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>

            <div className="step-scroll-list">
              {filteredDevs.length === 0 ? (
                <div className="no-results">No developers found</div>
              ) : (
                filteredDevs.map(dev => (
                  <button 
                    key={dev.id} 
                    className="dev-list-item"
                    onClick={() => handleSelectDeveloper(slot, dev.name)}
                    type="button"
                  >
                    <img src={dev.image} alt={dev.name} className="dev-logo-small" />
                    <span>{dev.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )

      case 'project':
        return (
          <div className="direct-compare-step-container">
            <div className="step-header">
              <button 
                className="step-back-btn" 
                onClick={() => handleBackToDeveloper(slot)}
                type="button"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h4 style={{ textTransform: 'capitalize' }}>Projects by {state.selectedDevName}</h4>
            </div>

            <div className="step-scroll-list projects">
              {matchedProjects.map(proj => (
                <button 
                  key={proj.id} 
                  className="project-list-item"
                  onClick={() => handleSelectProject(slot, proj.id)}
                  type="button"
                >
                  <img src={proj.image} alt={proj.title} className="proj-thumb-small" />
                  <div className="proj-info-small">
                    <span className="proj-title-small">{proj.title}</span>
                    <span className="proj-loc-small">{proj.location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'selected':
        if (!selectedProj) return null
        return (
          <div className="direct-compare-selected-card">
            <div className="selected-card-image">
              <img src={selectedProj.image} alt={selectedProj.title} />
              <div className="selected-card-badge">{selectedProj.status}</div>
              <button 
                className="selected-card-change-btn" 
                onClick={() => handleResetSlot(slot)}
                type="button"
              >
                Change
              </button>
            </div>
            <div className="selected-card-content">
              <span className="developer-tag">{selectedProj.developer}</span>
              <h3>{selectedProj.title}</h3>
              <p className="location-tag">{selectedProj.location} Corridor</p>
              <div className="price-tag">{selectedProj.price}</div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <section className="direct-compare-section" id="direct-compare">
      <div className="container">
        <div className="section-head center">
          <div>
            <span className="eyebrow">PORTFOLIO INSIGHTS</span>
            <h2>Direct Project Comparison</h2>
            <p className="section-subtitle">
              Select any two developer projects to evaluate configuration sizes, pricing, base rate per sft, and location advantages side-by-side.
            </p>
          </div>
        </div>

        <div className="direct-compare-grid">
          {/* Card Slot A */}
          <div 
            className={`direct-compare-card-slot ${slotA.step === 'placeholder' ? 'clickable' : ''}`}
            onClick={() => {
              if (slotA.step === 'placeholder') {
                setSlotA({ step: 'developer', selectedDevName: null, selectedProjId: null })
              }
            }}
          >
            {renderSlotContent('A', slotA, searchDevA, setSearchDevA)}
          </div>

          {/* VS Divider */}
          <div className="direct-compare-vs-divider">
            <div className="vs-circle">VS</div>
          </div>

          {/* Card Slot B */}
          <div 
            className={`direct-compare-card-slot ${slotB.step === 'placeholder' ? 'clickable' : ''}`}
            onClick={() => {
              if (slotB.step === 'placeholder') {
                setSlotB({ step: 'developer', selectedDevName: null, selectedProjId: null })
              }
            }}
          >
            {renderSlotContent('B', slotB, searchDevB, setSearchDevB)}
          </div>
        </div>

        {/* Action Button */}
        <div className="direct-compare-action-wrap">
          <button 
            className="btn btn-primary btn-compare-launch"
            disabled={!isReadyToCompare}
            onClick={() => {
              if (slotA.selectedProjId && slotB.selectedProjId) {
                onCompare(slotA.selectedProjId, slotB.selectedProjId)
              }
            }}
            type="button"
          >
            {isReadyToCompare ? (
              <>
                <Check size={18} style={{ marginRight: '8px' }} /> 
                Compare Selected Projects
              </>
            ) : (
              'Select Projects to Compare'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
