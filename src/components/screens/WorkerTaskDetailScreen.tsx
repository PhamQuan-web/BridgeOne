import React, { useState, useEffect, useRef } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { AnAvatar, MinhAvatar, BotanicalCorner } from '../common/BrandGraphics';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Bookmark,
  MessageSquarePlus,
  FileText,
  ExternalLink,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  X,
  Send,
  Lock,
  Mic,
  MicOff,
  Flag,
  RotateCcw,
} from 'lucide-react';

export const WorkerTaskDetailScreen: React.FC = () => {
  const {
    state,
    setScreen,
    playTextToSpeech,
    sendWorkerContribution,
    setGoldenFlowState,
    startSpeechRecording,
    stopSpeechRecording,
  } = useHandoff();

  const { language, t, isVi } = useLanguage();
  const recognitionRef = useRef<any>(null);

  const [showChangesDiff, setShowChangesDiff] = useState(false);
  const [savedForLater, setSavedForLater] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState(
    isVi
      ? 'Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?'
      : 'Can we use Tray B instead of Tray A for high-volume units?'
  );

  const isUpdatedState = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';
  const isClarificationState = state.lifecycleStage === 'worker_sent';

  const fullInstructionText = isVi
    ? (isUpdatedState
        ? 'Đóng gói cụm linh kiện hoàn tất. Bước 1: Kiểm tra bo mạch hoàn chỉnh. Bước 2: Đặt vào Khay B. Bước 3: Dán nhãn Completed. Bước 4: Chuyển Khay B đến kệ trung gian.'
        : 'Đóng gói cụm linh kiện hoàn tất. Bước 1: Kiểm tra bo mạch hoàn chỉnh. Bước 2: Đặt vào Khay A. Bước 3: Dán nhãn Completed. Bước 4: Chuyển Khay A đến kệ trung gian.')
    : (isUpdatedState
        ? 'Pack finished assemblies. Step 1: Check unit is complete. Step 2: Gently place the finished unit in Tray B. Step 3: Attach green Completed label. Step 4: Take Tray B to the staging rack.'
        : 'Pack finished assemblies. Step 1: Check unit is complete. Step 2: Gently place the finished unit in Tray A. Step 3: Attach green Completed label. Step 4: Take Tray A to the staging rack.');

  const quickPrompts = isVi
    ? [
        'Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?',
        'Nếu Khay A đã đầy thì đặt linh kiện vào đâu tiếp theo?',
        'Có cần dán nhãn xanh Completed trước khi chuyển sang kệ không?',
      ]
    : [
        'Can we use Tray B instead of Tray A for high-volume units?',
        'Where do we place finished units if Tray A is already full?',
        'Is the green Completed label required before moving to staging?',
      ];

  // Sync question text default on language change if untouched
  useEffect(() => {
    setQuestionText(
      isVi
        ? 'Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?'
        : 'Can we use Tray B instead of Tray A for high-volume units?'
    );
  }, [language, isVi]);

  // Set up real speech recognition for worker dictation
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = isVi ? 'vi-VN' : 'en-US';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          if (text) {
            setQuestionText(text);
          }
        };

        recognition.onerror = () => {
          stopSpeechRecording();
        };

        recognition.onend = () => {
          stopSpeechRecording();
        };

        recognitionRef.current = recognition;
      } catch {
        // Fallback
      }
    }
  }, [language, isVi]);

  const handleVoiceToggle = () => {
    if (state.isRecordingSpeech) {
      stopSpeechRecording();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    } else {
      startSpeechRecording();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setTimeout(() => {
            setQuestionText(
              isVi
                ? 'Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?'
                : 'Can we use Tray B instead of Tray A for high-volume units?'
            );
            stopSpeechRecording();
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setQuestionText(
            isVi
              ? 'Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?'
              : 'Can we use Tray B instead of Tray A for high-volume units?'
          );
          stopSpeechRecording();
        }, 1500);
      }
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    sendWorkerContribution('Step 2: Place in tray', questionText);
    setIsAskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Integrated Breadcrumb & Task Context Bar */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setScreen('home')}
            className="hover:text-blue-600 flex items-center gap-1.5 font-bold transition text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Trang chủ' : 'Home'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-600">{isVi ? 'Dây chuyền A' : 'Line A'}</span>
          <span>/</span>
          <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            INS-1042
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setGoldenFlowState(1)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-2xs mr-1 cursor-pointer"
            title={isVi ? 'Tái lập lại quy trình ban đầu (Khay A) để quay lại Shot 2 (Phím tắt: Option+1)' : 'Reset to initial flow (Tray A) for demo (Shortcut: Option+1)'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>{isVi ? 'Làm lại Shot 2 (Khay A)' : 'Restart Shot 2'}</span>
          </button>
          <span className="hidden sm:inline">{t('worker_detail.task_paging')}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScreen('home')}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title={isVi ? 'Nhiệm vụ trước' : 'Previous task'}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setScreen('ask_suggest')}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title={isVi ? 'Nhiệm vụ tiếp theo' : 'Next task'}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN (8 cols): Task Title, Steps, and Clarification / Updated Alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title Header Card */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {isUpdatedState ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('worker_detail.badge_verified')}</span>
                  </span>
                  <button
                    onClick={() => setGoldenFlowState(1)}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                    title={isVi ? 'Khôi phục lại Khay A để làm lại quy trình' : 'Reset to Tray A'}
                  >
                    <RotateCcw className="w-3 h-3 text-amber-700" />
                    <span>{isVi ? 'Làm lại quy trình (Khay A)' : 'Reset Flow'}</span>
                  </button>
                </div>
              ) : isClarificationState ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
                  <Flag className="w-4 h-4 text-rose-600" />
                  <span>{t('worker_detail.badge_clarifying')}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">
                  {t('worker_detail.badge_in_progress')}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {t('worker_detail.line')}
              </span>
              <span className="text-xs text-slate-500 font-extrabold">INS-1042</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {t('worker_detail.title')}
              </h1>
              {/* Cursive quote */}
              <div className="flex items-center gap-1 transform rotate-[-2deg]">
                <span className="font-handwriting text-blue-600 text-2xl font-bold">
                  {t('brand.handwritten_quote')}
                </span>
                <div className="text-emerald-500 flex gap-0.5 ml-1">
                  <span className="font-bold text-xs">/</span>
                  <span className="font-bold text-xs">|</span>
                  <span className="font-bold text-xs">\</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {t('worker_detail.desc')}
            </p>

            {/* Meta tags & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-2xs">
                {t('worker_detail.difficulty')}
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-4 h-4 text-slate-400" />
                {t('worker_detail.duration')}
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 shadow-2xs">
                {t('home.standard_work')}
              </span>



              {/* In-Task Ask Button */}
              {!isUpdatedState && (
                <button
                  id="btn-ask-suggest-header"
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                  <span>{t('worker_detail.flag_ask')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Banner: Clarification Submitted (State 2) */}
          {isClarificationState && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-950 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                  🚩
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs text-rose-900 flex items-center gap-2">
                    <span>{isVi ? 'Đã báo cờ: Cần làm rõ' : 'Task Flagged: Needs Clarification'}</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                      {isVi ? 'Đang chờ Quản lý An' : 'Awaiting An (Lead)'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 leading-snug">
                    {isVi ? 'Minh đã hỏi: ' : 'Minh asked: '}&ldquo;{state.activeContribution?.text || questionText}&rdquo;
                  </p>
                </div>
              </div>
              <button
                id="btn-view-clarification-thread"
                onClick={() => setScreen('messages')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                title={isVi ? 'Xem tiến trình phản hồi trong hộp thư' : 'View clarification in messages'}
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-white" />
                <span>{isVi ? 'Xem hộp thư' : 'View Messages'}</span>
              </button>
            </div>
          )}

          {/* Steps List Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">{t('worker_detail.steps_heading')}</h2>
              {isUpdatedState && (
                <button
                  onClick={() => setShowChangesDiff(!showChangesDiff)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                >
                  <span>{t('worker_detail.view_changes')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showChangesDiff ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Changes Diff Banner if toggled */}
            {showChangesDiff && isUpdatedState && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isVi ? 'Chi tiết thay đổi phiên bản (Cập nhật bởi An lúc 10:14 AM)' : 'Version Change Details (Updated by An · 10:14 AM)'}</span>
                </div>
                <p className="text-emerald-900">
                  • {t('worker_detail.diff_step2')}
                </p>
                <p className="text-emerald-900">
                  • {t('worker_detail.diff_step4')}
                </p>
              </div>
            )}

            {/* 4 Steps */}
            <div className="space-y-4">
              {/* Step 1: Check unit is complete */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50/70 border border-transparent hover:border-slate-200 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      {t('worker_detail.step1_title')}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step1_desc')}
                    </p>
                  </div>
                </div>
                {/* Photo Thumbnail */}
                <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="inspect-unit" className="w-full h-full" />
                </div>
              </div>

              {/* Step 2: Place in tray (DYNAMIC: State 1 vs State 2 vs State 3) */}
              {isUpdatedState ? (
                /* STATE 3: Updated with Green Highlight Border & Accountability Provenance Stamp */
                <div
                  id="step-2-container-updated"
                  className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 shadow-xs transition-all duration-300"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          {t('worker_detail.step2_title')}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isVi ? 'Đã cập nhật' : 'Updated'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {t('worker_detail.step2_desc_b')}
                      </p>
                      {/* CRITICAL ACCOUNTABILITY STAMP */}
                      <div
                        id="provenance-stamp-step-2"
                        className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1 border-t border-emerald-200/80 mt-1"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t('worker_detail.step2_stamp')}</span>
                      </div>
                    </div>
                  </div>
                  {/* Photo: Tray B (Blue Tote) */}
                  <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border-2 border-emerald-400 shadow-2xs">
                    <RealisticPhoto type="tray-b" className="w-full h-full" />
                  </div>
                </div>
              ) : isClarificationState ? (
                /* STATE 2: Needs Clarification (Flagged at Step) */
                <div
                  id="step-2-container-clarification"
                  className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl border-2 border-dashed border-rose-300 bg-rose-50/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          {t('worker_detail.step2_title')}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <Flag className="w-3 h-3 text-rose-600" />
                          <span>{isVi ? 'Cần làm rõ' : 'Needs clarification'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {t('worker_detail.step2_desc_a')}
                      </p>
                      <div className="text-[11px] text-rose-700 bg-rose-100/70 p-2 rounded-lg border border-rose-200 space-y-0.5">
                        <span className="font-bold block">{isVi ? 'Câu hỏi của Minh:' : "Minh's Question:"}</span>
                        <span>&ldquo;{state.activeContribution?.text || questionText}&rdquo;</span>
                      </div>
                    </div>
                  </div>
                  {/* Photo: Tray A (Red Crate Overflowing / Full) */}
                  <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-rose-300 shadow-2xs">
                    <RealisticPhoto type="tray-a" className="w-full h-full" />
                  </div>
                </div>
              ) : (
                /* STATE 1: Initial Standard (Tray A - Bottle-necked / Full) */
                <div
                  id="step-2-container-initial"
                  className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                      2
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          {t('worker_detail.step2_title')}
                        </h3>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">
                          {isVi ? 'Quy trình chuẩn (Khay A)' : 'Standard Work (Tray A)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {t('worker_detail.step2_desc_a')}
                      </p>
                      {/* Bottleneck Callout with Direct In-Task Action */}
                      <div className="pt-1">
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{t('worker_detail.step2_bottleneck')}</span>
                          </span>
                          <button
                            id="btn-ask-at-step-2"
                            onClick={() => setIsAskModalOpen(true)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition shrink-0"
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5" />
                            <span>{t('worker_detail.step2_ask_btn')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Photo: Tray A (Full stack / Overflowing) */}
                  <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                    <RealisticPhoto type="tray-a" className="w-full h-full" />
                  </div>
                </div>
              )}

              {/* Step 3: Add label */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50/70 border border-transparent hover:border-slate-200 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      {t('worker_detail.step3_title')}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step3_desc')}
                    </p>
                  </div>
                </div>
                {/* Photo Thumbnail with green Completed label */}
                <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="completed-label" className="w-full h-full" />
                </div>
              </div>

              {/* Step 4: Move to next stage */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50/70 border border-transparent hover:border-slate-200 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      {t('worker_detail.step4_title')}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step4_desc')}
                    </p>
                  </div>
                </div>
                {/* Photo Thumbnail with staging rack */}
                <div className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="staging-rack" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Alert Card: Instruction Updated Alert (State 3 Only) */}
          {isUpdatedState && (
            <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-5 space-y-4 shadow-2xs animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    {t('worker_detail.updated_banner_title')}
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {t('worker_detail.updated_banner_desc')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  id="task-detail-ask-another-btn"
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>{t('worker_detail.ask_another')}</span>
                </button>
                <button
                  id="task-detail-view-sop-btn"
                  onClick={() => setScreen('published')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('worker_detail.view_sop')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (4 cols): Facilitator Reply & Question History */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Facilitator Reply (In State 3) */}
          {isUpdatedState ? (
            <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>{t('worker_detail.lead_reply_title')}</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <AnAvatar size="w-9 h-9" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">An</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        {t('persona.lead_title')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{isVi ? 'Hôm nay lúc 10:14 AM' : 'Today at 10:14 AM'}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/50 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed border border-emerald-100">
                  {isVi
                    ? 'Câu hỏi của Minh rất hay! Đúng vậy, các kiện hàng nên chuyển sang '
                    : 'Great question, Minh! You’re right — the units should go to '}
                  <strong className="text-emerald-800 font-extrabold underline">
                    {isVi ? 'Khay B' : 'Tray B'}
                  </strong>
                  {isVi ? '. Quản lý đã cập nhật chỉ dẫn.' : ". I've updated the instruction."}
                </div>
              </div>
            </div>
          ) : isClarificationState ? (
            /* Card 1 for State 2: Waiting for An's review */
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <Flag className="w-4 h-4 text-rose-600" />
                <span>{t('worker_detail.waiting_lead_title')}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('worker_detail.waiting_lead_desc')}
              </p>
              <button
                onClick={() => setGoldenFlowState(3)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>{t('worker_detail.simulate_approval')}</span>
              </button>
            </div>
          ) : (
            /* Card 1 for State 1: In-Task Clarification CTA */
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                <span>{t('worker_detail.in_task_clarify_title')}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('worker_detail.in_task_clarify_desc')}
              </p>
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{t('worker_detail.step2_ask_btn')}</span>
              </button>
            </div>
          )}

          {/* Card 2: Your question (Visible in State 2 & State 3) */}
          {(isUpdatedState || isClarificationState) && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <MinhAvatar size="w-7 h-7" name="M" />
                <div>
                  <span className="font-extrabold text-xs text-slate-900">{t('worker_detail.your_question')}</span>
                  <span className="text-[11px] text-slate-400 block">{isVi ? 'Hôm nay lúc 10:02 AM' : 'Today at 10:02 AM'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {state.activeContribution?.text || questionText}
              </p>
            </div>
          )}

          {/* Card 3: Current instruction & View final */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{t('worker_detail.standard_doc_title')}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <span>{t('worker_detail.standard_doc_sub')}</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="btn-view-final-instruction"
                onClick={() => setScreen('published')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{t('worker_detail.view_sop')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSavedForLater(!savedForLater)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                  savedForLater
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedForLater ? t('worker_detail.saved_later') : t('worker_detail.save_later')}</span>
              </button>
            </div>
          </div>

          {/* Botanical Illustration in bottom right */}
          <BotanicalCorner phrase={isVi ? 'Hòa nhập hơn. Tương lai sáng hơn.' : 'More inclusion. Brighter tomorrows.'} />
        </div>
      </div>

      {/* 3. IN-TASK MODAL: [Ask or suggest] (TRẠNG THÁI 2) */}
      {isAskModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-ask-suggest-title"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="modal-ask-suggest-title" className="font-extrabold text-sm text-slate-950">
                    {t('worker_detail.modal_title')}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {t('worker_detail.modal_sub')}
                  </p>
                </div>
              </div>
              <button
                id="btn-close-ask-modal"
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
                title={t('worker_detail.cancel')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {isVi
                  ? 'Có thắc mắc về sức chứa Khay A hoặc thao tác linh kiện? Chọn câu gợi ý nhanh hoặc tự nhập câu hỏi:'
                  : 'Have a question about Tray A capacity or parts handling? Choose a quick prompt or type your question:'}
              </p>

              {/* Quick Prompts List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {t('worker_detail.quick_prompts_title')}
                </span>
                <div className="space-y-1.5">
                  {quickPrompts.map((prompt, idx) => {
                    const isSelected = questionText === prompt;
                    const isPrimary = prompt.includes('Khay B') || prompt.includes('Tray B');
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestionText(prompt)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs transition leading-snug flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-2xs'
                            : isPrimary
                            ? 'bg-amber-50/60 border-amber-300 hover:bg-amber-50 text-slate-800 font-medium'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{prompt}</span>
                        {isPrimary && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 shrink-0">
                            {isVi ? 'Khuyên dùng' : 'Recommended'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input Area with Voice Dictation */}
              <form onSubmit={handleSendQuestion} className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="worker-question-input" className="text-xs font-bold text-slate-800">
                      {isVi ? 'Nội dung câu hỏi gửi Quản lý An' : 'Your question to Lead An'}
                    </label>
                  </div>
                  <textarea
                    id="worker-question-input"
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder={isVi ? 'Nhập nội dung câu hỏi hoặc mô tả vướng mắc...' : 'Type your question or clarification request...'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isVi ? 'Tự động lưu vết bảo vệ công nhân' : 'Immutable audit trail active'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAskModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                    >
                      {t('worker_detail.cancel')}
                    </button>
                    <button
                      id="btn-submit-worker-question"
                      type="submit"
                      disabled={!questionText.trim()}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <span>{t('worker_detail.send_question')}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
