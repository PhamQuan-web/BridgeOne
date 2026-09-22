import React from 'react';

interface StepVisualProps {
  type: 'inspect' | 'place_tray' | 'label' | 'rack';
  destination?: string;
  isUpdated?: boolean;
}

export const StepVisual: React.FC<StepVisualProps> = ({
  type,
  destination = 'Tray B',
  isUpdated = false,
}) => {
  switch (type) {
    case 'inspect':
      return (
        <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80">
          <svg className="w-full h-full" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="140" fill="#F1F5F9" />
            {/* Workbench mat */}
            <rect x="20" y="25" width="200" height="95" rx="8" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="30" y1="40" x2="210" y2="40" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 3" />
            
            {/* Unit 1 */}
            <rect x="45" y="48" width="65" height="50" rx="6" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="52" y="55" width="22" height="16" rx="2" fill="#0EA5E9" />
            <circle cx="88" cy="63" r="6" fill="#10B981" />
            <rect x="52" y="78" width="51" height="8" rx="2" fill="#64748B" />
            
            {/* Unit 2 */}
            <rect x="130" y="48" width="65" height="50" rx="6" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="137" y="55" width="22" height="16" rx="2" fill="#0EA5E9" />
            <circle cx="173" cy="63" r="6" fill="#10B981" />
            <rect x="137" y="78" width="51" height="8" rx="2" fill="#64748B" />

            {/* Magnifying Loupe / Inspection Tool */}
            <circle cx="160" cy="65" r="22" fill="#38BDF8" fillOpacity="0.25" stroke="#0284C7" strokeWidth="2.5" />
            <line x1="175" y1="80" x2="198" y2="103" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            
            {/* Checked pass badge */}
            <g transform="translate(148, 53)">
              <circle cx="12" cy="12" r="10" fill="#10B981" />
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200">
            Check integrity &amp; 0 defects
          </span>
        </div>
      );

    case 'place_tray':
      return (
        <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80">
          <svg className="w-full h-full" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="140" fill="#F8FAFC" />
            {/* Tray container */}
            <rect
              x="25"
              y="22"
              width="190"
              height="96"
              rx="10"
              fill={destination === 'Tray B' ? '#EFF6FF' : '#F1F5F9'}
              stroke={destination === 'Tray B' ? '#3B82F6' : '#94A3B8'}
              strokeWidth="2"
            />
            {/* Inner tray compartments */}
            <rect x="35" y="32" width="80" height="76" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
            <rect x="125" y="32" width="80" height="76" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />

            {/* Seated Unit 1 */}
            <rect x="45" y="42" width="60" height="56" rx="4" fill="#1E293B" />
            <rect x="52" y="50" width="46" height="10" rx="2" fill="#38BDF8" />
            <circle cx="75" cy="74" r="6" fill="#10B981" />

            {/* Seated Unit 2 */}
            <rect x="135" y="42" width="60" height="56" rx="4" fill="#1E293B" />
            <rect x="142" y="50" width="46" height="10" rx="2" fill="#38BDF8" />
            <circle cx="165" cy="74" r="6" fill="#10B981" />

            {/* Prominent Tray Tag */}
            <rect
              x="82"
              y="10"
              width="76"
              height="20"
              rx="4"
              fill={destination === 'Tray B' ? '#1D4ED8' : '#475569'}
            />
            <text x="120" y="24" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" letterSpacing="0.5">
              {destination.toUpperCase()}
            </text>
          </svg>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {isUpdated && (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Updated to {destination}
              </span>
            )}
          </div>
          <span className="absolute bottom-2 left-2.5 px-2 py-0.5 text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200">
            Capacity: 2 units
          </span>
        </div>
      );

    case 'label':
      return (
        <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80">
          <svg className="w-full h-full" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="140" fill="#F8FAFC" />
            {/* Unit enclosure */}
            <rect x="40" y="24" width="160" height="92" rx="8" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <rect x="52" y="36" width="60" height="14" rx="2" fill="#64748B" />
            
            {/* Green Completed Label */}
            <g transform="translate(118, 34)">
              <rect x="0" y="0" width="72" height="42" rx="4" fill="#059669" stroke="#10B981" strokeWidth="1.5" />
              <text x="36" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" letterSpacing="0.5">
                COMPLETED
              </text>
              <line x1="8" y1="22" x2="64" y2="22" stroke="white" strokeWidth="0.75" strokeOpacity="0.5" />
              {/* Barcode lines */}
              <line x1="12" y1="26" x2="12" y2="36" stroke="white" strokeWidth="2" />
              <line x1="17" y1="26" x2="17" y2="36" stroke="white" strokeWidth="1" />
              <line x1="22" y1="26" x2="22" y2="36" stroke="white" strokeWidth="2.5" />
              <line x1="28" y1="26" x2="28" y2="36" stroke="white" strokeWidth="1" />
              <line x1="33" y1="26" x2="33" y2="36" stroke="white" strokeWidth="3" />
              <line x1="40" y1="26" x2="40" y2="36" stroke="white" strokeWidth="1.5" />
              <line x1="46" y1="26" x2="46" y2="36" stroke="white" strokeWidth="2" />
              <line x1="53" y1="26" x2="53" y2="36" stroke="white" strokeWidth="1" />
              <line x1="58" y1="26" x2="58" y2="36" stroke="white" strokeWidth="2.5" />
            </g>

            {/* Corner peel/adhesion hand guide */}
            <circle cx="178" cy="68" r="14" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5" />
            <path d="M174 68L177 71L183 65" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200">
            Adhere green QA label on top-right
          </span>
        </div>
      );

    case 'rack':
      return (
        <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80">
          <svg className="w-full h-full" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="140" fill="#F8FAFC" />
            {/* Staging rack frame */}
            <rect x="25" y="18" width="190" height="104" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            {/* Shelf lines */}
            <line x1="25" y1="52" x2="215" y2="52" stroke="#475569" strokeWidth="2" />
            <line x1="25" y1="86" x2="215" y2="86" stroke="#475569" strokeWidth="2" />
            {/* Dividers */}
            <line x1="88" y1="18" x2="88" y2="122" stroke="#334155" strokeWidth="2" />
            <line x1="152" y1="18" x2="152" y2="122" stroke="#334155" strokeWidth="2" />

            {/* Slot 1, 2, 3 occupied */}
            <rect x="32" y="24" width="50" height="22" rx="3" fill="#64748B" />
            <rect x="95" y="24" width="50" height="22" rx="3" fill="#64748B" />
            <rect x="32" y="58" width="50" height="22" rx="3" fill="#64748B" />

            {/* Target Slot 4: Line A buffer */}
            <rect x="95" y="58" width="50" height="22" rx="3" fill="#2563EB" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="120" y="73" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">
              SLOT 4
            </text>

            {/* Incoming Tray moving arrow */}
            <path d="M120 106V85M120 85L115 90M120 85L125 90" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="100" y="106" width="40" height="12" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
            <text x="120" y="115" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="700">
              {destination}
            </text>
          </svg>
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200">
            Assembly Line A · Staging Slot 4
          </span>
        </div>
      );
  }
};
