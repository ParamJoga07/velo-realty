import React from "react";

export function HyderabadSouthMap() {
  return (
    <div className="corridor-map-container">
      <iframe
        title="Hyderabad South Corridor"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15587.123456789012!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v0000000000000"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function HyderabadWestMap() {
  return (
    <div className="corridor-map-container">
      <iframe
        title="Hyderabad West Corridor"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15700.123456789012!2d78.3700!3d17.4500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v0000000000001"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function HyderabadEastMap() {
  return (
    <div className="corridor-map-container">
      <iframe
        title="Hyderabad East Corridor"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15650.123456789012!2d78.5500!3d17.4000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v0000000000002"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function HyderabadNorthMap() {
  return (
    <div className="corridor-map-container">
      <iframe
        title="Hyderabad North Corridor"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15480.123456789012!2d78.5000!3d17.5000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v0000000000003"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function HyderabadCentralMap() {
  return (
    <div className="corridor-map-container">
      <iframe
        title="Hyderabad Central Corridor"
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.52323456789!2d78.4738!3d17.4323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91dabc12345%3A0xabcdef1234567890!2sHyderabad%20Central!5e0!3m2!1sen!2sin!4v1716030000000"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export const CORRIDOR_MAPS: Record<string, React.ReactNode> = {
  "south-corridor": <HyderabadSouthMap />,
  "west-corridor": <HyderabadWestMap />,
  "east-corridor": <HyderabadEastMap />,
  "north-corridor": <HyderabadNorthMap />,
  "central-corridor": <HyderabadCentralMap />,

  "hyderabad-south": <HyderabadSouthMap />,
  "hyderabad-west": <HyderabadWestMap />,
  "hyderabad-east": <HyderabadEastMap />,
  "hyderabad-north": <HyderabadNorthMap />,
  "hyderabad-central": <HyderabadCentralMap />,
};