import React from 'react';

export type PhotoType =
  | 'inspect-unit'
  | 'tray-a'
  | 'tray-b'
  | 'completed-label'
  | 'staging-rack'
  | 'prepare-materials'
  | 'wrap-assembly'
  | 'place-in-box'
  | 'close-and-label'
  | 'tray-a-to-b'
  | 'meeting-room-screen'
  | 'meeting-room-door'
  | 'meeting-equipment'
  | 'meeting-seating'
  | 'meeting-quick-test';

export const RealisticPhoto: React.FC<{
  type: PhotoType;
  className?: string;
  badge?: string;
}> = ({ type, className = 'w-full h-full object-cover', badge }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900 select-none shadow-xs ${className}`}>
      {type === 'inspect-unit' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Workshop bench backdrop */}
          <rect width="400" height="280" fill="#2B303A" />
          <path d="M0 160L400 130V280H0Z" fill="#1F232B" opacity="0.7" />
          {/* Antistatic mat grid */}
          <line x1="20" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="20" y1="220" x2="380" y2="220" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Black Machined Unit Body */}
          <rect x="130" y="70" width="140" height="130" rx="14" fill="#111827" stroke="#374151" strokeWidth="3" />
          <rect x="145" y="85" width="110" height="36" rx="6" fill="#1F2937" />
          {/* Circular optical lens / port */}
          <circle cx="200" cy="150" r="32" fill="#0B0F17" stroke="#4B5563" strokeWidth="4" />
          <circle cx="200" cy="150" r="22" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="208" cy="144" r="8" fill="#FFFFFF" fillOpacity="0.6" />
          {/* Status LEDs */}
          <circle cx="158" cy="103" r="5" fill="#10B981" />
          <circle cx="174" cy="103" r="5" fill="#3B82F6" />
          <circle cx="190" cy="103" r="5" fill="#F59E0B" />

          {/* Gloved Hands holding unit */}
          {/* Left Hand with grey inspection glove */}
          <path
            d="M60 210C70 170 110 145 140 145C146 145 150 150 146 160C135 180 110 220 90 260Z"
            fill="#94A3B8"
            stroke="#64748B"
            strokeWidth="3"
          />
          {/* Thumb */}
          <path d="M125 145C135 130 148 135 144 148C138 158 130 162 125 145Z" fill="#94A3B8" />

          {/* Right Hand holding unit */}
          <path
            d="M340 210C330 170 290 145 260 145C254 145 250 150 254 160C265 180 290 220 310 260Z"
            fill="#94A3B8"
            stroke="#64748B"
            strokeWidth="3"
          />
          <path d="M275 145C265 130 252 135 256 148C262 158 270 162 275 145Z" fill="#94A3B8" />

          {/* Magnifier focus highlight */}
          <circle cx="200" cy="150" r="48" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
        </svg>
      )}

      {type === 'tray-a' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Warehouse metal shelf background */}
          <rect width="400" height="280" fill="#334155" />
          <rect x="0" y="190" width="400" height="30" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <line x1="0" y1="190" x2="400" y2="190" stroke="#64748B" strokeWidth="3" />
          <rect x="0" y="40" width="400" height="16" fill="#1E293B" />
          <rect x="30" y="0" width="22" height="280" fill="#475569" stroke="#1E293B" strokeWidth="2" />
          <rect x="350" y="0" width="22" height="280" fill="#475569" stroke="#1E293B" strokeWidth="2" />

          {/* Red/Amber Plastic Tote / Crate (Tray A) with Full stack */}
          <g id="tray-a-crate">
            <ellipse cx="200" cy="205" rx="140" ry="25" fill="#000000" opacity="0.5" />
            <path d="M75 105L325 105L305 195L95 195Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="4" />
            <rect x="70" y="95" width="260" height="18" rx="4" fill="#B91C1C" stroke="#991B1B" strokeWidth="2" />
            <line x1="125" y1="113" x2="135" y2="195" stroke="#991B1B" strokeWidth="3" />
            <line x1="175" y1="113" x2="180" y2="195" stroke="#991B1B" strokeWidth="3" />
            <line x1="225" y1="113" x2="220" y2="195" stroke="#991B1B" strokeWidth="3" />
            <line x1="275" y1="113" x2="265" y2="195" stroke="#991B1B" strokeWidth="3" />

            {/* Units overflowing / full in Tray A */}
            <rect x="110" y="75" width="80" height="30" rx="4" fill="#1F2937" stroke="#374151" strokeWidth="2" />
            <rect x="195" y="70" width="85" height="35" rx="4" fill="#111827" stroke="#374151" strokeWidth="2" />

            {/* White bold 'A' on the front */}
            <rect x="175" y="125" width="50" height="52" rx="6" fill="#FFFFFF" />
            <text x="200" y="166" textAnchor="middle" fill="#DC2626" fontSize="42" fontWeight="900" fontFamily="sans-serif">
              A
            </text>
            
            {/* Full badge */}
            <rect x="140" y="102" width="120" height="18" rx="9" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" />
            <text x="200" y="115" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="800">
              CAPACITY FULL
            </text>
          </g>
        </svg>
      )}

      {type === 'tray-b' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Warehouse metal shelf background */}
          <rect width="400" height="280" fill="#334155" />
          {/* Steel shelves */}
          <rect x="0" y="190" width="400" height="30" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <line x1="0" y1="190" x2="400" y2="190" stroke="#64748B" strokeWidth="3" />
          <rect x="0" y="40" width="400" height="16" fill="#1E293B" />
          {/* Upright shelf struts */}
          <rect x="30" y="0" width="22" height="280" fill="#475569" stroke="#1E293B" strokeWidth="2" />
          <rect x="350" y="0" width="22" height="280" fill="#475569" stroke="#1E293B" strokeWidth="2" />

          {/* Vibrant Royal Blue Plastic Tote / Crate (Tray B) */}
          <g id="tray-b-crate">
            {/* Box shadow */}
            <ellipse cx="200" cy="205" rx="140" ry="25" fill="#000000" opacity="0.5" />
            {/* Main crate body */}
            <path
              d="M75 105L325 105L305 195L95 195Z"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="4"
            />
            {/* Crate rim */}
            <rect x="70" y="95" width="260" height="18" rx="4" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
            {/* Reinforcement ribs */}
            <line x1="125" y1="113" x2="135" y2="195" stroke="#1E40AF" strokeWidth="3" />
            <line x1="175" y1="113" x2="180" y2="195" stroke="#1E40AF" strokeWidth="3" />
            <line x1="225" y1="113" x2="220" y2="195" stroke="#1E40AF" strokeWidth="3" />
            <line x1="275" y1="113" x2="265" y2="195" stroke="#1E40AF" strokeWidth="3" />

            {/* Handhold cutouts */}
            <rect x="180" y="103" width="40" height="8" rx="4" fill="#0F172A" opacity="0.6" />

            {/* White bold 'B' on the front */}
            <rect x="175" y="125" width="50" height="52" rx="6" fill="#FFFFFF" />
            <text x="200" y="166" textAnchor="middle" fill="#1D4ED8" fontSize="42" fontWeight="900" fontFamily="sans-serif">
              B
            </text>
            
            {/* Shelf barcode label */}
            <rect x="135" y="200" width="130" height="14" rx="2" fill="#FFFFFF" />
            <text x="200" y="210" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="700">
              LOC: B-02 · SHIPPING BUFFER
            </text>
          </g>
        </svg>
      )}

      {type === 'completed-label' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Industrial desk surface */}
          <rect width="400" height="280" fill="#1E293B" />
          
          {/* Top view of black unit */}
          <rect x="60" y="45" width="280" height="190" rx="18" fill="#0F172A" stroke="#334155" strokeWidth="4" />
          <rect x="80" y="65" width="240" height="150" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          
          {/* Cooling vents / grill lines */}
          <g stroke="#334155" strokeWidth="3">
            <line x1="95" y1="85" x2="160" y2="85" />
            <line x1="95" y1="98" x2="160" y2="98" />
            <line x1="95" y1="111" x2="160" y2="111" />
            <line x1="95" y1="124" x2="160" y2="124" />
          </g>

          {/* Bright Green Rectangular "Completed" QA Label sticker */}
          <g transform="translate(175, 80)">
            {/* White adhesive border */}
            <rect x="-4" y="-4" width="138" height="98" rx="8" fill="#FFFFFF" />
            {/* Vivid emerald label */}
            <rect x="0" y="0" width="130" height="90" rx="6" fill="#059669" stroke="#10B981" strokeWidth="2" />
            
            {/* Checkmark icon */}
            <circle cx="65" cy="24" r="14" fill="#10B981" />
            <path d="M59 24L63 28L71 20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            <text x="65" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900" letterSpacing="1">
              COMPLETED
            </text>
            <text x="65" y="66" textAnchor="middle" fill="#D1FAE5" fontSize="9" fontWeight="600">
              QA PASSED · LINE A
            </text>

            {/* Micro barcode */}
            <g stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8">
              <line x1="20" y1="73" x2="20" y2="82" strokeWidth="2.5" />
              <line x1="26" y1="73" x2="26" y2="82" strokeWidth="1" />
              <line x1="31" y1="73" x2="31" y2="82" strokeWidth="2" />
              <line x1="37" y1="73" x2="37" y2="82" strokeWidth="1" />
              <line x1="43" y1="73" x2="43" y2="82" strokeWidth="3" />
              <line x1="50" y1="73" x2="50" y2="82" strokeWidth="1" />
              <line x1="58" y1="73" x2="58" y2="82" strokeWidth="2.5" />
              <line x1="66" y1="73" x2="66" y2="82" strokeWidth="1.5" />
              <line x1="75" y1="73" x2="75" y2="82" strokeWidth="2" />
              <line x1="84" y1="73" x2="84" y2="82" strokeWidth="3" />
              <line x1="93" y1="73" x2="93" y2="82" strokeWidth="1" />
              <line x1="102" y1="73" x2="102" y2="82" strokeWidth="2.5" />
              <line x1="110" y1="73" x2="110" y2="82" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {type === 'staging-rack' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Warehouse interior backdrop */}
          <rect width="400" height="280" fill="#1E293B" />
          <path d="M0 220L400 220V280H0Z" fill="#0F172A" />
          <line x1="0" y1="220" x2="400" y2="220" stroke="#FBBF24" strokeWidth="6" strokeDasharray="30 20" />
          
          {/* Heavy duty blue shelving uprights */}
          <rect x="50" y="20" width="30" height="210" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
          <rect x="320" y="20" width="30" height="210" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
          {/* Horizontal crossbeams */}
          <rect x="50" y="60" width="300" height="18" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          <rect x="50" y="140" width="300" height="18" fill="#F97316" stroke="#C2410C" strokeWidth="2" />

          {/* Stored trays */}
          <rect x="95" y="90" width="90" height="50" rx="4" fill="#64748B" />
          <rect x="205" y="90" width="90" height="50" rx="4" fill="#2563EB" />
          <text x="250" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">
            B
          </text>

          {/* Crisp White Signboard: "Staging ->" */}
          <g transform="translate(100, 168)">
            <rect x="0" y="0" width="200" height="46" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <text x="75" y="31" textAnchor="middle" fill="#0F172A" fontSize="22" fontWeight="900" letterSpacing="0.5">
              Staging
            </text>
            {/* Bold black arrow pointing right */}
            <path
              d="M130 23H165M165 23L152 14M165 23L152 32"
              stroke="#0F172A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}

      {type === 'prepare-materials' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          {/* Packing bench */}
          <rect width="400" height="280" fill="#E2E8F0" />
          {/* Open corrugated cardboard box */}
          <path d="M70 120L190 70L310 120L190 170Z" fill="#D97706" stroke="#B45309" strokeWidth="3" />
          <path d="M70 120L190 170V240L70 190Z" fill="#B45309" stroke="#92400E" strokeWidth="3" />
          <path d="M310 120L190 170V240L310 190Z" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          
          {/* White foam padding sheet */}
          <rect x="230" y="40" width="130" height="85" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" transform="rotate(12 230 40)" />
          {/* Roll of tape */}
          <circle cx="90" cy="80" r="30" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
          <circle cx="90" cy="80" r="16" fill="#FDE68A" />
          {/* Shipping label pack */}
          <rect x="140" y="30" width="70" height="45" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="148" y1="42" x2="195" y2="42" stroke="#0F172A" strokeWidth="3" />
          <line x1="148" y1="52" x2="185" y2="52" stroke="#64748B" strokeWidth="2" />
        </svg>
      )}

      {type === 'wrap-assembly' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#334155" />
          {/* Gloved hands wrapping unit */}
          <rect x="120" y="70" width="160" height="120" rx="10" fill="#0F172A" />
          {/* White foam wrap folds */}
          <path d="M90 60L230 40L310 190L170 210Z" fill="#FFFFFF" fillOpacity="0.85" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M110 90L290 80L270 200L90 210Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          {/* Gloves holding the wrap */}
          <ellipse cx="90" cy="150" rx="28" ry="18" fill="#94A3B8" stroke="#64748B" strokeWidth="3" transform="rotate(25 90 150)" />
          <ellipse cx="310" cy="150" rx="28" ry="18" fill="#94A3B8" stroke="#64748B" strokeWidth="3" transform="rotate(-25 310 150)" />
        </svg>
      )}

      {type === 'place-in-box' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#475569" />
          {/* Open shipping carton top-down */}
          <rect x="70" y="40" width="260" height="200" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="4" />
          <rect x="90" y="60" width="220" height="160" rx="4" fill="#78350F" />
          {/* Cushioning peanuts/foam */}
          <rect x="110" y="80" width="180" height="120" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          {/* Unit inside */}
          <rect x="135" y="100" width="130" height="80" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="200" cy="140" r="18" fill="#0284C7" />
        </svg>
      )}

      {type === 'close-and-label' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#334155" />
          {/* Sealed box top view */}
          <rect x="60" y="40" width="280" height="200" rx="10" fill="#D97706" stroke="#92400E" strokeWidth="4" />
          {/* Sealing Tape across seam */}
          <rect x="50" y="125" width="300" height="30" fill="#FCD34D" fillOpacity="0.8" stroke="#F59E0B" strokeWidth="2" />
          {/* Shipping barcode label */}
          <g transform="translate(180, 60)">
            <rect x="0" y="0" width="120" height="90" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <text x="12" y="24" fill="#0F172A" fontSize="14" fontWeight="900">PRIORITY</text>
            <text x="12" y="38" fill="#64748B" fontSize="9" fontWeight="600">CARRIER EXP-402</text>
            <line x1="12" y1="46" x2="108" y2="46" stroke="#CBD5E1" strokeWidth="1" />
            {/* Barcode lines */}
            <g stroke="#0F172A" strokeWidth="2">
              <line x1="15" y1="52" x2="15" y2="78" strokeWidth="3" />
              <line x1="22" y1="52" x2="22" y2="78" strokeWidth="1" />
              <line x1="27" y1="52" x2="27" y2="78" strokeWidth="2.5" />
              <line x1="34" y1="52" x2="34" y2="78" strokeWidth="1.5" />
              <line x1="42" y1="52" x2="42" y2="78" strokeWidth="4" />
              <line x1="50" y1="52" x2="50" y2="78" strokeWidth="1" />
              <line x1="58" y1="52" x2="58" y2="78" strokeWidth="3" />
              <line x1="68" y1="52" x2="68" y2="78" strokeWidth="2" />
              <line x1="77" y1="52" x2="77" y2="78" strokeWidth="3" />
              <line x1="88" y1="52" x2="88" y2="78" strokeWidth="1" />
              <line x1="96" y1="52" x2="96" y2="78" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {type === 'tray-a-to-b' && (
        <svg viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="240" fill="#1E293B" />
          
          {/* Left: Tray A (Grey / Disabled) */}
          <g transform="translate(30, 45)">
            <rect x="0" y="0" width="130" height="110" rx="8" fill="#64748B" stroke="#475569" strokeWidth="3" />
            <rect x="15" y="15" width="100" height="20" rx="3" fill="#475569" />
            <rect x="40" y="45" width="50" height="48" rx="6" fill="#FFFFFF" />
            <text x="65" y="82" textAnchor="middle" fill="#475569" fontSize="38" fontWeight="900">
              A
            </text>
            <text x="65" y="132" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="600">
              Tray A (Processing)
            </text>
            {/* Red strike through / deprecation mark */}
            <circle cx="65" cy="69" r="32" stroke="#EF4444" strokeWidth="4" fill="none" opacity="0.8" />
            <line x1="42" y1="46" x2="88" y2="92" stroke="#EF4444" strokeWidth="4" opacity="0.8" />
          </g>

          {/* Center Arrow */}
          <g transform="translate(180, 85)">
            <path
              d="M0 15H35M35 15L23 5M35 15L23 25"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Right: Tray B (Vibrant Royal Blue / Active) */}
          <g transform="translate(240, 45)">
            <rect x="0" y="0" width="130" height="110" rx="8" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
            <rect x="15" y="15" width="100" height="20" rx="3" fill="#1D4ED8" />
            <rect x="40" y="45" width="50" height="48" rx="6" fill="#FFFFFF" />
            <text x="65" y="82" textAnchor="middle" fill="#2563EB" fontSize="38" fontWeight="900">
              B
            </text>
            <text x="65" y="132" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700">
              Tray B (Shipping)
            </text>
            {/* Green active badge */}
            <g transform="translate(88, -10)">
              <circle cx="16" cy="16" r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M11 16L14 19L21 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>

          {/* Bottom Green notification pill */}
          <g transform="translate(50, 195)">
            <rect x="0" y="0" width="300" height="32" rx="16" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
            <circle cx="20" cy="16" r="8" fill="#10B981" />
            <path d="M17 16L19 18L23 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="36" y="21" fill="#065F46" fontSize="12" fontWeight="700">
              Updated: Move completed orders to Tray B (Shipping)
            </text>
          </g>
        </svg>
      )}

      {/* Meeting Room Visuals for Facilitator Workspace Screen */}
      {type === 'meeting-room-screen' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#0F172A" />
          {/* Conference room wall */}
          <rect x="30" y="30" width="340" height="200" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="3" />
          {/* Display monitor */}
          <rect x="60" y="50" width="280" height="150" rx="8" fill="#0284C7" />
          <text x="200" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" letterSpacing="0.5">
            Good meetings bring out great ideas.
          </text>
          <text x="200" y="145" textAnchor="middle" fill="#E0F2FE" fontSize="12">
            Weekly Operations &amp; Team Onboarding
          </text>
          {/* Soundbar / camera below */}
          <rect x="130" y="208" width="140" height="10" rx="5" fill="#475569" />
          <circle cx="200" cy="213" r="3" fill="#10B981" />
        </svg>
      )}

      {type === 'meeting-room-door' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#E2E8F0" />
          {/* Wooden door */}
          <rect x="90" y="20" width="220" height="260" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="4" />
          <rect x="110" y="40" width="180" height="90" rx="4" fill="#92400E" />
          <rect x="110" y="150" width="180" height="110" rx="4" fill="#92400E" />
          {/* Silver Room Plaque */}
          <rect x="135" y="65" width="130" height="42" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
          <text x="200" y="91" textAnchor="middle" fill="#0F172A" fontSize="15" fontWeight="900" letterSpacing="0.5">
            Meeting Room A
          </text>
          {/* Handle */}
          <rect x="265" y="155" width="16" height="40" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
        </svg>
      )}

      {type === 'meeting-equipment' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#334155" />
          {/* Wall mounted AV tablet */}
          <rect x="80" y="40" width="240" height="190" rx="14" fill="#0F172A" stroke="#1E293B" strokeWidth="4" />
          <rect x="100" y="60" width="200" height="145" rx="6" fill="#1E293B" />
          <text x="200" y="95" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800">
            Room Control System
          </text>
          {/* Control icons */}
          <rect x="115" y="115" width="45" height="40" rx="6" fill="#059669" />
          <text x="137" y="140" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">Display</text>
          <rect x="175" y="115" width="45" height="40" rx="6" fill="#2563EB" />
          <text x="197" y="140" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">Audio</text>
          <rect x="235" y="115" width="45" height="40" rx="6" fill="#7C3AED" />
          <text x="257" y="140" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">Camera</text>
        </svg>
      )}

      {type === 'meeting-seating' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#F1F5F9" />
          {/* Carpet */}
          <rect x="40" y="30" width="320" height="220" rx="12" fill="#E2E8F0" />
          {/* Boardroom table in U shape */}
          <path
            d="M90 70H310V110H240V180H160V110H90Z"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="3"
          />
          {/* Executive mesh chairs */}
          <circle cx="70" cy="90" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="330" cy="90" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="130" cy="195" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="270" cy="195" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="200" cy="50" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        </svg>
      )}

      {type === 'meeting-quick-test' && (
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="400" height="280" fill="#064E3B" />
          <circle cx="200" cy="115" r="50" fill="#10B981" />
          <path d="M175 115L192 132L225 98" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="200" y="195" textAnchor="middle" fill="#ECFDF5" fontSize="22" fontWeight="900">
            Good to go!
          </text>
          <text x="200" y="222" textAnchor="middle" fill="#A7F3D0" fontSize="13" fontWeight="600">
            Display, Audio &amp; Captions Ready
          </text>
        </svg>
      )}

      {badge && (
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white font-bold text-[11px] rounded-lg shadow-sm border border-white/20">
          {badge}
        </div>
      )}
    </div>
  );
};
