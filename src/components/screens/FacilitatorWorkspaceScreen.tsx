import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';
import {
  ArrowLeft,
  MoreHorizontal,
  Clock,
  Send,
  CheckCircle2,
  Edit3,
  Plus,
  ArrowRight,
  HelpCircle,
  FileText,
  Lock,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const FacilitatorWorkspaceScreen: React.FC = () => {
  const {
    state,
    setScreen,
    updateFacilitatorDrafts,
    shareFacilitatorUpdateAndReply,
  } = useHandoff();

  const { t, isVi } = useLanguage();

  const [activeTab, setActiveTab] = useState<'instructions' | 'discussion' | 'changes' | 'related'>('instructions');
  const [replyText, setReplyText] = useState(
    state.facilitatorDraftReply ||
      (isVi
        ? 'Câu hỏi của Minh rất hay! Đúng vậy, các kiện hàng nên chuyển sang Khay B. Quản lý đã cập nhật chỉ dẫn.'
        : "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction.")
  );
  const [selectedDestination, setSelectedDestination] = useState(state.facilitatorDraftDestination || 'Tray B');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);

  const handleGenerateAiDraft = () => {
    setIsGeneratingAiDraft(true);
    setTimeout(() => {
      setReplyText(
        isVi
          ? 'Câu hỏi của Minh rất hay! Đúng vậy — các cụm linh kiện hoàn tất trên Dây chuyền A từ hôm nay sẽ chuyển sang Khay B (thay vì Khay A). Quản lý đã cập nhật Bước 2 và đính kèm ảnh thực tế của Khay B để cả ca cùng rõ. Cảm ơn Minh đã phát hiện và phản ánh kịp thời!'
          : "Great question, Minh! You're right — the finished units on Assembly Line A should go to Tray B (not Tray A) starting today. I've updated Step 2 and attached an updated photo of Tray B so everyone is clear. Thank you for flagging this!"
      );
      setSelectedDestination('Tray B');
      setIsGeneratingAiDraft(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFacilitatorDrafts(replyText, selectedDestination, '13:30 (UTC+07)');
    shareFacilitatorUpdateAndReply(replyText, selectedDestination, '13:30 (UTC+07)');
    setSuccessToast(true);
    setTimeout(() => {
      setScreen('review_publish');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Integrated Breadcrumb & Context Header */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setScreen('home')}
            className="hover:text-blue-600 flex items-center gap-1.5 font-bold transition text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Trang điều hành ca' : 'Shift Hub'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-600">{isVi ? 'Dây chuyền A' : 'Line A'}</span>
          <span>/</span>
          <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            SOP INS-1042
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {t('facilitator.editing_as')}{' '}
            <strong className="text-slate-800">
              An ({t('persona.lead_title')})
            </strong>
          </span>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Facilitator Instruction Editor View */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                {t('facilitator.shared_draft')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {isVi ? 'Dây chuyền A' : 'Assembly Line A'}
              </span>
              <span className="text-xs text-slate-400 font-medium">INS-1042</span>
            </div>

            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {t('facilitator.title')}
              </h1>
            </div>

            <p className="text-sm text-slate-600 font-medium">
              {isVi
                ? 'Thiết lập quy trình đóng gói linh kiện bàn giao ca 1.'
                : 'Setting up the packing workflow for shift 1 handoff.'}
            </p>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-600">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 shadow-2xs">
                {t('worker_detail.difficulty')}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~ 15 {isVi ? 'phút' : 'minutes'}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                {t('home.standard_work')}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                {isVi ? 'Dây chuyền A' : 'Assembly Line A'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold select-none">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'instructions'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Quy trình SOP' : 'Instructions'}
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'discussion'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Trao đổi (2)' : 'Discussion (2)'}
            </button>
            <button
              onClick={() => setActiveTab('changes')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'changes'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Lịch sử thay đổi (3)' : 'Changes (3)'}
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'related'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isVi ? 'Tài liệu liên quan (2)' : 'Related (2)'}
            </button>
          </div>

          {/* Step-by-step instructions card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900">
                {t('worker_detail.steps_heading')}
              </h2>
              <div className="flex items-center gap-2">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Thêm bước' : 'Add step'}</span>
                </button>
              </div>
            </div>

            {/* Step List */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {t('worker_detail.step1_title')}
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step1_desc')}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="inspect-unit" className="w-full h-full" />
                </div>
              </div>

              {/* Step 2 (Highlighted with Green or Amber) */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3.5 rounded-xl bg-emerald-50/40 border-2 border-emerald-400 shadow-2xs transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {t('worker_detail.step2_title')}
                      </h3>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {isVi ? 'Đang chỉnh sửa theo góp ý' : 'Aligning to feedback'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {isVi ? 'Nhẹ nhàng đặt cụm linh kiện hoàn thành vào ' : 'Gently place the finished unit in '}
                      <strong className="text-emerald-800 font-extrabold underline">
                        {selectedDestination}
                      </strong>.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border-2 border-emerald-400 shadow-2xs">
                  <RealisticPhoto type="tray-b" className="w-full h-full" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {t('worker_detail.step3_title')}
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step3_desc')}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="completed-label" className="w-full h-full" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    4
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {t('worker_detail.step4_title')}
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t('worker_detail.step4_desc')}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="staging-rack" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Worker Feedback & Atomic Reply */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Latest worker feedback from Minh */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                {isVi ? 'Phản hồi từ công nhân' : 'Latest worker feedback'}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">{isVi ? 'Hôm nay lúc 9:48 AM' : 'Today at 9:48 AM'}</span>
            </div>

            <div className="flex items-start gap-3">
              <MinhAvatar size="w-8 h-8" name="M" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900">Minh</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {isVi ? 'Nhân viên mới · Dây chuyền A' : 'New team member · Line A'}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-800 leading-relaxed border border-slate-100">
                  {state.workerQuestion ||
                    (isVi
                      ? 'Cho em hỏi mình còn để hàng vào Khay A không? Em thấy khay mới nên chưa rõ. Có cần bổ sung hình ảnh vị trí khay mới không ạ?'
                      : "Just checking — do we still put the finished units in Tray A? I saw a new tray setup and wasn't sure. Also, would it be helpful to add a photo of the correct layout?")}
                </div>
              </div>
            </div>

            {/* AI Suggestion Pill for Facilitator */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1 text-[11px]">
                <span className="font-bold text-amber-950 block">
                  {isVi ? 'Khuyến nghị làm rõ từ AI Mentor' : 'Clarification Recommendation'}
                </span>
                <p className="text-amber-900 leading-relaxed">
                  {isVi
                    ? 'Công nhân đã phát hiện sự khác biệt trên chuyền. Hãy ghi nhận sáng kiến của công nhân và đồng bộ Bước 2 sang Khay B.'
                    : 'Worker observed visual difference on the floor. Affirm their initiative and align Step 2 with the actual Tray B physical setup.'}
                </p>
                <button
                  type="button"
                  onClick={handleGenerateAiDraft}
                  disabled={isGeneratingAiDraft}
                  className="mt-1 text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 underline"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>
                    {isGeneratingAiDraft
                      ? (isVi ? 'Đang tạo bản nháp...' : 'Generating draft...')
                      : (isVi ? 'Chèn câu phản hồi đồng thuận có AI hỗ trợ' : 'Insert AI-assisted aligned response')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Your reply (to Minh) & Atomic update */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <AnAvatar size="w-6 h-6" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isVi ? 'Phản hồi của bạn (Gửi Minh)' : 'Your reply (to Minh)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivateNote(!isPrivateNote)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                {isPrivateNote ? <Lock className="w-3.5 h-3.5" /> : null}
                <span>{isPrivateNote ? (isVi ? 'Ghi chú nội bộ' : 'Private note') : (isVi ? 'Chuyển sang ghi chú nội bộ' : 'Switch to private note')}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                id="facilitator-reply-textarea"
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isVi ? 'Nhập nội dung phản hồi gửi công nhân Minh...' : 'Write your response to Minh...'}
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition resize-none leading-relaxed"
              />

              {/* Sub-card: Update to instruction (happens together) */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">
                    {isVi ? 'Cập nhật chỉ dẫn thao tác (Đồng bộ tức thì)' : 'Update to instruction (happens together)'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {isVi ? 'Lưu vết tự động' : 'Atomic handoff'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{t('worker_detail.step2_title')}</span>
                    <span className="text-[11px] text-slate-500">{t('facilitator.destination_label')}:</span>
                  </div>

                  {/* Destination selection buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDestination('Tray B')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition border ${
                        selectedDestination === 'Tray B'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Tray B ({isVi ? 'Khuyên dùng' : 'Recommended'})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDestination('Tray A')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition border ${
                        selectedDestination === 'Tray A'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isVi ? 'Giữ Khay A' : 'Keep Tray A'}
                    </button>
                  </div>

                  {/* Before vs After */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-slate-500">
                    <div className="line-through text-slate-400">
                      {isVi ? 'Trước: "Đặt cụm linh kiện vào Khay A."' : 'Before: "Place the finished unit in Tray A."'}
                    </div>
                    <div className="text-slate-900 font-semibold flex items-center gap-1.5 text-emerald-800">
                      <span>{isVi ? `Sau: "Đặt cụm linh kiện vào ${selectedDestination}."` : `After: "Place the finished unit in ${selectedDestination}."`}</span>
                    </div>
                  </div>

                  {/* Tray thumbnail preview */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-emerald-300 shrink-0">
                      <RealisticPhoto type="tray-b" className="w-full h-full" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        ✓ {isVi ? 'Đã thêm ảnh thực tế của Khay B' : 'Verified photo of Tray B added'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {isVi ? 'Cập nhật dựa trên câu hỏi của Minh. Đã kiểm duyệt bởi Quản lý An.' : "Updated based on Minh's question. Verified by An (Lead)."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share update & reply CTA button */}
              <div className="space-y-2 pt-1">
                <button
                  id="btn-share-update-and-reply"
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('facilitator.approve_btn')}</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  {isVi
                    ? 'Thao tác này sẽ đồng bộ quy trình SOP và gửi phản hồi kèm âm thanh loa TTS tới Minh.'
                    : 'This will atomically update the instruction and send your verified reply to Minh.'}
                </p>
              </div>
            </form>

            {successToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('facilitator.success_toast')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
