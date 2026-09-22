import React from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PhoneCall, Radio, CheckCircle, X, ShieldAlert, Sparkles } from 'lucide-react';
import { AnAvatar } from './BrandGraphics';

export const StationCallAlertModal: React.FC = () => {
  const { state, acceptStationCall, dismissStationCall } = useHandoff();
  const { t, isVi } = useLanguage();

  if (!state.stationCallAlert) {
    return null;
  }

  const { caller, station, reason, timestamp } = state.stationCallAlert;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="station-call-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden ring-8 ring-amber-400/30 animate-pulse">
        {/* Header Strobe Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20 text-white animate-bounce">
              <PhoneCall className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-100">
                {isVi ? 'TÍN HIỆU THỊ GIÁC · CUỘC GỌI NHANH' : 'VISUAL CALL SIGNAL · INSTANT ALERT'}
              </span>
              <h2 id="station-call-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{isVi ? 'Quản lý An đang gọi Trạm' : 'Manager An Calling Station'}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-amber-800">
                  {timestamp}
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissStationCall}
            className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-white/10 transition"
            title={t('common.close', 'Đóng')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Caller Profile Card */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <AnAvatar size="w-12 h-12" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">{caller}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-amber-200 text-amber-900 border border-amber-300">
                  {isVi ? 'Tổ trưởng ca' : 'Shift Lead'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isVi ? `Đang kết nối trực tiếp đến: ` : `Connecting directly to: `}
                <strong className="text-slate-900">{station}</strong>
              </p>
            </div>
          </div>

          {/* Call Reason / Directive */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isVi ? 'Lý do gọi & Chỉ dẫn thao tác:' : 'Reason & Work Directive:'}
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              "{reason}"
            </p>
          </div>

          {/* Visual Assist Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {isVi
                ? 'Kênh Ký hiệu & Phụ đề trực tiếp (STT) sẽ tự động mở để hỗ trợ hội thoại hai chiều.'
                : 'Live captions & visual handoff channel will open automatically for reciprocal dialogue.'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={acceptStationCall}
              className="flex-1 py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>{isVi ? 'Nhận cuộc gọi & Bật phụ đề' : 'Accept Call & Live Captions'}</span>
            </button>

            <button
              type="button"
              onClick={dismissStationCall}
              className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition"
            >
              {isVi ? 'Để sau' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
