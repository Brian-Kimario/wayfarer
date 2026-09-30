/**
 * SVG Icon Components for replacing emojis
 * All icons are created as React components for consistency and theming
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Beach/Island icon (🏝️)
export const BeachIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="12" cy="18" rx="8" ry="3" fill={color} opacity="0.3" />
    <path d="M12 3c1.5 0 2.5 1 2.5 3 0 2-1 3-2.5 8" />
    <path d="M12 3c-1.5 0-2.5 1-2.5 3 0 2 1 3 2.5 8" />
    <path d="M4 14h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" fill={color} opacity="0.2" />
    <circle cx="5" cy="9" r="1.5" fill={color} />
    <circle cx="19" cy="10" r="1.5" fill={color} />
  </svg>
);

// Palm tree icon (🌴)
export const PalmTreeIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Trunk */}
    <path d="M12 24V10" strokeWidth="2" />
    <path d="M10 8c0-1 1-2 2-2s2 1 2 2" fill={color} opacity="0.3" />
    {/* Fronds */}
    <path d="M12 10L4 6" strokeWidth="1.5" />
    <path d="M12 10L20 6" strokeWidth="1.5" />
    <path d="M12 10L3 12" strokeWidth="1.5" />
    <path d="M12 10L21 12" strokeWidth="1.5" />
    <path d="M12 10L6 4" strokeWidth="1.5" />
    <path d="M12 10L18 4" strokeWidth="1.5" />
    <ellipse cx="8" cy="7" rx="2" ry="1" fill={color} opacity="0.3" />
    <ellipse cx="16" cy="7" rx="2" ry="1" fill={color} opacity="0.3" />
  </svg>
);

// Lion icon (🦁)
export const LionIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="12" r="5" />
    {/* Mane */}
    <circle cx="12" cy="9" r="7" fill={color} opacity="0.15" />
    <path d="M7 6c-2 1-3 3-3 5" />
    <path d="M17 6c2 1 3 3 3 5" />
    {/* Ears */}
    <path d="M10 5L9 2" strokeWidth="1" />
    <path d="M14 5l1-3" strokeWidth="1" />
    {/* Eyes */}
    <circle cx="10" cy="11" r="1" fill={color} />
    <circle cx="14" cy="11" r="1" fill={color} />
    {/* Nose */}
    <path d="M12 13l-.5 1" strokeWidth="1" />
    {/* Mouth */}
    <path d="M10.5 14.5c1 .5 2 .5 3 0" />
  </svg>
);

// Building/City icon (🏙️)
export const CityIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Left building */}
    <rect x="2" y="8" width="6" height="14" />
    <rect x="3" y="10" width="1" height="2" fill={color} />
    <rect x="5" y="10" width="1" height="2" fill={color} />
    <rect x="3" y="14" width="1" height="2" fill={color} />
    <rect x="5" y="14" width="1" height="2" fill={color} />
    <rect x="3" y="18" width="1" height="2" fill={color} />
    <rect x="5" y="18" width="1" height="2" fill={color} />
    {/* Middle tall building */}
    <rect x="10" y="4" width="5" height="18" />
    <rect x="11" y="6" width="1" height="2" fill={color} />
    <rect x="13" y="6" width="1" height="2" fill={color} />
    <rect x="11" y="11" width="1" height="2" fill={color} />
    <rect x="13" y="11" width="1" height="2" fill={color} />
    <rect x="11" y="16" width="1" height="2" fill={color} />
    <rect x="13" y="16" width="1" height="2" fill={color} />
    {/* Right building */}
    <rect x="17" y="10" width="5" height="12" />
    <rect x="18" y="12" width="1" height="2" fill={color} />
    <rect x="20" y="12" width="1" height="2" fill={color} />
    <rect x="18" y="16" width="1" height="2" fill={color} />
    <rect x="20" y="16" width="1" height="2" fill={color} />
  </svg>
);

// Mosque/Temple icon (🕌)
export const TempleIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Spires */}
    <path d="M5 12l-2 8h2" />
    <path d="M19 12l2 8h-2" />
    <path d="M12 2l-1 8h2" />
    {/* Dome */}
    <path d="M7 12c0-2 2-3 5-3s5 1 5 3" stroke={color} fill={color} opacity="0.2" />
    {/* Building base */}
    <path d="M4 20h16v2H4z" fill={color} opacity="0.3" />
    {/* Windows */}
    <rect x="8" y="12" width="1.5" height="2" fill={color} opacity="0.4" />
    <rect x="14.5" y="12" width="1.5" height="2" fill={color} opacity="0.4" />
  </svg>
);

