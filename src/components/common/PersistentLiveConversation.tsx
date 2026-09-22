import React, { useState, useEffect, useRef } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  ChevronUp,
  ChevronDown,
  X,
  AlertTriangle,
  Radio,
  Eye,
  Activity,
  Smile,
  Check,
  Plus,
  Trash2,
  BookMarked,
  ShieldAlert,
  Headphones,
  Settings,
  PhoneCall,
} from 'lucide-react';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';

const EMOJI_OPTIONS = ['💬', '📦', '⚠️', '⚙️', '🙋', '🚻', '🔄', '🛑', '👍', '✅', '🔧'];

export interface PersistentLiveConversationProps {
  isSidebarMode?: boolean;
  onClose?: () => void;
}

export const PersistentLiveConversation: React.FC<PersistentLiveConversationProps> = ({
  isSidebarMode = false,
  onClose,
}) => {
  const {
    state,
    setScreen,
    toggleLiveMic,
    sendLiveMessage,
    summarizeLiveConversation,
    addCustomQuickOption,
    removeCustomQuickOption,
    triggerSafetyAlert,
    triggerStationCall,
  } = useHandoff();
  const { language, t, isVi } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(isSidebarMode);
  const [showInlineSummary, setShowInlineSummary] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [summaryData, setSummaryData] = useState<{
    summary: string;
    actionItems: string[];
    safetyAlert: string;
  } | null>(null);

  // Prepared Responses Studio (Sổ tay câu thoại chuẩn bị trước)
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [isAddingOption, setIsAddingOption] = useState<boolean>(false);
  const [newOptIcon, setNewOptIcon] = useState<string>('💬');
  const [newOptLabel, setNewOptLabel] = useState<string>('');
  const [newOptMessage, setNewOptMessage] = useState<string>('');
  const [newOptSpeech, setNewOptSpeech] = useState<string>('');

  // Keep expanded in sidebar mode
  useEffect(() => {
    if (isSidebarMode) {
      setIsExpanded(true);
    }
  }, [isSidebarMode]);

  // Helper to translate default quick options dynamically with language
  const getLocalizedQuickOption = (opt: any) => {
    if (!opt.isDefault) return opt;
    switch (opt.id) {
      case 'qo-1':
        return {
          ...opt,
          label: t('canned.completed_label'),
          messageText: t('canned.completed_msg'),
          speechText: t('canned.completed_speech'),
        };
      case 'qo-2':
        return {
          ...opt,
          label: t('canned.help_label'),
          messageText: t('canned.help_msg'),
          speechText: t('canned.help_speech'),
        };
      case 'qo-3':
        return {
          ...opt,
          label: t('canned.tray_full_label'),
          messageText: t('canned.tray_full_msg'),
          speechText: t('canned.tray_full_speech'),
        };
      case 'qo-4':
        return {
          ...opt,
          label: t('canned.repeat_label'),
          messageText: t('canned.repeat_msg'),
          speechText: t('canned.repeat_speech'),
        };
      case 'qo-5':
        return {
          ...opt,
          label: t('canned.defect_label'),
          messageText: t('canned.defect_msg'),
          speechText: t('canned.defect_speech'),
        };
      case 'qo-6':
        return {
          ...opt,
          label: t('canned.step_away_label'),
          messageText: t('canned.step_away_msg'),
          speechText: t('canned.step_away_speech'),
        };
      default:
        return opt;
    }
  };

  const getLocalizedTranscriptText = (item: any) => {
    if (item.id === 'tx-1' && !isVi) {
      return 'Morning team! Today pay close attention to the circuit assembly placement and verify tray codes carefully.';
    }
    return item.text;
  };

  // Real-time Audio Level & Web Speech STT
  const [audioLevel, setAudioLevel] = useState<number>(0); // 0 to 100
  const [noiseStatus, setNoiseStatus] = useState<'quiet' | 'speaking' | 'loud'>('quiet');
  const [speechActive, setSpeechActive] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [captionScale, setCaptionScale] = useState<'normal' | 'large' | 'huge'>('large');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const latestMessage = state.liveTranscriptLog[state.liveTranscriptLog.length - 1];
  const isLeader = state.activePersona === 'facilitator';

  const getSpeechLang = () => {
    switch (language) {
      case 'vi':
        return 'vi-VN';
      case 'en':
      default:
        return 'en-US';
    }
  };

  // Real Web Audio API - Noise Level & Volume Monitor
  const startAudioMeter = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 60) * 100));
        setAudioLevel(normalized);

        if (normalized < 15) {
          setNoiseStatus('quiet');
        } else if (normalized < 55) {
          setNoiseStatus('speaking');
        } else {
          setNoiseStatus('loud');
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      simulateAmbientLevel();
    }
  };

  const simulateAmbientLevel = () => {
    let mockVol = 20;
    const interval = setInterval(() => {
      if (!state.isLiveMicActive) {
        clearInterval(interval);
        setAudioLevel(0);
        setNoiseStatus('quiet');
        return;
      }
      mockVol = Math.floor(25 + Math.random() * 45);
      setAudioLevel(mockVol);
      if (mockVol < 30) setNoiseStatus('quiet');
      else if (mockVol < 55) setNoiseStatus('speaking');
      else setNoiseStatus('loud');
    }, 400);
  };

  const stopAudioMeter = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setNoiseStatus('quiet');
  };

  // Real Web Speech API STT listener
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSpeechLang();

        let speechPauseTimer: any = null;

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              if (transcript.trim()) {
                const sender = isLeader ? 'An' : 'Minh';
                sendLiveMessage(transcript.trim(), sender);
                setInterimText('');
                if (speechPauseTimer) clearTimeout(speechPauseTimer);
              }
            } else {
              currentInterim += transcript;
            }
          }
          if (currentInterim) {
            setInterimText(currentInterim);
            // Teams-style auto sentence break: push row-by-row on natural 1.4s pause
            if (speechPauseTimer) clearTimeout(speechPauseTimer);
            speechPauseTimer = setTimeout(() => {
              if (currentInterim.trim().length > 6) {
                const sender = isLeader ? 'An' : 'Minh';
                sendLiveMessage(currentInterim.trim(), sender);
                setInterimText('');
              }
            }, 1400);
          }
        };

        recognition.onerror = () => {
          setSpeechActive(false);
        };

        recognition.onend = () => {
          if (state.isLiveMicActive) {
            try {
              recognition.start();
            } catch {
              setSpeechActive(false);
            }
          } else {
            setSpeechActive(false);
          }
        };

        recognitionRef.current = recognition;
      } catch {
        // Fallback
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopAudioMeter();
    };
  }, [language, state.activePersona]);

  // Sync mic state with real speech recognition and audio volume meter
  useEffect(() => {
    if (state.isLiveMicActive) {
      startAudioMeter();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setSpeechActive(true);
        } catch {}
      }
    } else {
      stopAudioMeter();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setSpeechActive(false);
          setInterimText('');
        } catch {}
      }
    }
  }, [state.isLiveMicActive]);

  useEffect(() => {
    if (isExpanded || isSidebarMode) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.liveTranscriptLog, isExpanded, interimText, isSidebarMode]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const sender = isLeader ? 'An' : 'Minh';
    sendLiveMessage(inputText, sender);
    setInputText('');
  };

  const handleOpenSummary = () => {
    if (showInlineSummary && isExpanded) {
      setShowInlineSummary(false);
      return;
    }
    const summary = summarizeLiveConversation();
    setSummaryData(summary);
    setShowInlineSummary(true);
    setIsExpanded(true);
  };

  const handleSpeakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getSpeechLang();
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  const handleTriggerQuickOption = (option: { messageText: string; speechText?: string }) => {
    const sender = isLeader ? 'An' : 'Minh';
    sendLiveMessage(option.messageText, sender);
  };

  const handleSaveNewQuickOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptLabel.trim() || !newOptMessage.trim()) return;
    addCustomQuickOption({
      icon: newOptIcon,
      label: newOptLabel.trim(),
      messageText: newOptMessage.trim(),
      speechText: (newOptSpeech || newOptMessage).trim(),
    });
    setNewOptLabel('');
    setNewOptMessage('');
    setNewOptSpeech('');
    setIsAddingOption(false);
  };

  const handleToggleLiveMic = () => {
    if (state.isLiveMicActive && interimText.trim()) {
      const sender = isLeader ? 'An' : 'Minh';
      sendLiveMessage(interimText.trim(), sender);
      setInterimText('');
    }
    toggleLiveMic();
  };

  // ==========================================
  // SIDEBAR MODE (3-Column layout, Teams style)
  // ==========================================
  if (isSidebarMode) {
    const hasWorkerInquiry =
      isLeader &&
      (state.lifecycleStage === 'worker_sent' ||
        (state.workerQuestion && !state.isDestinationUpdated));

    return (
      <div className="h-full flex flex-col min-h-0 bg-white select-none overflow-hidden text-slate-900 border-l border-slate-200/90 shadow-xs">
        {/* TOP BAR: Clean, Dedicated Teams-like Header */}
        <div className="px-3.5 py-3 flex items-center justify-between border-b border-slate-200/90 bg-slate-50/90 shrink-0">
          {/* Left: Channel indicator & noise meter */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="relative shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs"
              title={state.isLiveMicActive ? t('live.stt_listening') : t('live.title')}
            >
              <span className="flex h-2 w-2 relative">
                {state.isLiveMicActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    state.isLiveMicActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </span>
              <span className="text-[11px] font-extrabold text-slate-800 tracking-tight truncate">
                {state.isLiveMicActive ? t('live.stt_listening') : t('header.live_channel', 'Kênh Trực Tiếp')}
              </span>
            </div>

            {/* Sound Level Visualizer */}
            {state.isLiveMicActive && (
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold transition border ${
                  noiseStatus === 'loud'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : noiseStatus === 'speaking'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
                title={`Âm lượng xưởng: ${audioLevel}%`}
              >
                <Activity className="w-2.5 h-2.5 shrink-0" />
                <span className="font-mono">{audioLevel}%</span>
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Quick Test Blind-Corner Alert */}
            <button
              type="button"
              onClick={() => triggerSafetyAlert('RIGHT', 'trolley')}
              className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              title={t('safety.test_btn')}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            </button>

            {/* Font Scale (Aa) */}
            <button
              type="button"
              onClick={() => {
                setCaptionScale((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal'));
              }}
              className="px-1.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
              title={t('live.font_scale_title')}
            >
              <span className={captionScale === 'huge' ? 'text-blue-600 font-black' : captionScale === 'large' ? 'text-blue-600 font-bold' : ''}>
                Aa{captionScale === 'huge' ? '++' : captionScale === 'large' ? '+' : ''}
              </span>
            </button>

            {/* AI Shift Catch-up */}
            <button
              type="button"
              id="btn-ai-catchup-summary"
              onClick={handleOpenSummary}
              className={`p-1.5 rounded-lg transition border ${
                showInlineSummary
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
              title={t('live.catchup_title')}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            {/* Mic Toggle */}
            <button
              type="button"
              id="btn-toggle-live-mic"
              onClick={handleToggleLiveMic}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                state.isLiveMicActive
                  ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={state.isLiveMicActive ? t('live.mic_off') : t('live.mic_on')}
            >
              {state.isLiveMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>

            {/* Close Sidebar button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Đóng thanh bên (Thu gọn)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* WORKER REQUEST HIGHLIGHT BANNER FOR LEADER */}
        {hasWorkerInquiry && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 animate-in slide-in-from-top-2 duration-200 shrink-0">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-base shrink-0 font-bold shadow-2xs">
                🔔
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-950">
                    {isVi ? 'Yêu cầu từ Minh (Trạm 04)' : 'Worker Request from Minh'}
                  </span>
                  <span className="text-[9px] font-bold text-amber-800 bg-white px-1.5 py-0.2 rounded-full border border-amber-300">
                    {isVi ? 'Cần duyệt' : 'Action Needed'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">
                  &ldquo;{state.workerQuestion || (isVi ? 'Khay A đã đầy, xin chỉ đạo đổi sang Khay B!' : 'Tray A full, swap to Tray B?')}&rdquo;
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScreen('facilitator')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs flex items-center gap-1"
                  >
                    <span>{isVi ? 'Vào Workspace duyệt Khay B' : 'Approve Tray B'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeakText(state.workerQuestion || 'Minh cần hỗ trợ đổi sang Khay B')}
                    className="p-1 rounded-lg bg-white text-slate-600 hover:text-blue-600 border border-slate-200"
                    title={isVi ? 'Nghe phát âm (TTS)' : 'Replay TTS'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUICK CALL TO STATION (For Lead An: Triggers Station 04 Visual Alert) */}
        {isLeader && (
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200/90 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-slate-900 block truncate">
                  {isVi ? 'Gọi nhanh Trạm 04 (Minh)' : 'Call Station 04 (Minh)'}
                </span>
                <span className="text-[9px] text-slate-500 font-medium block truncate">
                  {isVi ? 'Phát tín hiệu nháy sáng thị giác' : 'Triggers visual screen strobe'}
                </span>
              </div>
            </div>
            <button
              type="button"
              id="btn-lead-quick-call-station"
              onClick={() =>
                triggerStationCall(
                  'Trạm 04 - Minh',
                  isVi
                    ? 'Kiểm tra khay linh kiện A/B (Lệch mã SOP)'
                    : 'Verify Tray A/B (SOP code mismatch)'
                )
              }
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title={isVi ? 'Phát tín hiệu nháy sáng màn hình cho Minh' : 'Flash visual alert on Minh screen'}
            >
              <Radio className="w-3 h-3 text-cyan-200 animate-pulse" />
              <span>{isVi ? 'Nháy đèn gọi Minh' : 'Alert Minh'}</span>
            </button>
          </div>
        )}

        {/* INLINE AI CATCH-UP SUMMARY CARD */}
        {showInlineSummary && summaryData && (
          <div className="p-3 bg-gradient-to-br from-indigo-50/95 via-blue-50/80 to-slate-50 border-b border-indigo-200 text-xs shrink-0 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t('live.catchup_title')}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakText(summaryData.summary)}
                  className="p-1 rounded text-slate-500 hover:text-indigo-700"
                  title="TTS"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInlineSummary(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-800 font-medium leading-relaxed bg-white/90 p-2 rounded-lg border border-indigo-100">
              {summaryData.summary}
            </p>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">{summaryData.safetyAlert}</span>
            </div>
          </div>
        )}

        {/* REAL-TIME INTERIM VOICE CAPTION BANNER */}
        {state.isLiveMicActive && (
          <div className="p-2.5 bg-emerald-50/95 border-b border-emerald-200 text-xs text-emerald-950 flex items-center gap-2 animate-pulse shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[9px] uppercase text-emerald-800 tracking-wider">
                {isLeader ? (isVi ? 'Đang nghe Quản lý An...' : 'Listening to Lead An...') : (isVi ? 'Đang nghe từ xưởng...' : 'Listening on shopfloor...')}
              </div>
              <div className="font-medium truncate text-slate-800 text-[11px]">
                {interimText || (isVi ? 'Nói vào micro để tạo phụ đề thời gian thực...' : 'Speak into mic to generate live captions...')}
              </div>
            </div>
          </div>
        )}

        {/* LIVE STREAM FEED (AUTO-SCROLLING, Teams-like dialogue) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 text-xs bg-slate-50/40">
          {state.liveTranscriptLog.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl transition shadow-2xs ${
                item.sender === 'Minh'
                  ? 'bg-blue-50/90 border border-blue-200 ml-4'
                  : item.sender === 'An'
                  ? 'bg-white border border-slate-200 mr-4'
                  : 'bg-indigo-50/80 border border-indigo-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {item.sender === 'An' ? (
                  <AnAvatar size="w-6 h-6" />
                ) : item.sender === 'Minh' ? (
                  <MinhAvatar size="w-6 h-6" name="M" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <span>{item.sender}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.role === 'lead' ? t('role.lead') : t('role.worker')})
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>{item.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(getLocalizedTranscriptText(item))}
                      className="hover:text-blue-600 p-0.5 transition"
                      title={t('live.replay_tts')}
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p
                  className={`text-slate-800 font-medium leading-relaxed mt-1 ${
                    captionScale === 'huge'
                      ? 'text-sm font-bold'
                      : captionScale === 'large'
                      ? 'text-xs font-semibold'
                      : 'text-[11px]'
                  }`}
                >
                  {getLocalizedTranscriptText(item)}
                </p>
              </div>
            </div>
          ))}

          {/* ACTIVE LIVE STREAMING BUBBLE (Streams words into the conversation timeline as they are spoken) */}
          {state.isLiveMicActive && interimText && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/95 border-2 border-emerald-400 text-emerald-950 shadow-sm animate-in fade-in duration-100">
              <div className="shrink-0 mt-0.5">
                {isLeader ? <AnAvatar size="w-6 h-6" /> : <MinhAvatar size="w-6 h-6" name="M" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 mb-0.5">
                  <span>{isLeader ? 'An' : 'Minh'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    {isVi ? 'Đang nói phụ đề trực tiếp...' : 'Live speech stream...'}
                  </span>
                </div>
                <p
                  className={`text-slate-900 font-bold leading-relaxed ${
                    captionScale === 'huge'
                      ? 'text-sm'
                      : captionScale === 'large'
                      ? 'text-xs'
                      : 'text-[11px]'
                  }`}
                >
                  {interimText}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* PREPARED RESPONSES STUDIO DRAWER (Collapsible inside sidebar) */}
        {isStudioOpen && (
          <div className="p-3 bg-blue-50/95 border-t border-blue-200 text-xs space-y-2.5 animate-in slide-in-from-bottom-2 duration-150 shrink-0 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-1.5">
              <div className="flex items-center gap-1.5 text-blue-950 font-extrabold text-[11px]">
                <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('live.quick_actions_title')} ({state.customQuickOptions.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingOption(!isAddingOption)}
                  className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>{t('live.add_custom_option')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form to add custom quick phrase */}
            {isAddingOption && (
              <form onSubmit={handleSaveNewQuickOption} className="p-2.5 bg-white rounded-xl border border-blue-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewOptIcon(em)}
                      className={`w-6 h-6 rounded text-xs flex items-center justify-center border transition ${
                        newOptIcon === em ? 'bg-blue-100 border-blue-600' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={newOptLabel}
                    onChange={(e) => setNewOptLabel(e.target.value)}
                    placeholder={isVi ? 'Nhãn (vd: Hết phôi)' : 'Label (e.g. Empty)'}
                    className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    value={newOptSpeech}
                    onChange={(e) => setNewOptSpeech(e.target.value)}
                    placeholder={isVi ? 'Loa đọc TTS' : 'TTS spoken phrase'}
                    className="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <input
                  type="text"
                  value={newOptMessage}
                  onChange={(e) => setNewOptMessage(e.target.value)}
                  placeholder={isVi ? 'Nội dung gửi vào chat...' : 'Message sent to chat...'}
                  className="w-full px-2 py-1 bg-slate-50 rounded border border-slate-200 text-xs text-slate-900"
                />
                <div className="flex items-center justify-end gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingOption(false)}
                    className="px-2 py-0.5 text-slate-500 text-[10px]"
                  >
                    {t('live.cancel_option')}
                  </button>
                  <button
                    type="submit"
                    disabled={!newOptLabel.trim() || !newOptMessage.trim()}
                    className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold"
                  >
                    {t('live.save_option')}
                  </button>
                </div>
              </form>
            )}

            {/* List of canned responses */}
            <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
              {state.customQuickOptions.map((optRaw) => {
                const opt = getLocalizedQuickOption(optRaw);
                return (
                  <div
                    key={opt.id}
                    className="p-2 bg-white hover:bg-blue-50/70 border border-slate-200 rounded-lg flex items-center justify-between gap-1.5 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleTriggerQuickOption(opt)}
                      className="flex items-center gap-1.5 text-left flex-1 min-w-0"
                    >
                      <span className="text-base shrink-0">{opt.icon}</span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 text-[11px] truncate">{opt.label}</div>
                        <div className="text-[9px] text-slate-500 truncate">{opt.messageText}</div>
                      </div>
                    </button>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSpeakText(opt.speechText || opt.messageText)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                        title="TTS"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      {!opt.isDefault && (
                        <button
                          type="button"
                          onClick={() => removeCustomQuickOption(opt.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ONE-TAP CHIP STRIP */}
        <div className="p-2 border-t border-slate-200/90 bg-slate-50/70 flex items-center gap-1.5 overflow-x-auto select-none shrink-0">
          {/* Toggle Prepared Studio */}
          <button
            type="button"
            onClick={() => setIsStudioOpen(!isStudioOpen)}
            className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 transition ${
              isStudioOpen
                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200'
            }`}
            title={t('live.quick_actions_title')}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span className="text-[10px]">{t('live.studio_btn')}</span>
          </button>

          {/* Canned Quick Chips */}
          {state.customQuickOptions.slice(0, 3).map((optRaw) => {
            const opt = getLocalizedQuickOption(optRaw);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleTriggerQuickOption(opt)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-[11px] font-bold whitespace-nowrap transition border border-slate-200 shadow-2xs flex items-center gap-1 shrink-0"
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}

          {/* Lead Quick Approve */}
          {isLeader && (
            <button
              type="button"
              onClick={() => {
                const msg = isVi
                  ? 'An duyệt: Thao tác chính xác, tiếp tục sang công đoạn tiếp theo!'
                  : 'An approved: Step verified, proceed to next stage!';
                sendLiveMessage(msg, 'An');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold whitespace-nowrap transition border border-amber-300 shadow-2xs shrink-0 flex items-center gap-1"
            >
              <span>👍</span>
              <span>{isVi ? 'Duyệt nhanh' : 'Quick Approve'}</span>
            </button>
          )}
        </div>

        {/* INPUT FORM (SMART MESSAGING) */}
        <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isLeader
                ? t('live.input_lead_placeholder')
                : t('live.input_worker_placeholder')
            }
            className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-2xs shrink-0 flex items-center justify-center"
            title={t('live.send')}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // FLOATING DOCKED MODE (Fallback when sidebar closed)
  // ==========================================
  if (isLeader) {
    const hasWorkerInquiry =
      state.lifecycleStage === 'worker_sent' ||
      (state.workerQuestion && !state.isDestinationUpdated);

    if (!hasWorkerInquiry) {
      return null;
    }

    return (
      <aside
        aria-label={language === 'vi' ? 'Thông báo yêu cầu từ công nhân' : 'Worker request alert'}
        className="fixed bottom-4 right-4 z-30 max-w-md bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 shadow-2xl p-4 animate-in slide-in-from-bottom-3 duration-200 select-none ring-4 ring-amber-400/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl shrink-0 font-bold shadow-2xs">
            🔔
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900">
                {language === 'vi' ? 'Yêu cầu từ Minh (Trạm 04)' : 'Worker Request from Minh (Line A)'}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                {language === 'vi' ? 'Cần duyệt' : 'Action Needed'}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-snug font-medium line-clamp-2">
              &ldquo;{state.workerQuestion || (language === 'vi' ? 'Khay A đã đầy, xin chỉ đạo đổi sang Khay B!' : 'Can we use Tray B instead of Tray A?')}&rdquo;
            </p>
            <div className="pt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScreen('facilitator')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-2xs flex items-center gap-1.5"
              >
                <span>{language === 'vi' ? 'Vào Workspace duyệt đổi sang Khay B' : 'Open Workspace to Review & Approve'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeakText(state.workerQuestion || 'Minh cần hỗ trợ đổi sang Khay B')}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title={language === 'vi' ? 'Nghe lại phát âm qua loa (TTS)' : 'Replay audio (TTS)'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div
      id="persistent-live-conversation"
      className={`fixed bottom-3 right-4 z-30 select-none transition-all duration-300 ${
        isExpanded ? 'w-[calc(100vw-2rem)] md:w-[620px]' : 'max-w-[calc(100vw-2rem)] md:max-w-xl'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
        {/* TOP BAR */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 border-b bg-gradient-to-r from-blue-50/95 via-indigo-50/60 to-white border-slate-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="relative shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs"
              title={state.isLiveMicActive ? 'Mic đang bật' : 'Nhận diện giọng nói & Phụ đề'}
            >
              <span className="flex h-2 w-2 relative">
                {state.isLiveMicActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    state.isLiveMicActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </span>
              <span className="text-[11px] font-extrabold text-slate-800 tracking-tight">
                {state.isLiveMicActive
                  ? (language === 'vi' ? 'Live STT (Đang nghe)' : 'Live STT (Listening)')
                  : (language === 'vi' ? 'Phụ đề trực tiếp' : 'Live Captions')}
              </span>
            </div>

            {/* Sound Level Visualizer */}
            {state.isLiveMicActive && (
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition border ${
                  noiseStatus === 'loud'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : noiseStatus === 'speaking'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
                title={`Âm lượng xưởng: ${audioLevel}%`}
              >
                <Activity className="w-3 h-3 shrink-0" />
                <span className="font-mono text-[9px]">{audioLevel}%</span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => triggerSafetyAlert('RIGHT', 'trolley')}
              className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1 border border-rose-300 shadow-2xs"
              title={isVi ? 'Bấm để kích hoạt cảnh báo vật cản góc mù' : 'Trigger blind-corner hazard alert'}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden sm:inline">{t('safety.test_btn')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsStudioOpen(!isStudioOpen);
                setIsExpanded(true);
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                isStudioOpen
                  ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                  : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
              }`}
              title={t('live.quick_actions_title')}
            >
              <BookMarked className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">{t('live.studio_btn')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCaptionScale((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal'));
              }}
              className="px-2 py-1 rounded-lg text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 border border-slate-200"
              title={t('live.font_scale_title')}
            >
              <span className={captionScale === 'huge' ? 'text-blue-600 font-black text-sm' : captionScale === 'large' ? 'text-blue-600 font-bold' : ''}>
                Aa{captionScale === 'huge' ? '++' : captionScale === 'large' ? '+' : ''}
              </span>
            </button>

            <button
              id="btn-ai-catchup-summary"
              onClick={handleOpenSummary}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                showInlineSummary && isExpanded
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
              title={t('live.catchup_title')}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">{t('live.ai_catchup')}</span>
            </button>

            <button
              id="btn-toggle-live-mic"
              onClick={handleToggleLiveMic}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                state.isLiveMicActive
                  ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={state.isLiveMicActive ? t('live.mic_off') : t('live.mic_on')}
            >
              {state.isLiveMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title={isExpanded ? t('live.collapse') : t('live.expand')}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* LATEST MESSAGE STREAM (When collapsed) */}
        {!isExpanded && latestMessage && (
          <div
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 hover:bg-slate-50/80 cursor-pointer flex items-center justify-between gap-3 text-xs transition"
          >
            <div className="flex items-center gap-2 truncate">
              <span className={`font-extrabold shrink-0 ${latestMessage.sender === 'An' ? 'text-amber-800' : 'text-blue-700'}`}>
                {latestMessage.sender}:
              </span>
              <span className="text-slate-700 truncate font-medium">
                {latestMessage.text}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-[10px]">
              <span>{latestMessage.timestamp}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeakText(latestMessage.text);
                }}
                className="hover:text-blue-600 p-0.5"
                title="TTS"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* EXPANDED LIVE CHAT LOG & PREPARED RESPONSES STUDIO */}
        {isExpanded && (
          <div className="p-3.5 space-y-3">
            {showInlineSummary && summaryData && (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-slate-50 border border-indigo-200/90 text-xs shadow-xs animate-in fade-in duration-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t('live.catchup_title')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSpeakText(summaryData.summary)}
                      className="p-1 rounded text-slate-500 hover:text-indigo-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInlineSummary(false)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-slate-900">{summaryData.summary}</p>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold">{summaryData.safetyAlert}</span>
                </div>
              </div>
            )}

            {/* Interim Live Voice STT Bubble */}
            {state.isLiveMicActive && (
              <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wider">
                    {isLeader ? 'Đang lắng nghe chỉ đạo giọng nói của Quản lý An...' : 'Đang lắng nghe trực tiếp từ xưởng...'}
                  </div>
                  <div className="font-medium truncate text-slate-800">
                    {interimText || 'Nói vào micro để chuyển tự động thành phụ đề thời gian thực...'}
                  </div>
                </div>
              </div>
            )}

            {/* Message Stream */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {state.liveTranscriptLog.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl transition ${
                    item.sender === 'Minh'
                      ? 'bg-blue-50/70 border border-blue-100 ml-4'
                      : 'bg-slate-50 border border-slate-100 mr-4'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {item.sender === 'An' ? <AnAvatar size="w-6 h-6" /> : <MinhAvatar size="w-6 h-6" name="M" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {item.sender}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({item.role === 'lead' ? t('role.lead') : t('role.worker')})
                        </span>
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span>{item.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleSpeakText(getLocalizedTranscriptText(item))}
                          className="hover:text-blue-600 p-0.5"
                          title={t('live.replay_tts')}
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-slate-800 font-medium leading-relaxed mt-1 ${
                        captionScale === 'huge'
                          ? 'text-base font-bold'
                          : captionScale === 'large'
                          ? 'text-sm font-semibold'
                          : 'text-xs'
                      }`}
                    >
                      {getLocalizedTranscriptText(item)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* SỔ TAY CÂU THOẠI CHUẨN BỊ TRƯỚC */}
            {isStudioOpen && (
              <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200 text-xs space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <div className="flex items-center gap-1.5 text-blue-950 font-black">
                    <BookMarked className="w-4 h-4 text-blue-600" />
                    <span>{t('live.quick_actions_title')} ({state.customQuickOptions.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingOption(!isAddingOption)}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{t('live.add_custom_option')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStudioOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isAddingOption && (
                  <form onSubmit={handleSaveNewQuickOption} className="p-3 bg-white rounded-xl border border-blue-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {EMOJI_OPTIONS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewOptIcon(em)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition ${
                            newOptIcon === em ? 'bg-blue-100 border-blue-600 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newOptLabel}
                        onChange={(e) => setNewOptLabel(e.target.value)}
                        placeholder={isVi ? 'Nhãn nút' : 'Button label'}
                        className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900"
                      />
                      <input
                        type="text"
                        value={newOptSpeech}
                        onChange={(e) => setNewOptSpeech(e.target.value)}
                        placeholder={isVi ? 'Câu loa đọc TTS' : 'Spoken TTS phrase'}
                        className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      value={newOptMessage}
                      onChange={(e) => setNewOptMessage(e.target.value)}
                      placeholder={isVi ? 'Nội dung gửi vào chat...' : 'Message text sent to chat...'}
                      className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingOption(false)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-bold"
                      >
                        {t('live.cancel_option')}
                      </button>
                      <button
                        type="submit"
                        disabled={!newOptLabel.trim() || !newOptMessage.trim()}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold shadow-2xs"
                      >
                        {t('live.save_option')}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-0.5">
                  {state.customQuickOptions.map((optRaw) => {
                    const opt = getLocalizedQuickOption(optRaw);
                    return (
                      <div
                        key={opt.id}
                        className="group p-2.5 bg-white hover:bg-blue-50/70 border border-slate-200 rounded-xl transition flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => handleTriggerQuickOption(opt)}
                          className="flex items-center gap-2 text-left flex-1 min-w-0"
                        >
                          <span className="text-lg shrink-0">{opt.icon}</span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 text-xs truncate group-hover:text-blue-700">
                              {opt.label}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {opt.messageText}
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSpeakText(opt.speechText || opt.messageText)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                            title="TTS"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {!opt.isDefault && (
                            <button
                              type="button"
                              onClick={() => removeCustomQuickOption(opt.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HORIZONTAL ONE-TAP CHIP STRIP */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
              {state.customQuickOptions.slice(0, 4).map((optRaw) => {
                const opt = getLocalizedQuickOption(optRaw);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTriggerQuickOption(opt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-800 text-xs font-bold whitespace-nowrap transition border border-slate-200 shadow-2xs flex items-center gap-1.5 shrink-0"
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}

              {isLeader && (
                <button
                  type="button"
                  onClick={() => {
                    const msg = isVi
                      ? 'An duyệt: Thao tác chính xác, tiếp tục sang công đoạn tiếp theo!'
                      : 'An approved: Step verified, proceed to next stage!';
                    sendLiveMessage(msg, 'An');
                    handleSpeakText(msg);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold whitespace-nowrap transition border border-amber-300 shadow-2xs shrink-0"
                >
                  👍 {isVi ? 'Lệnh duyệt nhanh' : 'Quick Approve'}
                </button>
              )}
            </div>

            {/* Input Form with Audio & Text */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isLeader
                    ? t('live.input_lead_placeholder')
                    : t('live.input_worker_placeholder')
                }
                className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm shrink-0"
              >
                <span>{t('live.send')}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
