import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  AlertTriangle,
  FileCheck2,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { state, setScreen } = useHandoff();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'in_progress' | 'completed' | 'all'>('my_tasks');

  const isVerified = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';
  const isClarifying = state.lifecycleStage === 'worker_sent';

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2">
            <span>{t('home.greeting', 'Chào buổi sáng, Minh')}</span>
            <span>👋</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-blue-600 font-bold">Trạm 04 · Dây chuyền A</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.home', 'Nhiệm vụ & Trạm làm việc')}
          </h1>
          <p className="text-slate-600 text-base mt-1">
            {t('home.line_subtitle', "Dây chuyền lắp ráp A · Tất cả quy trình thao tác chuẩn (SOP) trực quan cho ca trực hôm nay.")}
          </p>
        </div>

        {/* Handwritten Motivational Note */}
        <div className="hidden sm:flex items-center gap-1.5 text-right transform rotate-[-2deg] bg-blue-50/80 px-4 py-2 rounded-2xl border border-blue-100">
          <span className="font-handwriting text-blue-700 text-2xl font-bold tracking-wide">
            {t('brand.motto', 'Cùng một đội ngũ. Tương lai tươi sáng hơn.')}
          </span>
          <div className="text-emerald-500 flex gap-0.5 ml-1 font-extrabold text-sm">
            <span>/</span>
            <span>|</span>
            <span>\</span>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Task Feed (Left) & Summary Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Filter Tabs & Task Cards */}
        <div className="lg:col-span-8 space-y-5">
          {/* Filter Pills - Larger and more accessible */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-sm select-none">
            <button
              onClick={() => setActiveTab('my_tasks')}
              className={`px-4 py-2 rounded-full font-bold transition flex items-center gap-2 ${
                activeTab === 'my_tasks'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Nhiệm vụ của tôi</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === 'my_tasks' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                4
              </span>
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-4 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                activeTab === 'in_progress'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Đang thao tác</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                1
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Đã hoàn tất</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                12
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Tất cả quy trình</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                26
              </span>
            </button>
          </div>

          {/* TASK CARDS STACK */}
          <div className="space-y-4">
            {/* SIGNATURE ACTIVE TASK: INS-1042 (ADC Stage 4 Onboarding & Visual SOP Anchor) */}
            <div
              id="card-active-workstation-task"
              className="bg-white rounded-2xl p-5 border-2 border-blue-500/80 shadow-md transition relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

              <div className="flex flex-col sm:flex-row items-start gap-5 pt-1">
                {/* Visual Step Thumbnail with Badge */}
                <div className="w-full sm:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow-sm relative group-hover:border-blue-400 transition">
                  <RealisticPhoto
                    type={isVerified ? 'tray-b' : 'inspect-unit'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-extrabold backdrop-blur-xs">
                    Bước 2 / 4: {isVerified ? 'Khay B' : 'Khay A'}
                  </div>
                </div>

                {/* Task Body & Stage 4 Signature Proof */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-600 text-white tracking-wide">
                      TRẠM HIỆN TẠI: INS-1042
                    </span>

                    {isVerified ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs animate-soft-pulse">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã xác minh: Đổi sang Khay B lúc 10:14 AM</span>
                      </span>
                    ) : isClarifying ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Đang đợi Quản lý xác nhận đổi Khay B</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Đang thực hiện (Ca sáng)</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      Đóng gói cụm linh kiện hoàn tất (Universal SOP)
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Dây chuyền A · Thao tác kiểm tra, đặt khay đệm, dán nhãn &amp; bàn giao kệ tiếp theo.
                    </p>
                  </div>

                  {/* Stage 4 Evidence Guarantee Tag */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isVerified
                        ? 'Bằng chứng lưu vết: Quản lý An đã xác nhận đổi Khay B. Miễn trừ lỗi quy trình cho Minh.'
                        : 'Lưu vết tự động 2 chiều: Minh luôn được bảo vệ quyền lợi khi làm theo chỉ dẫn.'}
                    </span>
                  </div>

                  {/* Single Clear Primary CTA Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      id="btn-open-workstation"
                      onClick={() => setScreen('worker_detail')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition transform active:scale-98"
                    >
                      <span>Tiếp tục trạm thao tác (Bước 2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
                      ~ 5 phút · Có video thủ ngữ VSL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Card 2: Check parts in Tray B */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              <div className="w-full sm:w-40 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="tray-b" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Phản hồi mới
                  </span>
                  <span className="text-xs text-slate-400">Cập nhật lúc 10:14 AM</span>
                  <span className="text-xs font-bold text-slate-500">INS-1043</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Kiểm tra linh kiện tại Khay B
                </h3>
                <p className="text-xs text-slate-500 font-medium">Dây chuyền A · Vị trí đệm số 2</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 3 phút
                  </span>
                  <span>•</span>
                  <span>Quy trình chuẩn</span>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 3: Add "Completed" label */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              <div className="w-full sm:w-40 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="completed-label" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Bản chuẩn đã duyệt
                  </span>
                  <span className="text-xs text-slate-400">Cập nhật lúc 09:20 AM</span>
                  <span className="text-xs font-bold text-slate-500">INS-1044</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Dán nhãn xanh &ldquo;Completed&rdquo;
                </h3>
                <p className="text-xs text-slate-500 font-medium">Dây chuyền A · Kiểm tra tem KCS</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 4 phút
                  </span>
                  <span>•</span>
                  <span>Quy trình chuẩn</span>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 4: Move to next stage */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              <div className="w-full sm:w-40 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="staging-rack" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Sẵn sàng bắt đầu
                  </span>
                  <span className="text-xs text-slate-400">Phân công ca hôm nay</span>
                  <span className="text-xs font-bold text-slate-500">INS-1045</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Chuyển khay đến kệ trung gian (Line B Buffer)
                </h3>
                <p className="text-xs text-slate-500 font-medium">Dây chuyền A · Kệ chuyển tiếp</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 2 phút
                  </span>
                  <span>•</span>
                  <span>Quy trình chuẩn</span>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary, Workplace Justice & Protection (ADC Stage 4 & 5 Core) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Shift Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Trạng thái ca trực: Tốt &amp; Rõ ràng
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mọi vướng mắc về Khay A đã được Quản lý An giải đáp và cập nhật chính thức. Không có tắc nghẽn ở trạm 04.
            </p>
          </div>

          {/* Card 2: Workplace Justice & Career Passport (STAGE 4 & 5 HEART) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-5 border border-slate-700 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-600/50">
                ADC STAGE 4 &amp; 5 CORE
              </span>
              <span className="text-xs font-extrabold text-emerald-400">Độ chính xác: 99.8%</span>
            </div>
            <div>
              <h4 className="font-black text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Hồ sơ bảo vệ &amp; Hộ chiếu năng lực</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Mọi chỉ đạo miệng đều được số hóa lưu vết bất biến. Công nhân khiếm thính được bảo vệ 100% khỏi bị quy kết lỗi oan, tích lũy bằng chứng để tiến tới ký Hợp đồng chính thức 12M–15M VNĐ.
              </p>
            </div>
            <button
              onClick={() => setScreen('accountability')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Xem Hồ sơ xác minh &amp; Bằng chứng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Contextual Broadcast Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Hoạt động trạm gần đây</h3>
              <button
                onClick={() => setScreen('messages')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Xem tất cả
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Quản lý An đã duyệt đổi Khay B
                </p>
                <span className="text-xs text-slate-400">10:14 AM · Đã lưu vết bằng chứng</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Minh gửi câu hỏi làm rõ Khay A bị đầy
                </p>
                <span className="text-xs text-slate-400">10:12 AM · Báo cờ vàng trạm 04</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Hoàn tất kiểm tra cụm camera INS-1042
                </p>
                <span className="text-xs text-slate-400">08:05 AM · Đúng tiêu chuẩn KCS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
