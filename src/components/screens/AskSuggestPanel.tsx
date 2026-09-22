import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Send,
  X,
  CheckCircle2,
  MessageSquarePlus,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  Volume2,
} from 'lucide-react';

export const AskSuggestPanel: React.FC = () => {
  const {
    state,
    setScreen,
    sendWorkerContribution,
    startSpeechRecording,
    stopSpeechRecording,
    switchPersona,
  } = useHandoff();
  const { t, isVi } = useLanguage();
  const [activeTab, setActiveTab] = useState<'instructions' | 'materials' | 'quality' | 'history'>('instructions');

  const defaultQuestion = isVi
    ? 'Có thể dùng Khay B thay vì Khay A cho các kiện hàng lớn không?'
    : 'Can we use Tray B instead of Tray A for high-volume units?';

  const [messageText, setMessageText] = useState(defaultQuestion);
  const [sentNotice, setSentNotice] = useState(false);

  const quickPrompts = isVi
    ? [
        'Có thể dùng Khay B thay vì Khay A cho các kiện hàng lớn không?',
        'Khay A đã đầy thì đặt linh kiện hoàn tất vào đâu?',
        'Có bắt buộc dán nhãn Completed xanh trước khi chuyển kệ không?',
      ]
    : [
        'Can we use Tray B instead of Tray A for high-volume units?',
        'Where do we place finished units if Tray A is already full?',
        'Is the green Completed label required before moving to staging?',
      ];

  const handleVoiceToggle = () => {
    if (state.isRecordingSpeech) {
      stopSpeechRecording();
    } else {
      startSpeechRecording();
      // Simulate real-time speech dictation after 1.8 seconds
      setTimeout(() => {
        setMessageText(
          isVi
            ? 'Có thể dùng Khay B thay vì Khay A không? Lô hàng Dây chuyền A hôm nay có vẻ nhiều hơn.'
            : 'Can we use Tray B instead of Tray A? The batch volume on Line A seems higher today.'
        );
        stopSpeechRecording();
      }, 1800);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendWorkerContribution('Destination', messageText);
    setSentNotice(true);
    setTimeout(() => {
      // Direct to facilitator workspace and switch perspective to An
      switchPersona('facilitator');
      setScreen('facilitator');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top breadcrumb & task pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Quay lại nhiệm vụ của tôi' : 'Back to my tasks'}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {isVi ? 'Nhiệm vụ 3 / 8' : 'Task 3 of 8'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScreen('worker_detail')}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title={isVi ? 'Nhiệm vụ trước' : 'Previous task'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScreen('facilitator')}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition"
              title={isVi ? 'Nhiệm vụ kế tiếp' : 'Next task'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT MAIN AREA (7 cols): Task "Pack finished assemblies" & Steps */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                {isVi ? 'ĐANG THỰC HIỆN' : 'IN PROGRESS'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {isVi ? 'Dây chuyền A' : 'Assembly Line A'}
              </span>
              <span className="text-xs text-slate-400 font-medium">INS-1042</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {isVi ? 'Đóng gói cụm linh kiện hoàn tất' : 'Pack finished assemblies'}
              </h1>
              {/* Cursive quote */}
              <div className="flex items-center gap-1 transform rotate-[-2deg]">
                <span className="font-handwriting text-blue-600 text-xl font-bold">
                  {isVi ? 'Từng bước nhỏ tạo nên hiệu quả lớn.' : 'Small steps make a big impact.'}
                </span>
                <div className="text-emerald-500 flex gap-0.5 ml-1">
                  <span className="font-bold text-xs">/</span>
                  <span className="font-bold text-xs">|</span>
                  <span className="font-bold text-xs">\</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-medium">
              {isVi
                ? 'Đóng gói an toàn các cụm linh kiện hoàn thiện vào đúng khay để xuất xưởng.'
                : 'Safely pack completed assemblies for shipping.'}
            </p>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-600">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 shadow-2xs">
                {isVi ? 'Độ khó: Vừa phải' : 'Medium'}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {isVi ? '~ 10 phút' : '~ 10 minutes'}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                {isVi ? 'Quy trình chuẩn' : 'Standard Work'}
              </span>
            </div>
          </div>

          {/* Instruction Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold select-none">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'instructions'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Chỉ dẫn thao tác' : 'Instructions'}
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'materials'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Vật tư & Khay' : 'Materials'}
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'quality'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Kiểm chuẩn KCS' : 'Quality check'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Lịch sử thay đổi' : 'History'}
            </button>
          </div>

          {/* 4 Steps with Photos */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    {isVi ? 'Chuẩn bị vật tư & khay đệm' : 'Prepare materials'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isVi
                      ? 'Chuẩn bị vật tư đóng gói: thùng carton, đệm xốp chống sốc, băng keo và nhãn giao hàng.'
                      : 'Set up packing materials: box, foam padding, tape, and shipping labels.'}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-36 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                <RealisticPhoto type="prepare-materials" className="w-full h-full" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    {isVi ? 'Bọc đệm bảo vệ cụm linh kiện' : 'Wrap the assembly'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isVi
                      ? 'Cẩn thận bọc cụm bo mạch hoàn chỉnh bằng lớp mút xốp chống tĩnh điện.'
                      : 'Carefully wrap the finished assembly with protective foam.'}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-36 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                <RealisticPhoto type="wrap-assembly" className="w-full h-full" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    {isVi ? 'Đặt vào khay hoặc thùng' : 'Place in box'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isVi
                      ? 'Đặt cụm linh kiện đã bọc đệm vào khay với lớp đệm bổ sung.'
                      : 'Place the wrapped assembly in the box with extra cushioning.'}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-36 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                <RealisticPhoto type="place-in-box" className="w-full h-full" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 transition">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    {isVi ? 'Đóng nắp và dán nhãn' : 'Close and label'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isVi
                      ? 'Đóng khay/thùng, dán băng keo niêm phong và dán nhãn giao hàng lên mặt trên.'
                      : 'Close the box, seal with tape, and attach shipping label on top.'}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-36 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                <RealisticPhoto type="close-and-label" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Bottom Green Card: "You're doing great!" */}
          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              <div>
                <span className="font-bold text-xs text-emerald-950 block">
                  {isVi ? 'Bạn đang làm rất tốt!' : "You're doing great!"}
                </span>
                <p className="text-[11px] text-emerald-900">
                  {isVi
                    ? 'Nếu có bất kỳ điều gì chưa rõ, bạn luôn có thể hỏi hoặc đề xuất thay đổi.'
                    : 'If anything is unclear, you can always ask or suggest a change.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DRAWER / PANEL (5 cols): "Ask or suggest" (Image 2 Primary Anchor) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md space-y-5">
            {/* Drawer Header with Close X */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-base text-slate-950">
                  {isVi ? 'Hỏi hoặc đề xuất' : 'Ask or suggest'}
                </h2>
              </div>
              <button
                onClick={() => setScreen('worker_detail')}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
                title={isVi ? 'Đóng khung' : 'Close drawer'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isVi
                ? 'Có câu hỏi hoặc đề xuất về chỉ dẫn này? Gửi tin nhắn tới Quản lý An. Ý kiến đóng góp của bạn giúp công việc tốt hơn cho tất cả mọi người.'
                : 'Have a question or a suggestion about this instruction? Send a message to An (Team lead). Your input helps make our work better for everyone.'}
            </p>

            {/* Quick Prompts Chip Carousel */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {isVi ? 'Câu hỏi gợi ý nhanh' : 'Quick Prompts'}
              </span>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageText(prompt)}
                    className="text-left px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-xs transition leading-snug"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Lock Banner */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs text-blue-950 block">
                  {isVi ? 'Đây là trao đổi bảo mật' : 'This is a private conversation'}
                </span>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {isVi
                    ? 'Tin nhắn của bạn chỉ gửi riêng tới Quản lý An và không làm gián đoạn các đồng nghiệp khác.'
                    : "Your message will only be seen by An (Team lead) and won't disrupt other team members."}
                </p>
              </div>
            </div>

            {/* Form Composer with Voice Dictation */}
            <form onSubmit={handleSend} className="space-y-3">
              <div className="relative">
                <textarea
                  id="ask-suggest-textarea"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    isVi
                      ? 'Nhập câu hỏi, đề xuất của bạn hoặc nói qua mic...'
                      : 'Type your question or suggestion, or use voice dictation...'
                  }
                  className="w-full rounded-2xl border border-slate-200 p-3.5 pb-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none leading-relaxed"
                />

                {/* Bottom Bar inside textarea: character count */}
                <div className="absolute bottom-2.5 right-3 flex items-center justify-end text-[11px]">
                  <span className="font-medium text-slate-400">
                    {messageText.length} / 500
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setScreen('worker_detail')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  id="btn-send-to-facilitator"
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <span>{isVi ? 'Gửi tới Quản lý' : 'Send to facilitator'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {sentNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {isVi
                    ? "Đã gửi tin nhắn! Đang chuyển sang màn hình của Quản lý An..."
                    : "Message sent! Switching to An's workspace view..."}
                </span>
              </div>
            )}

            {/* Conversation History Section */}
            <div className="border-t border-slate-100 pt-4 space-y-3.5">
              {/* Worker message */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MinhAvatar size="w-6 h-6" name="M" />
                  <span className="font-bold text-xs text-slate-900">
                    {isVi ? 'Minh (Bạn)' : 'Minh (You)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isVi ? 'Hôm nay lúc 9:42 AM' : 'Today at 9:42 AM'}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-800 leading-relaxed border border-slate-100 ml-8">
                  {isVi
                    ? 'Có thể đổi sang xếp linh kiện vào Khay B thay vì thùng carton không? Em thấy làm vậy sẽ nhanh và thuận tiện hơn cho đội.'
                    : 'Would it be possible to place the items in Tray B instead of a box? I think it might be faster and easier for our team.'}
                </div>
              </div>

              {/* Facilitator reply */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <AnAvatar size="w-6 h-6" />
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">An</span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-bold border border-amber-300">
                      {isVi ? 'Tổ trưởng ca' : 'Team lead'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {isVi ? 'Hôm nay lúc 10:14 AM' : 'Today at 10:14 AM'}
                  </span>
                </div>
                <div className="bg-blue-50/80 rounded-2xl p-3 text-xs text-slate-900 leading-relaxed border border-blue-100 ml-8">
                  {isVi
                    ? 'Đề xuất rất tuyệt vời Minh ơi! Anh đồng ý đổi sang Khay B sẽ hiệu quả hơn nhiều. Anh sẽ cập nhật ngay quy trình và báo cho em khi hoàn tất. Cảm ơn em! 🙌'
                    : "That's a great suggestion! I agree it could be more efficient. I'll update the instruction and let you know as soon as it's live. Thanks for sharing! 🙌"}
                </div>
              </div>

              {/* Instruction updated status badge */}
              <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-3.5 space-y-1 shadow-2xs ml-8">
                <div className="flex items-center justify-between text-emerald-800 text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {isVi ? 'Quy trình đã cập nhật' : 'Instruction updated'}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {isVi ? 'Hôm nay lúc 10:20 AM' : 'Today at 10:20 AM'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  {isVi
                    ? 'Chỉ dẫn thao tác đã được cập nhật chính thức dựa trên đề xuất này. Cảm ơn bạn đã chung tay giúp công việc tốt hơn!'
                    : 'The instruction has been updated based on this suggestion. Thanks for helping make our work better!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

