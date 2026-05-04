import React from 'react'
import './PriceTicker.css'

interface PriceTickerProps {
  areaRates: Array<{ area: string; cagr: string; price: string }>;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({ areaRates = [] }) => {
  if (areaRates.length === 0) return null;
  // Duplicate the rates to create a seamless loop
  const displayRates = [...areaRates, ...areaRates]

  return (
    <div className="price-ticker-container">
      <div className="price-ticker-track">
        {displayRates.map((rate, index) => (
          <div key={`${rate.area}-${index}`} className="ticker-item">
            <span className="ticker-location-icon"></span>
            <span className="ticker-area">{rate.area.toUpperCase()}</span>
            <span className="ticker-cagr">+{rate.cagr}</span>
            <span className="ticker-price">{rate.price}/sqft</span>
            <span className="ticker-separator">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
