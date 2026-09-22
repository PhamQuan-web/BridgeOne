import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

// Official BridgeOne Logo (Handshake Bridge forming numeral 1)
export const CungNhipLogo: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/bridgeone-logo.png"
          alt="BridgeOne"
          className="h-12 w-12 object-contain rounded-xl bg-white p-0.5 border border-slate-200/90 shadow-2xs"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3.5 ${className}`}>
      <img
        src="/bridgeone-logo.png"
        alt="BridgeOne"
        className="h-14 w-auto object-contain shrink-0 drop-shadow-2xs mt-0.5"
      />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center leading-none">
          <span className="font-black text-[#1E40AF] text-2xl tracking-tight">Bridge</span>
          <span className="font-black text-[#16A34A] text-2xl tracking-tight">One</span>
        </div>
        <div className="text-[10px] font-extrabold text-blue-900 tracking-wider uppercase mt-1 leading-snug">
          {t('brand.slogan', 'Hòa nhập · Phát triển · Thăng tiến')}
        </div>
        <div className="text-[11px] text-slate-500 font-semibold tracking-tight leading-snug mt-0.5">
          {t('brand.mission', 'Công việc rõ ràng, đồng hành vững bền.')}
        </div>
      </div>
    </div>
  );
};

// Friendly anime/cartoon thumbs-up boy illustration on bottom-left
export const WorkerIllustration: React.FC<{
  phrase?: string;
  subphrase?: string;
}> = ({
  phrase,
  subphrase,
}) => {
  const { isVi } = useLanguage();
  const displayPhrase = phrase || (isVi ? 'Giao tiếp rõ ràng tạo nên đội ngũ vững mạnh.' : 'Clear communication builds stronger teams.');
  const displaySubphrase = subphrase || (isVi ? 'Mỗi đóng góp của bạn đều có ý nghĩa. Môi trường hòa nhập mở ra cơ hội an toàn hơn cho mọi người.' : 'You make a difference. Inclusive workplaces create safer, stronger opportunities for everyone.');

  return (
    <div className="pt-2 select-none overflow-visible">
      {/* Cartoon boy with thumbs up */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Floating handwritten slogan with green tick marks */}
        <div className="relative self-end mr-3 mb-0 z-10 max-w-[170px] text-right transform rotate-[-3deg]">
          <span className="font-handwriting text-blue-600 text-[18px] sm:text-[19px] font-bold leading-tight block drop-shadow-2xs">
            {displayPhrase}
          </span>
          {/* Green accent ticks */}
          <div className="absolute -top-2.5 -right-1 text-emerald-500 flex gap-0.5">
            <span className="transform rotate-[-20deg] font-bold text-sm">/</span>
            <span className="transform rotate-[-5deg] font-bold text-sm">|</span>
            <span className="transform rotate-[15deg] font-bold text-sm">\</span>
          </div>
        </div>

        {/* Vector Boy Character */}
        <div className="w-48 h-36 relative overflow-visible flex items-end justify-center">
          <svg viewBox="0 0 200 160" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background aura */}
            <circle cx="100" cy="110" r="70" fill="#EFF6FF" />
            
            {/* Body / Blue polo shirt */}
            <path
              d="M30 160C30 135 55 120 100 120C145 120 170 135 170 160Z"
              fill="#2563EB"
            />
            {/* Polo collar */}
            <path d="M78 120L95 138L105 138L122 120" stroke="#1D4ED8" strokeWidth="3" fill="#3B82F6" />
            <path d="M100 138V160" stroke="#1D4ED8" strokeWidth="2.5" />
            
            {/* Neck */}
            <rect x="88" y="98" width="24" height="24" rx="4" fill="#FED7AA" />
            
            {/* Face */}
            <ellipse cx="100" cy="78" rx="30" ry="32" fill="#FFEDD5" />
            
            {/* Eyes - smiling anime arcs */}
            <path d="M84 75C84 75 88 71 94 75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M106 75C106 75 112 71 118 75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            
            {/* Cheerful blush */}
            <ellipse cx="80" cy="84" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.6" />
            <ellipse cx="120" cy="84" rx="6" ry="3.5" fill="#FCA5A5" opacity="0.6" />
            
            {/* Nose */}
            <path d="M100 78V83L97 84" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
            
            {/* Smile */}
            <path d="M91 88C95 95 105 95 109 88" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#F43F5E" />
            
            {/* Hair - black stylized sweep */}
            <path
              d="M70 65C68 45 85 30 105 30C125 30 138 42 135 60C132 50 120 42 110 44C95 46 88 56 85 64C82 62 76 60 70 65Z"
              fill="#0F172A"
            />
            {/* Side burns & back hair */}
            <path d="M68 62C65 72 70 82 72 85" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
            <path d="M132 62C135 72 130 82 128 85" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />

            {/* Hand giving big Thumbs Up */}
            <g transform="translate(130, 78)">
              {/* Arm reaching up */}
              <path d="M10 50L30 25" stroke="#2563EB" strokeWidth="20" strokeLinecap="round" />
              {/* Hand fist */}
              <ellipse cx="36" cy="22" rx="14" ry="12" fill="#FED7AA" />
              {/* Thumb pointing straight up */}
              <rect x="30" y="-8" width="12" height="24" rx="6" fill="#FED7AA" transform="rotate(-5 30 -8)" />
              {/* Fingers clenched */}
              <path d="M26 18C28 14 36 14 38 18" stroke="#FDBA74" strokeWidth="2" />
              <path d="M26 24C28 20 36 20 38 24" stroke="#FDBA74" strokeWidth="2" />
            </g>

            {/* Thumbs up green energy marks */}
            <g transform="translate(165, 60)" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
              <line x1="0" y1="0" x2="6" y2="-6" />
              <line x1="8" y1="5" x2="16" y2="5" />
              <line x1="2" y1="12" x2="8" y2="18" />
            </g>
          </svg>
        </div>
      </div>

      {/* Green leaf motivation card */}
      <div className="mt-2 bg-[#F0FDF4] border border-emerald-200/90 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-2xs">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 1.5 1.5 3 3 3s4-1.5 6-3.5c.5-.5 1-.95 1.5-1.4" />
          </svg>
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-emerald-950 block">
            {isVi ? 'Bạn tạo nên sự khác biệt.' : 'You make a difference.'}
          </span>
          <p className="text-[11px] text-emerald-800 leading-snug">
            {displaySubphrase}
          </p>
        </div>
      </div>
    </div>
  );
};

// Bottom Right Botanical Hill with dual leaves and cursive text
export const BotanicalCorner: React.FC<{ phrase?: string }> = ({
  phrase,
}) => {
  const { isVi } = useLanguage();
  const displayPhrase = phrase || (isVi ? 'Hòa nhập hơn. Tương lai tươi sáng hơn.' : 'More inclusion. Brighter tomorrows.');
  return (
    <div className="relative w-full h-36 overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 320 140"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft pastel green hill */}
        <path
          d="M0 140C90 120 180 80 320 60V140H0Z"
          fill="#ECFDF5"
        />
        <path
          d="M60 140C150 125 220 95 320 85V140H60Z"
          fill="#D1FAE5"
          opacity="0.6"
        />

        {/* Sprouting 2 Leaves */}
        <g transform="translate(250, 45)">
          {/* Main Stem */}
          <path
            d="M20 70C20 40 32 15 45 0"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left Leaf */}
          <path
            d="M25 45C5 38 0 20 12 10C24 15 28 32 25 45Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="1.5"
          />
          {/* Right Leaf */}
          <path
            d="M38 28C56 22 62 8 50 2C38 6 34 18 38 28Z"
            fill="#34D399"
            stroke="#059669"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* Cursive handwritten phrase */}
      <div className="absolute bottom-5 right-6 z-10 text-right transform rotate-[-3deg]">
        <span className="font-handwriting text-blue-800 text-[20px] sm:text-[22px] font-bold tracking-wide drop-shadow-2xs">
          {displayPhrase}
        </span>
      </div>
    </div>
  );
};

// An (Team lead) avatar with friendly professional presentation
export const AnAvatar: React.FC<{ size?: string }> = ({ size = 'w-10 h-10' }) => {
  return (
    <div className={`${size} rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs relative bg-amber-50`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        {/* Soft studio backdrop */}
        <rect width="100" height="100" fill="#FDE68A" />
        {/* Dark hair background */}
        <circle cx="50" cy="50" r="38" fill="#3B2314" />
        {/* Neck */}
        <rect x="42" y="58" width="16" height="20" fill="#FBD5B5" />
        {/* Blazer shirt */}
        <path d="M20 100C20 75 35 70 50 70C65 70 80 75 80 100Z" fill="#1E293B" />
        <path d="M38 70L50 86L62 70" fill="#FFFFFF" />
        {/* Oval Face */}
        <ellipse cx="50" cy="46" rx="20" ry="22" fill="#FDE0C7" />
        {/* Eyes */}
        <ellipse cx="43" cy="44" rx="2.5" ry="3" fill="#1E293B" />
        <ellipse cx="57" cy="44" rx="2.5" ry="3" fill="#1E293B" />
        {/* Smile */}
        <path d="M43 54C46 59 54 59 57 54" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />
        {/* Front Hair bangs & framing */}
        <path
          d="M30 40C32 25 45 20 50 20C60 20 70 25 70 40C64 30 55 28 50 28C45 28 36 30 30 40Z"
          fill="#451A03"
        />
        <path d="M30 40C28 55 32 68 34 74" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
        <path d="M70 40C72 55 68 68 66 74" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Minh (Worker) avatar
export const MinhAvatar: React.FC<{ size?: string; name?: string }> = ({
  size = 'w-9 h-9',
  name = 'M',
}) => {
  return (
    <div className={`${size} rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-blue-500 shadow-2xs`}>
      {name}
    </div>
  );
};

// Backwards compatibility aliases
export const TaylorKimAvatar = AnAvatar;
export const JordanAvatar = MinhAvatar;

