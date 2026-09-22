import React, { useState, useEffect } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Camera,
  Vibrate,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

export const BlindCornerAlertModal: React.FC = () => {
  const { state, dismissSafetyAlert } = useHandoff();
  const [countdown, setCountdown] = useState<number>(3.0);
  const [isDismissedSafe, setIsDismissedSafe] = useState(false);

  useEffect(() => {
    if (!state.isSafetyAlertActive) {
      setCountdown(3.0);
      setIsDismissedSafe(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.2) {
          clearInterval(timer);
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [state.isSafetyAlertActive]);

  if (!state.isSafetyAlertActive || !state.safetyAlertDetails) {
    return null;
  }

  const { direction, hazardType, location, timestamp } = state.safetyAlertDetails;

  const handleConfirmSafe = () => {
    setIsDismissedSafe(true);
    setTimeout(() => {
      dismissSafetyAlert();
    }, 600);
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="blind-corner-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-rose-500 overflow-hidden ring-8 ring-rose-500/30 animate-pulse">
        {/* Top Emergency Strobe Banner */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-white/20 text-white animate-spin duration-700">
              <Radio className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200">
                MODULE 2 · CẢNH BÁO AN TOÀN PHI ÂM THANH
              </span>
              <h2 id="blind-corner-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>PHÁT HIỆN VẬT CẢN GÓC MÙ</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-rose-700">
                  CÒN {countdown.toFixed(1)}s
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissSafetyAlert}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition"
            title="Tắt cảnh báo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* DIRECTIONAL CUE (Crucial requirement from test plan & interview) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-rose-600/40 shrink-0 animate-bounce">
                {direction === 'RIGHT' ? (
                  <ArrowRight className="w-10 h-10" />
                ) : direction === 'LEFT' ? (
                  <ArrowLeft className="w-10 h-10" />
                ) : (
                  <ArrowDown className="w-10 h-10" />
                )}
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider block">
                  HƯỚNG TIẾP CẬN NGUY HIỂM
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-rose-900 tracking-tight">
                  {direction === 'RIGHT'
                    ? 'TIẾP CẬN TỪ BÊN PHẢI ➡️'
                    : direction === 'LEFT'
                    ? 'TIẾP CẬN TỪ BÊN TRÁI ⬅️'
                    : 'TIẾP CẬN TỪ PHÍA SAU LƯNG ⬇️'}
                </h3>
                <p className="text-xs text-rose-800 font-semibold">
                  Đối tượng: <strong className="font-extrabold">{hazardType === 'forklift' ? 'Xe nâng hàng' : 'Xe đẩy hàng chuyển phôi'}</strong>
                </p>
              </div>
            </div>

            {/* Haptic Alert Badge */}
            <div className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-center shrink-0 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-rose-700 font-extrabold text-xs">
                <Vibrate className="w-4 h-4 animate-ping" />
                <span>RUNG HAPTIC</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Báo rung điện thoại</span>
            </div>
          </div>

          {/* Camera mini-feed preview & Lead time bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Camera feed simulation */}
            <div className="sm:col-span-6 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative aspect-video flex items-center justify-center shadow-md">
              {/* Simulated camera grid & label */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>CAM-BC02 · Chuyền A</span>
              </div>
              <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono">
                {timestamp}
              </div>

              {/* Bounding box simulation over approaching hazard */}
              <div className="border-2 border-dashed border-rose-400 p-2 rounded-lg bg-rose-500/20 text-center space-y-1">
                <Camera className="w-6 h-6 text-rose-300 mx-auto" />
                <span className="text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded block">
                  {hazardType === 'forklift' ? 'Forklift Approaching' : 'Trolley 94%'}
                </span>
                <span className="text-[9px] font-mono text-rose-200">Khoảng cách: ~ 3.5m</span>
              </div>

              <div className="absolute bottom-2 left-2 text-[9px] text-slate-400">
                Phát hiện không nhận diện khuôn mặt (Bảo mật riêng tư)
              </div>
            </div>

            {/* Safety metrics & Lead time info */}
            <div className="sm:col-span-6 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thời gian phản xạ an toàn:</span>
                  </span>
                  <span className="font-mono text-rose-600 font-extrabold">{countdown.toFixed(1)}s / 3.0s</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 transition-all duration-100 ease-linear"
                    style={{ width: `${(countdown / 3.0) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Vị trí: {location}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Hệ thống hỗ trợ thị giác phi âm thanh, thay thế cho áo vest cồng kềnh. Thông báo trực tiếp qua điện thoại công nhân.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-confirm-safe-action"
              type="button"
              onClick={handleConfirmSafe}
              className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isDismissedSafe ? 'ĐÃ GHI NHẬN AN TOÀN!' : 'XÁC NHẬN: ĐÃ NÉ TRÁNH AN TOÀN'}</span>
            </button>

            <button
              type="button"
              onClick={dismissSafetyAlert}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition"
            >
              Đóng cảnh báo
            </button>
          </div>

          {/* Universal Design Compliance Note */}
          <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-2 pt-1 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chuẩn Nguyên tắc 4: Thông tin dễ cảm nhận · Nguyên tắc 5: An toàn trước sự cố</span>
          </div>
        </div>
      </div>
    </div>
  );
};
