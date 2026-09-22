import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';
import {
  MessageSquare,
  Search,
  Send,
  Flag,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ShieldCheck,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const { state, setScreen, setGoldenFlowState, startSpeechRecording, stopSpeechRecording } = useHandoff();
  const isFacilitator = state.activePersona === 'facilitator';

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1042');
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs_clarification' | 'resolved'>('all');

  const handleVoiceToggle = () => {
    if (state.isRecordingSpeech) {
      stopSpeechRecording();
    } else {
      startSpeechRecording();
      setTimeout(() => {
        setInputText('Can we confirm Tray B is ready at Line A?');
        stopSpeechRecording();
      }, 1500);
    }
  };

  const isClarificationState = state.lifecycleStage === 'worker_sent';
  const isUpdatedState = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';

  const threads = [
    {
      id: 'thread-1042',
      taskId: 'INS-1042',
      taskTitle: 'Pack finished assemblies',
      partnerName: isFacilitator ? 'Minh' : 'An',
      partnerRole: isFacilitator ? 'Assembly Worker' : 'Team lead',
      lastMessage: isUpdatedState
        ? "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction."
        : isClarificationState
        ? 'Can we use Tray B instead of Tray A for high-volume units?'
        : 'Initial standard work assigned to Assembly Line A.',
      timestamp: isUpdatedState ? '10:14 AM' : isClarificationState ? '10:02 AM' : '09:30 AM',
      unread: isClarificationState && isFacilitator,
      status: isUpdatedState ? 'resolved' : isClarificationState ? 'needs_clarification' : 'in_progress',
      workArea: 'Line A',
    },
    {
      id: 'thread-1039',
      taskId: 'INS-1039',
      taskTitle: 'Inspect wiring harness continuity',
      partnerName: isFacilitator ? 'Hùng' : 'An',
      partnerRole: isFacilitator ? 'QC Specialist' : 'Team lead',
      lastMessage: 'Visual test pin color changed from yellow to blue. Updated on standard sheet.',
      timestamp: 'Yesterday',
      unread: false,
      status: 'resolved',
      workArea: 'Line A',
    },
    {
      id: 'thread-safety',
      taskId: 'SAF-002',
      taskTitle: 'Blind-Corner LED Beacon check',
      partnerName: 'Safety Committee',
      partnerRole: 'EHS Department',
      lastMessage: 'Visual flashing beacon at Intersection 3 is fully operational for the morning shift.',
      timestamp: '21 Sep',
      unread: false,
      status: 'resolved',
      workArea: 'Plant Wide',
    },
  ];

  const filteredThreads = threads.filter((t) => {
    if (filterType === 'needs_clarification') return t.status === 'needs_clarification';
    if (filterType === 'resolved') return t.status === 'resolved';
    return true;
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  return (
    <div className="space-y-6">
      {/* Header with Brief Alignment Context */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                ADC Stage 4 &amp; 6 · In-Task Clarifications
              </span>
              <span className="text-xs text-slate-400 font-semibold">Context-Preserving Comms</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Workplace Handoff Messages
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Unlike generic chat apps where instructions get lost, every message here is tied directly to a task step with visual proof and lead verification.
            </p>
          </div>

          <button
            onClick={() => setScreen('worker_detail')}
            className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
          >
            <span>View Task INS-1042</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden min-h-[580px]">
        {/* Left Column: Thread List (4 cols) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search threads by task or person..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All ({threads.length})
              </button>
              <button
                onClick={() => setFilterType('needs_clarification')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  filterType === 'needs_clarification'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                }`}
              >
                <Flag className="w-3 h-3" />
                <span>Flagged</span>
              </button>
              <button
                onClick={() => setFilterType('resolved')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  filterType === 'resolved'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Resolved</span>
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-4 transition flex items-start gap-3 ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">
                    {thread.partnerName === 'An' ? (
                      <AnAvatar size="w-9 h-9" />
                    ) : (
                      <MinhAvatar size="w-9 h-9" name={thread.partnerName[0]} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">{thread.partnerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{thread.taskId}]</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{thread.timestamp}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {thread.taskTitle}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                      {thread.lastMessage}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      {thread.status === 'needs_clarification' ? (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <Flag className="w-2.5 h-2.5 text-rose-600" />
                          <span>Needs Clarification</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Step Verified</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{thread.workArea}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread Discussion (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/30">
          {/* Active Thread Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {activeThread.partnerName === 'An' ? (
                <AnAvatar size="w-10 h-10" />
              ) : (
                <MinhAvatar size="w-10 h-10" name={activeThread.partnerName[0]} />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-950">{activeThread.partnerName}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                    {activeThread.partnerRole}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-blue-600 font-bold">{activeThread.taskId}</span>
                  <span>·</span>
                  <span>{activeThread.taskTitle}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setScreen('worker_detail')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Jump to Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px]">
            {/* Context Badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Thread anchored to Task INS-1042 · Step 2: Place in tray</span>
              </span>
            </div>

            {/* Message 1: Minh asks clarification */}
            <div className="flex items-start gap-3">
              <MinhAvatar size="w-8 h-8" name="M" />
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-900">Minh (Worker)</span>
                  <span>10:02 AM</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold text-[9px]">
                    Step Clarification
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-800 shadow-2xs leading-relaxed">
                  {state.activeContribution?.text || 'Can we use Tray B instead of Tray A for high-volume units?'}
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    Flagged directly at Step 2 to avoid stopping the entire line.
                  </div>
                </div>
              </div>
            </div>

            {/* Message 2: An responds with update (State 3) or Pending (State 2) */}
            {isUpdatedState ? (
              <div className="flex items-start gap-3 flex-row-reverse">
                <AnAvatar size="w-8 h-8" />
                <div className="space-y-1 max-w-md text-right">
                  <div className="flex items-center justify-end gap-2 text-[11px] text-slate-500">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      Lead Verified
                    </span>
                    <span>10:14 AM</span>
                    <span className="font-bold text-slate-900">An (Team lead)</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-3.5 text-xs text-left shadow-2xs leading-relaxed">
                    Great question, Minh! You&apos;re right — the units should go to{' '}
                    <strong className="underline font-bold">Tray B</strong>. I&apos;ve updated the instruction and verified Step 2.
                    <div className="mt-2 pt-2 border-t border-emerald-500/80 text-[10px] text-emerald-100 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Provenance stamp applied to Standard Work v2.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : isClarificationState ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Awaiting An&apos;s lead approval to update Step 2 destination.</span>
                </div>
                <button
                  onClick={() => setGoldenFlowState(3)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-200" />
                  <span>Simulate Approval</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-white border-t border-slate-200/80">
            <div className="relative rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 transition bg-slate-50/50">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Reply to this clarification thread..."
                className="w-full px-4 py-3 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-white rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      state.isRecordingSpeech
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Dictate with voice"
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
                  <span className="text-[11px] text-slate-400">Attached to INS-1042</span>
                </div>

                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
