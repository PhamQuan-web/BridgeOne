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

  const { language, t } = useLanguage();
  const recognitionRef = useRef<any>(null);

  const [showChangesDiff, setShowChangesDiff] = useState(false);
  const [savedForLater, setSavedForLater] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Can we use Tray B instead of Tray A for high-volume units?'
  );

  const isUpdatedState = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';
  const isClarificationState = state.lifecycleStage === 'worker_sent';

  const fullInstructionText = isUpdatedState
    ? "Pack finished assemblies. Step 1: Check unit is complete. Step 2: Gently place the finished unit in Tray B. Step 3: Attach green Completed label. Step 4: Take Tray B to the staging rack."
    : "Pack finished assemblies. Step 1: Check unit is complete. Step 2: Gently place the finished unit in Tray A. Step 3: Attach green Completed label. Step 4: Take Tray A to the staging rack.";

  const quickPrompts = [
    'Can we use Tray B instead of Tray A for high-volume units?',
    'Where do we place finished units if Tray A is already full?',
    'Is the green Completed label required before moving to staging?',
  ];

  // Set up real speech recognition for worker dictation
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'vi' ? 'vi-VN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'zh' ? 'zh-CN' : 'en-US';

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
  }, [language]);

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
          // If unsupported or blocked, provide graceful input
          setTimeout(() => {
            setQuestionText('Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?');
            stopSpeechRecording();
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setQuestionText('Có thể đổi sang Khay B thay vì Khay A cho các kiện hàng lớn không?');
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
      {/* 1. Top Navigation Bar: Back & Task Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition px-3 py-1.5 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('worker_detail.back', '← Quay lại danh sách nhiệm vụ')}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">Nhiệm vụ 3 / 8</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setScreen('home')}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title="Previous task"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScreen('ask_suggest')}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title="Next task"
            >
              <ChevronRight className="w-4 h-4" />
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
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ĐÃ XÁC MINH (KHAY B)</span>
                </span>
              ) : isClarificationState ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
                  <Flag className="w-4 h-4 text-rose-600" />
                  <span>CẦN LÀM RÕ (CHỜ DUYỆT)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">
                  ĐANG THỰC HIỆN
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Dây chuyền A
              </span>
              <span className="text-xs text-slate-500 font-extrabold">INS-1042</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Đóng gói cụm linh kiện hoàn tất (SOP)
              </h1>
              {/* Cursive quote */}
              <div className="flex items-center gap-1 transform rotate-[-2deg]">
                <span className="font-handwriting text-blue-600 text-2xl font-bold">
                  Questions make work better.
                </span>
                <div className="text-emerald-500 flex gap-0.5 ml-1">
                  <span className="font-bold text-xs">/</span>
                  <span className="font-bold text-xs">|</span>
                  <span className="font-bold text-xs">\</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Đóng gói an toàn các cụm linh kiện hoàn thiện vào đúng khay quy định để đưa sang kệ đệm tiếp theo.
            </p>

            {/* Meta tags & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm text-slate-600">
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-2xs">
                Độ khó: Vừa phải
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-4 h-4 text-slate-400" />
                ~ 5 phút
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 shadow-2xs">
                Quy trình chuẩn
              </span>

              {/* TTS Read Aloud */}
              <button
                id="btn-tts-read-aloud"
                onClick={() => playTextToSpeech(fullInstructionText)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-2xs border ${
                  state.ttsPlaying
                    ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-blue-700 border-blue-200'
                }`}
                title="Đọc to hướng dẫn từng bước ra loa (TTS)"
              >
                {state.ttsPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Dừng giọng đọc</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Đọc to hướng dẫn (TTS)</span>
                  </>
                )}
              </button>

              {/* In-Task Ask Button */}
              {!isUpdatedState && (
                <button
                  id="btn-ask-suggest-header"
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                  <span>Báo cờ đỏ / Hỏi quản lý</span>
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
                    <span>Task Flagged: Needs Clarification</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                      Awaiting An (Lead)
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 leading-snug">
                    Minh asked: &ldquo;{state.activeContribution?.text || 'Can we use Tray B instead of Tray A for high-volume units?'}&rdquo;
                  </p>
                </div>
              </div>
              <button
                id="btn-view-clarification-thread"
                onClick={() => setScreen('messages')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                title="Xem tiến trình phản hồi trong hộp thư"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-white" />
                <span>Xem hộp thư</span>
              </button>
            </div>
          )}

          {/* Steps List Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Steps</h2>
              {isUpdatedState && (
                <button
                  onClick={() => setShowChangesDiff(!showChangesDiff)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                >
                  <span>View changes</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showChangesDiff ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Changes Diff Banner if toggled */}
            {showChangesDiff && isUpdatedState && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Version Change Details (Updated by An · 10:14 AM)</span>
                </div>
                <p className="text-emerald-900">
                  • Step 2 Destination changed from <del className="text-emerald-600 font-semibold">Tray A</del> to <strong className="font-bold underline text-emerald-800">Tray B</strong>.
                </p>
                <p className="text-emerald-900">
                  • Step 4 Staging destination updated to <strong className="font-bold text-emerald-800">Tray B</strong>. Clearer photos added.
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
                      Check unit is complete
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Make sure all components are securely attached and no parts are loose.
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
                          Place in tray
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Updated</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        Gently place the finished unit in <strong className="text-emerald-800 font-extrabold underline">Tray B</strong>.
                      </p>
                      {/* CRITICAL ACCOUNTABILITY STAMP */}
                      <div
                        id="provenance-stamp-step-2"
                        className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1 border-t border-emerald-200/80 mt-1"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>✔ Verified by An (Lead) · Provenance: Worker Question Handoff</span>
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
                          Place in tray
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <Flag className="w-3 h-3 text-rose-600" />
                          <span>Needs clarification</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        Gently place the finished unit in <strong className="text-slate-900 font-bold">Tray A</strong>.
                      </p>
                      <div className="text-[11px] text-rose-700 bg-rose-100/70 p-2 rounded-lg border border-rose-200 space-y-0.5">
                        <span className="font-bold block">Minh&apos;s Question:</span>
                        <span>&ldquo;Can we use Tray B instead of Tray A for high-volume units?&rdquo;</span>
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
                          Place in tray
                        </h3>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">
                          Standard Work (Tray A)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Gently place the finished unit in <strong className="text-slate-950 font-extrabold">Tray A</strong>.
                      </p>
                      {/* Bottleneck Callout with Direct In-Task Action */}
                      <div className="pt-1">
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Khay A đã đầy? Có thắc mắc tại bước này?</span>
                          </span>
                          <button
                            id="btn-ask-at-step-2"
                            onClick={() => setIsAskModalOpen(true)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition shrink-0"
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5" />
                            <span>Ask or suggest</span>
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
                      Add label
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Attach a green &ldquo;Completed&rdquo; label to the top of the unit.
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
                      Move to next stage
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Take {isUpdatedState ? (
                        <strong className="text-emerald-800 font-bold underline">Tray B</strong>
                      ) : (
                        <strong className="text-slate-800 font-bold">Tray A</strong>
                      )} to the staging rack.
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
                    This instruction has been updated based on your question.
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Changes are highlighted in green. You can still ask another question or view the published standard work.
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
                  <span>Ask another question</span>
                </button>
                <button
                  id="task-detail-view-sop-btn"
                  onClick={() => setScreen('published')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>View published standard work</span>
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
                <span>Facilitator reply</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <AnAvatar size="w-9 h-9" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">An</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        Team lead
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Today at 10:14 AM</span>
                  </div>
                </div>

                <div className="bg-emerald-50/50 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed border border-emerald-100">
                  Great question, Minh! You&apos;re right — the units should go to{' '}
                  <strong className="text-emerald-800 font-extrabold underline">Tray B</strong>. I&apos;ve updated the instruction.
                </div>
              </div>
            </div>
          ) : isClarificationState ? (
            /* Card 1 for State 2: Waiting for An's review */
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <Flag className="w-4 h-4 text-rose-600" />
                <span>Waiting for An&apos;s review</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your question was sent to An (Team lead). As soon as An confirms, Step 2 will update automatically.
              </p>
              <button
                onClick={() => setGoldenFlowState(3)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Simulate An&apos;s Approval</span>
              </button>
            </div>
          ) : (
            /* Card 1 for State 1: In-Task Clarification CTA */
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                <span>In-Task Clarification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice an issue or capacity bottleneck on Assembly Line A? Ask An directly without stopping the whole team.
              </p>
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Ask or suggest</span>
              </button>
            </div>
          )}

          {/* Card 2: Your question (Visible in State 2 & State 3) */}
          {(isUpdatedState || isClarificationState) && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <MinhAvatar size="w-7 h-7" name="M" />
                <div>
                  <span className="font-extrabold text-xs text-slate-900">Your question (Minh)</span>
                  <span className="text-[11px] text-slate-400 block">Today at 10:02 AM</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {state.activeContribution?.text || 'Can we use Tray B instead of Tray A for high-volume units?'}
              </p>
            </div>
          )}

          {/* Card 3: Current instruction & View final */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Standard Work Document</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <span>Assembly Line A · Document INS-1042</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="btn-view-final-instruction"
                onClick={() => setScreen('published')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>View published SOP</span>
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
                <span>{savedForLater ? 'Saved in bookmarks' : 'Save for later'}</span>
              </button>
            </div>
          </div>

          {/* Botanical Hill Illustration in bottom right */}
          <BotanicalCorner phrase="More inclusion. Brighter tomorrows." />
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
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="modal-ask-suggest-title" className="font-extrabold text-sm text-slate-950">
                    Ask or suggest · Step 2: Place in tray
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Task INS-1042 · Direct to An (Team lead)
                  </p>
                </div>
              </div>
              <button
                id="btn-close-ask-modal"
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
                title="Close modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Have a question about Tray A capacity or parts handling? Choose a quick prompt or type your question:
              </p>

              {/* Quick Prompts List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Quick Prompts (Click to use)
                </span>
                <div className="space-y-1.5">
                  {quickPrompts.map((prompt, idx) => {
                    const isSelected = questionText === prompt;
                    const isPrimary = prompt.includes('Tray B instead of Tray A');
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
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>&ldquo;{prompt}&rdquo;</span>
                        {isPrimary && (
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                            Recommended
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input with Dictation */}
              <form onSubmit={handleSendQuestion} className="space-y-3">
                <div className="relative">
                  <textarea
                    id="ask-modal-textarea"
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Type your question or clarification..."
                    className="w-full rounded-2xl border border-slate-200 p-3 pb-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none leading-relaxed"
                  />

                  {/* Textarea Bottom Tools */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-semibold transition ${
                        state.isRecordingSpeech
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Dictate with microphone"
                    >
                      {state.isRecordingSpeech ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Listening...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dictate</span>
                        </>
                      )}
                    </button>
                    <span className="text-slate-400 font-medium">
                      {questionText.length} / 300
                    </span>
                  </div>
                </div>

                {/* Privacy Lock Banner */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-900 leading-snug">
                    Private to An (Team lead) · Task status will show <strong>Needs clarification</strong> so everyone stays aligned.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-send-to-facilitator-modal"
                    type="submit"
                    disabled={!questionText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <span>Send to facilitator</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
