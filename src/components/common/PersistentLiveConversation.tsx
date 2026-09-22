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
} from 'lucide-react';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';

const EMOJI_OPTIONS = ['💬', '📦', '⚠️', '⚙️', '🙋', '🚻', '🔄', '🛑', '👍', '✅', '🔧'];

export const PersistentLiveConversation: React.FC = () => {
  const {
    state,
    setScreen,
    toggleLiveMic,
    sendLiveMessage,
    summarizeLiveConversation,
    addCustomQuickOption,
    removeCustomQuickOption,
    triggerSafetyAlert,
  } = useHandoff();
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              if (transcript.trim()) {
                const sender = isLeader ? 'An' : 'Minh';
                sendLiveMessage(transcript.trim(), sender);
                setInterimText('');
              }
            } else {
              currentInterim += transcript;
            }
          }
          if (currentInterim) {
            setInterimText(currentInterim);
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
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.liveTranscriptLog, isExpanded, interimText]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const sender = isLeader ? 'An' : 'Minh';
    sendLiveMessage(inputText, sender);
    if (!isLeader) {
      handleSpeakText(inputText);
    }
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
    handleSpeakText(option.speechText || option.messageText);
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

  // IF LEADER IS ACTIVE: Supervisor does NOT need a persistent subtitle window.
  // Instead, provide a clean floating Worker Request card when Minh asks for assistance!
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
    <>
      {/* FLOATING PERSISTENT LIVE CONVERSATION WIDGET FOR DEAF WORKER */}
      <div
        id="persistent-live-conversation"
        className={`fixed bottom-3 right-4 z-30 select-none transition-all duration-300 ${
          isExpanded ? 'w-[calc(100vw-2rem)] md:w-[620px]' : 'max-w-[calc(100vw-2rem)] md:max-w-xl'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
          {/* TOP BAR: Clean, Dedicated Worker Communication Bar */}
          <div className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 border-b bg-gradient-to-r from-blue-50/95 via-indigo-50/60 to-white border-slate-200/80">
            {/* Left: Live status with Sound Level Visualizer */}
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

              {/* Sound Level Visualizer for Worker (Đo độ ồn xưởng) */}
              {state.isLiveMicActive && (
                <div
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition border ${
                    noiseStatus === 'loud'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : noiseStatus === 'speaking'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                  title={`Âm lượng xưởng: ${audioLevel}%. ${
                    noiseStatus === 'speaking' ? 'Có người đang nói' : noiseStatus === 'loud' ? 'Xưởng ồn ào' : 'Yên tĩnh'
                  }`}
                >
                  <Activity className="w-3 h-3 shrink-0" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className={`w-0.5 rounded-full transition-all duration-150 ${audioLevel > 10 ? 'bg-current h-1.5' : 'bg-slate-300 h-1'}`} />
                    <span className={`w-0.5 rounded-full transition-all duration-150 ${audioLevel > 25 ? 'bg-current h-2.5' : 'bg-slate-300 h-1'}`} />
                    <span className={`w-0.5 rounded-full transition-all duration-150 ${audioLevel > 50 ? 'bg-current h-3' : 'bg-slate-300 h-1'}`} />
                    <span className={`w-0.5 rounded-full transition-all duration-150 ${audioLevel > 75 ? 'bg-current h-3.5' : 'bg-slate-300 h-1'}`} />
                  </div>
                  <span className="font-mono text-[9px]">{audioLevel}%</span>
                </div>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Module 2: Quick Test Blind-Corner Alert Button (Crucial for Demo/Video) */}
              <button
                type="button"
                onClick={() => triggerSafetyAlert('RIGHT', 'trolley')}
                className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1 border border-rose-300 shadow-2xs"
                title="Bấm để kích hoạt cảnh báo vật cản góc mù (Module 2 Accessible Safety)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="hidden sm:inline">Test Góc Mù</span>
              </button>

              {/* Sổ tay câu thoại chuẩn bị trước (Prepared Responses Studio) */}
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
                title="Sổ tay câu thoại chuẩn bị trước cho người khiếm thính"
              >
                <BookMarked className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Sổ câu sẵn</span>
              </button>

              {/* Font Scale (Aa) */}
              <button
                type="button"
                onClick={() => {
                  setCaptionScale((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal'));
                }}
                className="px-2 py-1 rounded-lg text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 border border-slate-200"
                title={`Cỡ chữ phụ đề: ${captionScale === 'normal' ? 'Chuẩn' : captionScale === 'large' ? 'Lớn' : 'Rất lớn'}`}
              >
                <span className={captionScale === 'huge' ? 'text-blue-600 font-black text-sm' : captionScale === 'large' ? 'text-blue-600 font-bold' : ''}>
                  Aa{captionScale === 'huge' ? '++' : captionScale === 'large' ? '+' : ''}
                </span>
              </button>

              {/* AI Catch-up */}
              <button
                id="btn-ai-catchup-summary"
                onClick={handleOpenSummary}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                  showInlineSummary && isExpanded
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
                title="Tóm tắt điểm tin ca trực bằng AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden md:inline">AI Catch-up</span>
              </button>

              {/* Mic STT Toggle */}
              <button
                id="btn-toggle-live-mic"
                onClick={toggleLiveMic}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  state.isLiveMicActive
                    ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-300 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={
                  state.isLiveMicActive
                    ? 'Đang nhận diện giọng nói (Bấm để tắt)'
                    : isLeader
                    ? 'Bật mic để nói lệnh cho Minh'
                    : 'Bật nhận diện giọng nói nhà xưởng (STT)'
                }
              >
                {state.isLiveMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>

              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title={isExpanded ? 'Thu gọn khung hội thoại' : 'Mở rộng khung hội thoại'}
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
                  title="Đọc to tin nhắn này (TTS)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* EXPANDED LIVE CHAT LOG & PREPARED RESPONSES STUDIO */}
          {isExpanded && (
            <div className="p-3.5 space-y-3">
              {/* Seamless Inline AI Catch-up Card */}
              {showInlineSummary && summaryData && (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-slate-50 border border-indigo-200/90 text-xs shadow-xs animate-in fade-in duration-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t('live.catchup_title', 'AI Catch-up: Điểm tin ca trực')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSpeakText(summaryData.summary)}
                        className="p-1 rounded text-slate-500 hover:text-indigo-700 hover:bg-indigo-100/50 transition"
                        title="Đọc to tóm tắt (TTS)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInlineSummary(false)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                        title="Đóng tóm tắt"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-lg border border-indigo-100/80 text-slate-800 leading-relaxed font-medium">
                    <p className="font-bold text-slate-900 mb-1">{summaryData.summary}</p>
                    <div className="space-y-1 mt-1.5 border-t border-slate-100 pt-1.5">
                      {summaryData.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            ✓
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold">{summaryData.safetyAlert}</span>
                  </div>
                </div>
              )}

              {/* Real-time Interim Live Voice STT Bubble */}
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
                            ({item.role === 'lead' ? 'Quản lý' : 'Công nhân'})
                          </span>
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>{item.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeakText(item.text)}
                            className="hover:text-blue-600 p-0.5"
                            title="Phát âm thanh ra loa (TTS)"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-slate-800 font-medium leading-relaxed mt-1 ${
                        captionScale === 'huge' ? 'text-base font-bold' : captionScale === 'large' ? 'text-sm font-semibold' : 'text-xs'
                      }`}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* SỔ TAY CÂU THOẠI CHUẨN BỊ TRƯỚC (PREPARED RESPONSES STUDIO) */}
              {isStudioOpen && (
                <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200 text-xs space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                    <div className="flex items-center gap-1.5 text-blue-950 font-black">
                      <BookMarked className="w-4 h-4 text-blue-600" />
                      <span>Sổ tay câu thoại chuẩn bị trước ({state.customQuickOptions.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingOption(!isAddingOption)}
                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Soạn câu mới</span>
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

                  {/* Inline New Option Creation Form */}
                  {isAddingOption && (
                    <form onSubmit={handleSaveNewQuickOption} className="p-3 bg-white rounded-xl border border-blue-200 space-y-2.5 shadow-xs">
                      <div className="text-[11px] font-extrabold text-slate-800">Soạn câu thoại sẵn cho ca trực của bạn</div>

                      {/* Icon selector */}
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
                          placeholder="Nhãn nút (Ví dụ: Hết phôi)"
                          className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                        />
                        <input
                          type="text"
                          value={newOptSpeech}
                          onChange={(e) => setNewOptSpeech(e.target.value)}
                          placeholder="Câu loa đọc TTS (Tùy chọn)"
                          className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <input
                        type="text"
                        value={newOptMessage}
                        onChange={(e) => setNewOptMessage(e.target.value)}
                        placeholder="Nội dung gửi vào chat (Ví dụ: Khay linh kiện đã hết phôi, cần cấp thêm!)"
                        className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                      />

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingOption(false)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-bold"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={!newOptLabel.trim() || !newOptMessage.trim()}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold shadow-2xs"
                        >
                          Lưu vào sổ câu sẵn
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Grid of Prepared Canned Responses (1-Tap to Send & Speak) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-0.5">
                    {state.customQuickOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="group p-2.5 bg-white hover:bg-blue-50/70 border border-slate-200 rounded-xl transition flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => handleTriggerQuickOption(opt)}
                          className="flex items-center gap-2 text-left flex-1 min-w-0"
                          title={`Chạm để gửi và phát loa: "${opt.messageText}"`}
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
                            title="Nghe thử âm thanh phát loa"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {!opt.isDefault && (
                            <button
                              type="button"
                              onClick={() => removeCustomQuickOption(opt.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Xóa câu này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HORIZONTAL ONE-TAP CHIP STRIP */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                {state.customQuickOptions.slice(0, 4).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTriggerQuickOption(opt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-800 text-xs font-bold whitespace-nowrap transition border border-slate-200 shadow-2xs flex items-center gap-1.5 shrink-0"
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}

                {isLeader && (
                  <button
                    type="button"
                    onClick={() => {
                      sendLiveMessage('An duyệt: Thao tác chính xác, tiếp tục sang công đoạn tiếp theo!', 'An');
                      handleSpeakText('Thao tác chính xác, tiếp tục sang công đoạn tiếp theo!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold whitespace-nowrap transition border border-amber-300 shadow-2xs shrink-0"
                  >
                    👍 Lệnh duyệt nhanh
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
                      ? 'Nhập chỉ đạo hoặc nói qua mic (chuyển phụ đề cho Minh)...'
                      : 'Nhập tin nhắn (tự động phát loa TTS cho quản lý nghe)...'
                  }
                  className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm shrink-0"
                >
                  <span>{t('live.send', 'Gửi')}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
