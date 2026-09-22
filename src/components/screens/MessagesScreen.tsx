import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
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
  Volume2,
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const { state, setScreen, setGoldenFlowState, startSpeechRecording, stopSpeechRecording } = useHandoff();
  const { isVi } = useLanguage();
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
        setInputText(
          isVi
            ? 'Chúng ta có thể xác nhận Khay B đã sẵn sàng tại Chuyền A không?'
            : 'Can we confirm Tray B is ready at Line A?'
        );
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
      taskTitle: isVi ? 'Đóng gói các cụm lắp ráp hoàn thiện' : 'Pack finished assemblies',
      partnerName: isFacilitator ? 'Minh' : 'An',
      partnerRole: isFacilitator
        ? (isVi ? 'Nhân viên lắp ráp' : 'Assembly Worker')
        : (isVi ? 'Trưởng nhóm' : 'Team lead'),
      lastMessage: isUpdatedState
        ? (isVi
            ? 'Câu hỏi rất hay, Minh! Bạn nói đúng — các cụm nên chuyển sang Khay B. Tôi đã cập nhật chỉ dẫn.'
            : "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction.")
        : isClarificationState
        ? (isVi
            ? 'Chúng ta có thể dùng Khay B thay vì Khay A cho các sản phẩm sản lượng lớn không?'
            : 'Can we use Tray B instead of Tray A for high-volume units?')
        : (isVi
            ? 'Quy chuẩn làm việc ban đầu được giao cho Chuyền lắp ráp A.'
            : 'Initial standard work assigned to Assembly Line A.'),
      timestamp: isUpdatedState ? '10:14 AM' : isClarificationState ? '10:02 AM' : '09:30 AM',
      unread: isClarificationState && isFacilitator,
      status: isUpdatedState ? 'resolved' : isClarificationState ? 'needs_clarification' : 'in_progress',
      workArea: isVi ? 'Chuyền A' : 'Line A',
    },
    {
      id: 'thread-1039',
      taskId: 'INS-1039',
      taskTitle: isVi ? 'Kiểm tra thông mạch bó dây tín hiệu' : 'Inspect wiring harness continuity',
      partnerName: isFacilitator ? 'Hùng' : 'An',
      partnerRole: isFacilitator
        ? (isVi ? 'Chuyên viên KCS' : 'QC Specialist')
        : (isVi ? 'Trưởng nhóm' : 'Team lead'),
      lastMessage: isVi
        ? 'Màu chân kiểm tra trực quan đã đổi từ vàng sang xanh lam. Đã cập nhật trên phiếu chuẩn.'
        : 'Visual test pin color changed from yellow to blue. Updated on standard sheet.',
      timestamp: isVi ? 'Hôm qua' : 'Yesterday',
      unread: false,
      status: 'resolved',
      workArea: isVi ? 'Chuyền A' : 'Line A',
    },
    {
      id: 'thread-safety',
      taskId: 'SAF-002',
      taskTitle: isVi ? 'Kiểm tra đèn chớp LED góc khuất' : 'Blind-Corner LED Beacon check',
      partnerName: isVi ? 'Ban An toàn' : 'Safety Committee',
      partnerRole: isVi ? 'Phòng An toàn Môi trường EHS' : 'EHS Department',
      lastMessage: isVi
        ? 'Đèn chớp cảnh báo trực quan tại Giao lộ 3 đã hoạt động đầy đủ cho ca sáng.'
        : 'Visual flashing beacon at Intersection 3 is fully operational for the morning shift.',
      timestamp: isVi ? '21 Th09' : '21 Sep',
      unread: false,
      status: 'resolved',
      workArea: isVi ? 'Toàn nhà máy' : 'Plant Wide',
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
                {isVi ? 'ADC Giai đoạn 4 & 6 · Làm rõ trong Tác vụ' : 'ADC Stage 4 & 6 · In-Task Clarifications'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {isVi ? 'Giao tiếp Giữ nguyên Ngữ cảnh' : 'Context-Preserving Comms'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              {isVi ? 'Tin nhắn Bàn giao Nơi làm việc' : 'Workplace Handoff Messages'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {isVi
                ? 'Khác với các ứng dụng nhắn tin thông thường dễ thất lạc chỉ dẫn, mọi tin nhắn ở đây đều gắn liền trực tiếp với từng bước thao tác, kèm bằng chứng trực quan và phê duyệt từ trưởng nhóm.'
                : 'Unlike generic chat apps where instructions get lost, every message here is tied directly to a task step with visual proof and lead verification.'}
            </p>
          </div>

          <button
            onClick={() => setScreen('worker_detail')}
            className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
          >
            <span>{isVi ? 'Xem nhiệm vụ INS-1042' : 'View Task INS-1042'}</span>
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
                placeholder={isVi ? 'Tìm kiếm cuộc trò chuyện theo tác vụ hoặc người...' : 'Search threads by task or person...'}
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
                {isVi ? `Tất cả (${threads.length})` : `All (${threads.length})`}
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
                <span>{isVi ? 'Cần làm rõ' : 'Flagged'}</span>
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
                <span>{isVi ? 'Đã giải quyết' : 'Resolved'}</span>
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
                          <span>{isVi ? 'Cần làm rõ' : 'Needs Clarification'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{isVi ? 'Đã xác minh bước' : 'Step Verified'}</span>
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
              <span>{isVi ? 'Chuyển đến Bước' : 'Jump to Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px]">
            {/* Context Badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {isVi
                    ? 'Cuộc trò chuyện gắn với Tác vụ INS-1042 · Bước 2: Đặt vào khay'
                    : 'Thread anchored to Task INS-1042 · Step 2: Place in tray'}
                </span>
              </span>
            </div>

            {/* Message 1: Minh asks clarification */}
            <div className="flex items-start gap-3">
              <MinhAvatar size="w-8 h-8" name="M" />
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-900">
                    {isVi ? 'Minh (Nhân viên)' : 'Minh (Worker)'}
                  </span>
                  <span>10:02 AM</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold text-[9px]">
                    {isVi ? 'Làm rõ bước' : 'Step Clarification'}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-800 shadow-2xs leading-relaxed">
                  {state.activeContribution?.text ||
                    (isVi
                      ? 'Chúng ta có thể dùng Khay B thay vì Khay A cho các sản phẩm sản lượng lớn không?'
                      : 'Can we use Tray B instead of Tray A for high-volume units?')}
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    {isVi
                      ? 'Được đánh dấu trực tiếp tại Bước 2 để tránh làm dừng toàn bộ chuyền sản xuất.'
                      : 'Flagged directly at Step 2 to avoid stopping the entire line.'}
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
                      {isVi ? 'Trưởng nhóm đã xác nhận' : 'Lead Verified'}
                    </span>
                    <span>10:14 AM</span>
                    <span className="font-bold text-slate-900">
                      {isVi ? 'An (Trưởng nhóm)' : 'An (Team lead)'}
                    </span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-3.5 text-xs text-left shadow-2xs leading-relaxed">
                    {isVi ? (
                      <>
                        Câu hỏi rất hay, Minh! Bạn nói đúng — các cụm nên chuyển sang{' '}
                        <strong className="underline font-bold">Khay B</strong>. Tôi đã cập nhật chỉ dẫn và xác minh Bước 2.
                      </>
                    ) : (
                      <>
                        Great question, Minh! You&apos;re right — the units should go to{' '}
                        <strong className="underline font-bold">Tray B</strong>. I&apos;ve updated the instruction and verified Step 2.
                      </>
                    )}
                    <div className="mt-2 pt-2 border-t border-emerald-500/80 text-[10px] text-emerald-100 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>
                        {isVi
                          ? 'Đã đóng dấu nguồn gốc vào Quy chuẩn làm việc v2.0'
                          : 'Provenance stamp applied to Standard Work v2.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : isClarificationState ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {isVi
                      ? 'Đang chờ Trưởng nhóm An phê duyệt để cập nhật điểm đến Bước 2.'
                      : "Awaiting An's lead approval to update Step 2 destination."}
                  </span>
                </div>
                <button
                  onClick={() => setGoldenFlowState(3)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-200" />
                  <span>{isVi ? 'Mô phỏng Phê duyệt' : 'Simulate Approval'}</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-white border-t border-slate-200/80">
            {/* Quick Prepared Response Chips for Deaf Worker */}
            {!isFacilitator && (
              <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
                <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
                  <span>⚡</span>
                  <span>{isVi ? 'Câu mẫu 1-chạm:' : 'Quick Presets:'}</span>
                </span>
                {[
                  { label: isVi ? 'Khay A đã đầy, xin đổi sang Khay B' : 'Tray A full, swap to Tray B', icon: '✋' },
                  { label: isVi ? 'Thiếu tem kiểm định KCS xanh lá' : 'Missing green QA labels', icon: '❓' },
                  { label: isVi ? 'Cần Quản lý An hỗ trợ tại Trạm 04' : 'Need Lead An at Station 04', icon: '🤝' },
                  { label: isVi ? 'Đã hoàn tất kiểm tra 2 bo mạch' : 'Completed check on 2 units', icon: '✅' },
                  { label: isVi ? 'Đã hiểu chỉ dẫn & đang thao tác' : 'Understood & in progress', icon: '👍' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset.label)}
                    className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-2.5 py-1 rounded-lg transition shrink-0 flex items-center gap-1 text-slate-700 shadow-2xs"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="relative rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 transition bg-slate-50/50">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isFacilitator
                    ? (isVi ? 'Nhập chỉ đạo hoặc nói qua mic để AI gửi phụ đề cho Minh...' : 'Type directives or dictate via mic to send subtitles to Minh...')
                    : (isVi ? 'Nhập tin nhắn trao đổi hoặc chọn câu mẫu nhanh ở trên...' : 'Type message or choose a quick preset above...')
                }
                className="w-full px-4 py-3 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-white rounded-b-2xl">
                <div className="flex items-center gap-2">
                  {isFacilitator && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        state.isRecordingSpeech
                          ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {state.isRecordingSpeech ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Đang lắng nghe...' : 'Listening...'}</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isVi ? 'Nói qua mic (Phụ đề)' : 'Dictate (Subtitles)'}</span>
                        </>
                      )}
                    </button>
                  )}

                  <span className="text-[11px] text-slate-400">
                    {isVi ? 'Đính kèm INS-1042' : 'Attached to INS-1042'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>{isVi ? 'Gửi' : 'Send'}</span>
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
