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
} from 'lucide-react';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';

export const PersistentLiveConversation: React.FC = () => {
  const {
    state,
    toggleLiveMic,
    sendLiveMessage,
    summarizeLiveConversation,
    addCustomQuickOption,
    removeCustomQuickOption,
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

  // Custom Quick Option Creation modal / inline form
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
  const [isSignSheetOpen, setIsSignSheetOpen] = useState<boolean>(false);
  const [captionScale, setCaptionScale] = useState<'normal' | 'large' | 'huge'>('large');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const latestMessage = state.liveTranscriptLog[state.liveTranscriptLog.length - 1];

  const getSpeechLang = () => {
    switch (language) {
      case 'en': return 'en-US';
      case 'ja': return 'ja-JP';
      case 'ko': return 'ko-KR';
      case 'zh': return 'zh-CN';
      case 'vi':
      default: return 'vi-VN';
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
        // Map average volume (0 - 128) to 0 - 100 scale
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
      // In case user denies mic access or browser sandbox, provide responsive simulated ambient pulse
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
                const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
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
        } catch {
          // Ignore
        }
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
        } catch {
          // Already started
        }
      }
    } else {
      stopAudioMeter();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setSpeechActive(false);
          setInterimText('');
        } catch {
          // Ignore
        }
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
    const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
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
    } catch {
      // Ignored
    }
  };

  return (
    <>
      {/* FLOATING PERSISTENT LIVE CONVERSATION WIDGET */}
      <div
        id="persistent-live-conversation"
        className="fixed bottom-3 right-4 z-30 select-none max-w-[calc(100vw-2rem)] md:max-w-xl transition-all duration-300"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
          {/* TOP BAR: Clean, Real Workplace Communication Bar */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-blue-50/95 via-slate-50 to-white flex items-center justify-between gap-3 border-b border-slate-200/80">
            {/* Left: Live status with Sound Level Visualizer (Cho người khiếm thính biết xưởng đang nói hay ồn) */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="relative shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs"
                title={state.isLiveMicActive ? 'Mic & Cảm biến âm thanh đang bật' : 'Nhận diện giọng nói & Trợ thị'}
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
                  {state.isLiveMicActive ? 'Live STT' : 'Phụ đề trực tiếp'}
                </span>
              </div>

              {/* Ambient Noise Level Indicator for Deaf Workers */}
              {state.isLiveMicActive && (
                <div
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition border ${
                    noiseStatus === 'loud'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : noiseStatus === 'speaking'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                  title={`Âm lượng môi trường xung quanh: ${audioLevel}%. ${
                    noiseStatus === 'speaking' ? 'Có người đang nói chuyện' : noiseStatus === 'loud' ? 'Môi trường ồn ào' : 'Xưởng yên tĩnh'
                  }`}
                >
                  <Activity className="w-3 h-3 shrink-0" />
                  {/* Dynamic 4-bar sound level equalizer */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span
                      className={`w-0.5 rounded-full transition-all duration-150 ${
                        audioLevel > 10 ? 'bg-current h-1.5' : 'bg-slate-300 h-1'
                      }`}
                    />
                    <span
                      className={`w-0.5 rounded-full transition-all duration-150 ${
                        audioLevel > 25 ? 'bg-current h-2.5' : 'bg-slate-300 h-1'
                      }`}
                    />
                    <span
                      className={`w-0.5 rounded-full transition-all duration-150 ${
                        audioLevel > 50 ? 'bg-current h-3' : 'bg-slate-300 h-1'
                      }`}
                    />
                    <span
                      className={`w-0.5 rounded-full transition-all duration-150 ${
                        audioLevel > 75 ? 'bg-current h-3.5' : 'bg-slate-300 h-1'
                      }`}
                    />
                  </div>
                  <span className="font-mono text-[9px]">{audioLevel}%</span>
                  <span className="hidden sm:inline">
                    {noiseStatus === 'speaking' ? 'Đang nói' : noiseStatus === 'loud' ? 'Xưởng ồn' : 'Yên tĩnh'}
                  </span>
                </div>
              )}
            </div>

            {/* Right: AI Catch-up, Quick Visual Sign, Mic STT & Expand/Collapse */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Caption Scale Toggle (Phóng to cỡ chữ phụ đề cho người khiếm thính) */}
              <button
                type="button"
                onClick={() => {
                  setCaptionScale((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal'));
                }}
                className="px-2 py-1 rounded-lg text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 border border-slate-200"
                title={`Cỡ chữ phụ đề: ${captionScale === 'normal' ? 'Chuẩn' : captionScale === 'large' ? 'Lớn' : 'Rất lớn'} (Bấm để đổi)`}
              >
                <span className={captionScale === 'huge' ? 'text-blue-600 font-black text-sm' : captionScale === 'large' ? 'text-blue-600 font-bold' : ''}>
                  Aa{captionScale === 'huge' ? '++' : captionScale === 'large' ? '+' : ''}
                </span>
              </button>

              {/* Deaf Friendly Quick Sign/Icon Sheet Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSignSheetOpen(!isSignSheetOpen);
                  setIsExpanded(true);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                  isSignSheetOpen
                    ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                    : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                }`}
                title="Giao tiếp trực quan nhanh cho người khiếm thính"
              >
                <Smile className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Thao tác nhanh</span>
              </button>

              {/* AI Catch-up Summary Toggle Button */}
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
                <span className="hidden sm:inline">AI Catch-up</span>
              </button>

              {/* Mic STT Toggle (Real Web Speech Recognition) */}
              <button
                id="btn-toggle-live-mic"
                onClick={toggleLiveMic}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  state.isLiveMicActive
                    ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-300 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={state.isLiveMicActive ? 'Đang nhận diện giọng nói (Nhấn để tắt)' : 'Bật nhận diện giọng nói (STT)'}
              >
                {state.isLiveMicActive ? (
                  <Mic className="w-3.5 h-3.5" />
                ) : (
                  <MicOff className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Expand/Collapse Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title={isExpanded ? 'Thu gọn khung hội thoại' : 'Mở rộng khung hội thoại'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
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
                <span className="font-extrabold text-blue-700 shrink-0">
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

          {/* EXPANDED LIVE CHAT LOG & QUICK COMPOSER */}
          {isExpanded && (
            <div className="p-3.5 space-y-3">
              {/* Seamless Inline AI Catch-up Card right inside the stream */}
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

                  {/* Summary Core Note */}
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

                  {/* Safety Alert */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold">{summaryData.safetyAlert}</span>
                  </div>
                </div>
              )}

              {/* Real-time Interim Live Voice STT Bubble (khi có người đang nói qua mic) */}
              {state.isLiveMicActive && (
                <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wider">
                      Đang lắng nghe trực tiếp từ xưởng...
                    </div>
                    <div className="font-medium truncate text-slate-800">
                      {interimText || 'Nói vào micro để chuyển tự động thành phụ đề...'}
                    </div>
                  </div>
                </div>
              )}

              {/* Message List */}
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
                      {item.sender === 'An' ? (
                        <AnAvatar size="w-6 h-6" />
                      ) : (
                        <MinhAvatar size="w-6 h-6" name="M" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {item.sender}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({item.role === 'lead' ? t('role.lead', 'Quản lý') : t('role.worker', 'Công nhân')})
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

              {/* DEAF ACCESSIBILITY: Fast Communication Action Sheet */}
              {isSignSheetOpen && (
                <div className="p-3 bg-blue-50/90 rounded-xl border border-blue-200 text-sm space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-blue-900 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-600" />
                      Giao tiếp không lời (Người khiếm thính ↔ Quản lý)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSignSheetOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                        sendLiveMessage('Minh xác nhận: Đã hoàn tất bước này an toàn!', sender);
                        handleSpeakText('Minh đã hoàn tất bước này an toàn!');
                        setIsSignSheetOpen(false);
                      }}
                      className="p-2.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm text-left transition flex items-center gap-2 shadow-2xs"
                    >
                      <span className="text-lg">👍</span>
                      <span className="truncate">Đã xong / OK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                        sendLiveMessage('Cần quản lý qua hỗ trợ tại vị trí của tôi!', sender);
                        handleSpeakText('Cần quản lý hỗ trợ tại vị trí!');
                        setIsSignSheetOpen(false);
                      }}
                      className="p-2.5 bg-white hover:bg-rose-50 hover:text-rose-800 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm text-left transition flex items-center gap-2 shadow-2xs"
                    >
                      <span className="text-lg">🙋</span>
                      <span className="truncate">Cần hỗ trợ gấp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                        sendLiveMessage('Khay linh kiện đã đầy, xin chỉ đạo vị trí tiếp theo!', sender);
                        handleSpeakText('Khay linh kiện đã đầy, xin chỉ đạo vị trí tiếp theo!');
                        setIsSignSheetOpen(false);
                      }}
                      className="p-2.5 bg-white hover:bg-blue-50 hover:text-blue-800 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm text-left transition flex items-center gap-2 shadow-2xs"
                    >
                      <span className="text-lg">📦</span>
                      <span className="truncate">Đầy khay chứa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                        sendLiveMessage('Xin nhắc lại thao tác này rõ hơn bằng hình ảnh hoặc văn bản!', sender);
                        handleSpeakText('Xin nhắc lại thao tác này rõ hơn!');
                        setIsSignSheetOpen(false);
                      }}
                      className="p-2.5 bg-white hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm text-left transition flex items-center gap-2 shadow-2xs"
                    >
                      <span className="text-lg">🔄</span>
                      <span className="truncate">Xin nhắc lại</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Template Chips - Large & High Contrast */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                    sendLiveMessage('Minh xác nhận: Đã hoàn tất bước này an toàn!', sender);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 text-xs sm:text-sm font-bold whitespace-nowrap transition border border-slate-200 shadow-2xs"
                >
                  👍 {t('live.chip_completed', 'Đã hoàn tất')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                    sendLiveMessage('Cần quản lý qua hỗ trợ tại trạm!', sender);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold whitespace-nowrap transition border-2 border-amber-300 shadow-2xs"
                >
                  ⚠️ {t('live.chip_help', 'Cần hỗ trợ')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sender = state.activePersona === 'facilitator' ? 'An' : 'Minh';
                    sendLiveMessage('Vật tư đã đầy, xin lệnh chuyển tiếp!', sender);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-800 text-xs sm:text-sm font-bold whitespace-nowrap transition border border-slate-200 shadow-2xs"
                >
                  📦 {t('live.chip_material', 'Đầy vật tư')}
                </button>
              </div>

              {/* Input Form with Audio & Text - Scaled up */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    state.activePersona === 'facilitator'
                      ? 'Nhập chỉ đạo hoặc nói qua mic...'
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