// Palace/Monument icon (🏛️)
export const PalaceIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Roof/Pediment */}
    <path d="M4 14l8-8 8 8" fill={color} opacity="0.15" />
    {/* Columns */}
    <rect x="5" y="14" width="2" height="8" stroke={color} fill="none" />
    <rect x="9" y="14" width="2" height="8" stroke={color} fill="none" />
    <rect x="13" y="14" width="2" height="8" stroke={color} fill="none" />
    <rect x="17" y="14" width="2" height="8" stroke={color} fill="none" />
    {/* Base */}
    <line x1="4" y1="22" x2="20" y2="22" strokeWidth="2" />
    {/* Door */}
    <rect x="10" y="16" width="4" height="6" fill={color} opacity="0.2" />
  </svg>
);

// Eiffel Tower icon (🗼)
export const EiffelTowerIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Peak */}
    <path d="M12 2l1 3" />
    {/* Upper section */}
    <path d="M9 5l-3 3h12l-3-3" strokeWidth="1" />
    {/* Middle section */}
    <path d="M8 9l-2 4h12l-2-4" strokeWidth="1" />
    {/* Platform */}
    <path d="M8 13h8v2H8z" fill={color} opacity="0.3" />
    {/* Lower legs */}
    <path d="M10 15L7 22" />
    <path d="M14 15l3 7" />
    {/* Base connections */}
    <line x1="7" y1="22" x2="17" y2="22" strokeWidth="2" />
  </svg>
);

// Hotel/Building icon (🏨)
export const HotelIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="20" height="16" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <rect x="4" y="6" width="2" height="2" fill={color} />
    <rect x="8" y="6" width="2" height="2" fill={color} />
    <rect x="12" y="6" width="2" height="2" fill={color} />
    <rect x="16" y="6" width="2" height="2" fill={color} />
    <rect x="4" y="12" width="2" height="2" fill={color} />
    <rect x="8" y="12" width="2" height="2" fill={color} />
    <rect x="12" y="12" width="2" height="2" fill={color} />
    <rect x="16" y="12" width="2" height="2" fill={color} />
    <path d="M2 20h20" strokeWidth="2" />
  </svg>
);

// World/Globe icon (🌍)
export const WorldIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2c3 4 3 8 0 10s-6-2-6-6 3-10 6-10" />
    <path d="M12 2c-3 4-3 8 0 10s6-2 6-6-3-10-6-10" />
  </svg>
);

// Money/Price icon (💰)
export const MoneyIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" strokeWidth="2" />
    <path d="M22 9v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9" />
  </svg>
);

// Clipboard/List icon (📋)
export const ListIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M9 9h6M9 13h6M9 17h2" strokeWidth="1.5" />
  </svg>
);

// Airplane icon (✈️)
export const AirplaneIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.8 19.2L16 11h.9L21 3H3l4.1 8h.9l-1.8 8.2A2 2 0 0 0 7.04 20H16.96a2 2 0 0 0 1.82-2.8z" />
    <path d="M6 16.6l-2.1 2.5" />
  </svg>
);

// Calendar/Check-in icon (📅)
export const CalendarIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
    <circle cx="9" cy="15" r="1" fill={color} />
    <circle cx="15" cy="15" r="1" fill={color} />
  </svg>
);

// Guests/People icon (👥)
export const GuestsIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Rooms icon (🏠)
export const RoomsIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <rect x="9" y="3" width="6" height="4" fill={color} opacity="0.3" />
  </svg>
);

// Heart/Wishlist icon (❤️)
export const HeartIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Search icon (🔍)
export const SearchIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Warning/Alert icon (⚠️)
export const WarningIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
  </svg>
);

// Checkmark icon
export const CheckmarkIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// X/Cancel icon
export const CancelIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Takeoff/Departure icon (🛫)
export const TakeoffIcon = ({ size = 24, className = "", color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 19L21 6M21 6l-4-4M21 6l-4 4" />
    <line x1="2" y1="19" x2="22" y2="19" strokeWidth="2" />
  </svg>
);
