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
  ShieldAlert,
  Bot,
  UserCheck,
  Send,
  Zap,
} from 'lucide-react';

// ==========================================
// 1. WORKER VIEW (MINH - DEAF / HARD OF HEARING)
// ==========================================
const WorkerHomeView: React.FC = () => {
  const { state, setScreen } = useHandoff();
  const { t, isVi } = useLanguage();
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'in_progress' | 'completed' | 'all'>('my_tasks');

  const isVerified = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';
  const isClarifying = state.lifecycleStage === 'worker_sent';

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2">
            <span>{t('home.greeting')}</span>
            <span>👋</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-blue-600 font-bold">{t('home.station_line')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {t('nav.home')}
          </h1>
          <p className="text-slate-600 text-base mt-1">
            {t('home.line_subtitle')}
          </p>
        </div>

        {/* Handwritten Motivational Note */}
        <div className="hidden sm:flex items-center gap-1.5 text-right transform rotate-[-2deg] bg-blue-50/80 px-4 py-2 rounded-2xl border border-blue-100">
          <span className="font-handwriting text-blue-700 text-2xl font-bold tracking-wide">
            {t('brand.motto')}
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
          {/* Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-sm select-none">
            <button
              onClick={() => setActiveTab('my_tasks')}
              className={`px-4 py-2 rounded-full font-bold transition flex items-center gap-2 ${
                activeTab === 'my_tasks'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{t('home.tab_my_tasks')}</span>
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
              <span>{t('home.tab_in_progress')}</span>
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
              <span>{t('home.tab_completed')}</span>
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
              <span>{t('home.tab_all')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                26
              </span>
            </button>
          </div>

          {/* TASK CARDS STACK */}
          <div className="space-y-4">
            {/* SIGNATURE ACTIVE TASK: INS-1042 */}
            <div
              id="card-active-workstation-task"
              className="bg-white rounded-2xl p-5 border-2 border-blue-500/80 shadow-md transition relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

              <div className="flex flex-col sm:flex-row items-start gap-5 pt-1">
                <div className="w-full sm:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow-sm relative group-hover:border-blue-400 transition">
                  <RealisticPhoto
                    type={isVerified ? 'tray-b' : 'inspect-unit'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-extrabold backdrop-blur-xs">
                    {isVerified ? t('home.step_2_tray_b') : t('home.step_2_tray_a')}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-600 text-white tracking-wide">
                      {t('home.current_station_badge')}
                    </span>

                    {isVerified ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs animate-soft-pulse">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t('home.verified_status')}</span>
                      </span>
                    ) : isClarifying ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>{t('home.clarifying_status')}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{t('home.in_progress_status')}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {t('home.task_title')}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {t('home.task_desc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isVerified ? t('home.evidence_verified') : t('home.evidence_unverified')}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      id="btn-open-workstation"
                      onClick={() => setScreen('worker_detail')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition transform active:scale-98"
                    >
                      <span>{t('home.continue_workstation')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Card 2 */}
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
                    {t('home.card2_tag')}
                  </span>
                  <span className="text-xs text-slate-400">{isVi ? 'Cập nhật lúc 10:14 AM' : 'Updated at 10:14 AM'}</span>
                  <span className="text-xs font-bold text-slate-500">INS-1043</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  {t('home.card2_title')}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{t('home.card2_desc')}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ {isVi ? '3 phút' : '3 mins'}
                  </span>
                  <span>•</span>
                  <span>{t('home.standard_work')}</span>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 3 */}
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
                    {t('home.card3_tag')}
                  </span>
                  <span className="text-xs text-slate-400">{isVi ? 'Cập nhật lúc 09:20 AM' : 'Updated at 09:20 AM'}</span>
                  <span className="text-xs font-bold text-slate-500">INS-1044</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  {t('home.card3_title')}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{t('home.card3_desc')}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ {isVi ? '4 phút' : '4 mins'}
                  </span>
                  <span>•</span>
                  <span>{t('home.standard_work')}</span>
                </div>
              </div>
              <div className="self-end sm:self-center shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 4 */}
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
                    {t('home.card4_tag')}
                  </span>
                  <span className="text-xs text-slate-400">{isVi ? 'Phân công ca hôm nay' : 'Assigned today'}</span>
                  <span className="text-xs font-bold text-slate-500">INS-1045</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  {t('home.card4_title')}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{t('home.card4_desc')}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ {isVi ? '2 phút' : '2 mins'}
                  </span>
                  <span>•</span>
                  <span>{t('home.standard_work')}</span>
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

        {/* RIGHT COLUMN: Summary & Career Passport */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Shift Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {t('home.shift_status_title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('home.shift_status_desc')}
            </p>
          </div>

          {/* Card 2: Workplace Justice & Career Passport */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-5 border border-slate-700 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-600/50">
                ADC STAGE 4 &amp; 5 CORE
              </span>
              <span className="text-xs font-extrabold text-emerald-400">{t('home.passport_accuracy')}</span>
            </div>
            <div>
              <h4 className="font-black text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t('home.passport_title')}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {t('home.passport_desc')}
              </p>
            </div>
            <button
              onClick={() => setScreen('accountability')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t('home.passport_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Contextual Broadcast Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{t('home.recent_activity')}</h3>
              <button
                onClick={() => setScreen('messages')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {t('home.view_all')}
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {t('home.activity_1')}
                </p>
                <span className="text-xs text-slate-400">{t('home.activity_1_time')}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {t('home.activity_2')}
                </p>
                <span className="text-xs text-slate-400">{t('home.activity_2_time')}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {t('home.activity_3')}
                </p>
                <span className="text-xs text-slate-400">{t('home.activity_3_time')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MANAGER VIEW (AN - SHIFT LEAD & FACILITATOR)
// ==========================================
const ManagerHomeView: React.FC = () => {
  const { state, setScreen, shareFacilitatorUpdateAndReply, triggerSafetyAlert } = useHandoff();
  const { t, isVi } = useLanguage();

  const isVerified = state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied';
  const isClarifying = state.lifecycleStage === 'worker_sent';

  const handleQuickApprove = () => {
    shareFacilitatorUpdateAndReply(
      isVi
        ? 'Xác nhận phản hồi từ Quản lý An: Đồng ý đổi sang Khay B cho các kiện hàng lớn. Đã cập nhật và lưu vết SOP v2.0!'
        : "Confirmed by Lead An: Approved switching to Tray B for high-volume units. SOP v2.0 is updated and audit-stamped!",
      'Tray B',
      '11:30 AM (UTC+07)'
    );
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* 1. Manager Header & Shift Control Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="text-sm font-bold text-amber-600 mb-1 flex items-center gap-2">
            <span>{isVi ? 'Trung tâm Điều phối Ca trực · Quản lý An 👔' : 'Shift Operations Hub · Lead An 👔'}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-slate-500 font-semibold">{isVi ? 'Giám sát Dây chuyền A · Ca 1' : 'Line A Supervisor · Shift 1'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {isVi ? 'Tổng quan Vận hành & Phê duyệt Ca' : 'Shift Command & Live Approval Hub'}
          </h1>
          <p className="text-slate-600 text-base mt-1">
            {isVi
              ? 'Theo dõi 4 trạm Dây chuyền A theo thời gian thực. Hỗ trợ tức thì cho công nhân khiếm thính và bảo chứng chất lượng.'
              : 'Real-time oversight across 4 workstations. Instant visual clarification support for Deaf team members.'}
          </p>
        </div>

        {/* Motivational Motto */}
        <div className="hidden sm:flex items-center gap-1.5 text-right transform rotate-[-2deg] bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200">
          <span className="font-handwriting text-amber-800 text-2xl font-bold tracking-wide">
            {isVi ? 'Chỉ dẫn tốt hơn. Tương lai sáng hơn.' : 'Better instructions. Brighter tomorrows.'}
          </span>
          <div className="text-emerald-500 flex gap-0.5 ml-1 font-extrabold text-sm">
            <span>/</span>
            <span>|</span>
            <span>\</span>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Stations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-600">{isVi ? 'Trạm đang vận hành' : 'Active Stations'}</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">4 / 4</div>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isVi ? '100% đúng tiến độ ca' : '100% on schedule'}</span>
          </p>
        </div>

        {/* Metric 2: Pending Clarifications */}
        <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
          !isVerified ? 'bg-amber-50/80 border-amber-300' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{isVi ? 'Cần làm rõ / Duyệt' : 'Pending Clarification'}</span>
            <AlertTriangle className={`w-4 h-4 ${!isVerified ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-black ${!isVerified ? 'text-amber-700' : 'text-slate-900'}`}>
            {!isVerified ? '1 cần xử lý' : '0 vướng mắc'}
          </div>
          <p className="text-[11px] text-slate-600 font-semibold truncate">
            {!isVerified ? (isVi ? 'Trạm 04: Minh hỏi Khay A/B' : 'Station 04: Minh needs tray') : (isVi ? 'Đã giải quyết tất cả' : 'All clear')}
          </p>
        </div>

        {/* Metric 3: SOP Compliance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-600">{isVi ? 'Tuân thủ quy chuẩn SOP' : 'SOP Compliance'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">99.8%</div>
          <p className="text-[11px] text-slate-500 font-semibold">
            {isVi ? 'Lưu vết kiểm toán 2 chiều' : 'Audited two-way logs'}
          </p>
        </div>

        {/* Metric 4: EHS Blind-corner Safety */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-600">{isVi ? 'Sự cố góc mù / EHS' : 'Blind-Corner EHS'}</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">0</div>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isVi ? 'Đèn LED & AI CAM an toàn' : 'LED Strobes & AI Vision safe'}</span>
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Manager Station Feed (Left) & HR / Shift Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Urgent Approval Banner & 4 Workstation Grid */}
        <div className="lg:col-span-8 space-y-5">
          {/* URGENT / HIGHLIGHT BANNER: Action required on Station 04 */}
          {!isVerified ? (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 rounded-2xl p-5 border-2 border-amber-400 shadow-md space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900 border border-amber-300">
                    {isVi ? 'CẦN QUẢN LÝ DUYỆT GẤP · TRẠM 04' : 'ACTION REQUIRED · STATION 04'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {isVi ? 'Minh vừa gửi lúc 10:12 AM' : 'Sent by Minh at 10:12 AM'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-950">
                  {isVi ? 'Minh (Công nhân khiếm thính) báo vướng mắc Bước 2:' : 'Minh (Deaf Worker) flagged clarification at Step 2:'}
                </h3>
                <div className="bg-white/90 p-3 rounded-xl border border-amber-300/80 text-xs text-slate-800 font-medium italic shadow-2xs">
                  &ldquo;{state.activeContribution?.text || (isVi ? 'Khay A đã đầy. Có thể đổi sang Khay B cho các kiện hàng lớn không?' : 'Can we use Tray B instead of Tray A for high-volume units?')}&rdquo;
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  id="btn-manager-quick-approve"
                  onClick={handleQuickApprove}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-2 active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isVi ? 'Phê duyệt đổi sang Khay B ngay (1 chạm)' : 'Approve switch to Tray B (1 click)'}</span>
                </button>

                <button
                  onClick={() => setScreen('facilitator')}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition flex items-center gap-1.5"
                >
                  <span>{isVi ? 'Mở Không gian Soạn thảo SOP' : 'Open SOP Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/90 rounded-2xl p-5 border-2 border-emerald-400 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-xs text-emerald-900 uppercase tracking-wide">
                    {isVi ? 'ĐÃ DUYỆT THÀNH CÔNG · ĐỒNG BỘ TỚI TRẠM 04 CỦA MINH' : 'APPROVED & SYNCED TO MINH AT STATION 04'}
                  </span>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {isVi ? 'Dấu mộc Provenance hợp lệ' : 'Audited Provenance Stamp'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {isVi
                  ? 'Quản lý An đã xác nhận đổi sang Khay B. Hướng dẫn SOP v2.0 đã tự động cập nhật xuống màn hình trạm 04 của Minh kèm giải trình minh bạch.'
                  : 'Lead An confirmed switching to Tray B. SOP v2.0 is live at Station 04 with an immutable visual audit trail.'}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setScreen('published')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isVi ? 'Xem bản SOP v2.0 đã ban hành' : 'View Published SOP v2.0'}</span>
                </button>
                <button
                  onClick={() => setScreen('facilitator')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
                >
                  {isVi ? 'Chỉnh sửa thêm quy trình' : 'Edit Further'}
                </button>
              </div>
            </div>
          )}

          {/* 4 WORKSTATIONS MONITORING GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>{isVi ? 'Giám sát 4 Trạm thao tác · Dây chuyền A' : 'Assembly Line A · 4 Workstation Monitor'}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  U-Shape Layout
                </span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {isVi ? 'Tầm nhìn không vật cản' : 'Unobstructed sightline'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Station 04: Minh (Featured) */}
              <div
                onClick={() => setScreen('facilitator')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md ${
                  !isVerified
                    ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20'
                    : 'bg-white border-emerald-400 hover:border-emerald-500'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                      Trạm 04 · Minh
                    </span>
                    {!isVerified ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        <span>{isVi ? 'Chờ duyệt Khay' : 'Waiting for approval'}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isVi ? 'Đang làm Khay B' : 'Operating Tray B'}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {isVi ? 'Đóng gói linh kiện hoàn tất (INS-1042)' : 'Pack finished assemblies (INS-1042)'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-snug">
                    {isVi
                      ? 'Nhân sự hòa nhập khiếm thính. Đang kiểm tra cụm bo mạch và dán nhãn KCS.'
                      : 'Deaf specialist. Inspecting connectors and QA green label placement.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>{isVi ? 'Mở chi tiết xử lý trạm' : 'Open station details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Station 01: Lan */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      Trạm 01 · Lan
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{isVi ? 'Hoàn thành 12/12' : '12/12 Complete'}</span>
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {isVi ? 'Kiểm tra độ khít cáp & đầu nối' : 'Inspect connectors & cable seating'}
                  </h4>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isVi ? 'Đồng minh nghe · Bạn đồng hành sơ tán khẩn cấp (Buddy) của Minh.' : 'Hearing ally · Minh’s emergency evacuation buddy.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{isVi ? 'Tiến độ: Đúng giờ' : 'Pacing: On time'}</span>
                  <span className="text-emerald-600 font-bold">100% QA Pass</span>
                </div>
              </div>

              {/* Station 02: Đức */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      Trạm 02 · Đức
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      8 / 10 cụm
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {isVi ? 'Lắp giắc cắm camera và cáp dẹt' : 'Attach camera ribbon & secure clip'}
                  </h4>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isVi ? 'Thao tác liên tục · Giao tiếp mắt chữ U với Trạm 04.' : 'Continuous flow · Direct U-shape sightline with Station 04.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{isVi ? 'Thời gian chu kỳ: 45 giây' : 'Cycle time: 45s'}</span>
                  <span className="text-blue-600 font-bold">{isVi ? 'Bình thường' : 'Normal'}</span>
                </div>
              </div>

              {/* Station 03: Hương */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      Trạm 03 · Hương
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {isVi ? 'Sẵn sàng nhận khay' : 'Ready for tray'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {isVi ? 'Dán tem KCS xanh & Đóng seal' : 'Apply QA seal & box packing'}
                  </h4>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isVi ? 'Đang chờ nhận Khay B từ trạm của Minh.' : 'Awaiting Tray B handoff from Minh.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{isVi ? 'Điểm đệm số 4' : 'Staging Slot 4'}</span>
                  <span className="text-teal-600 font-bold">{isVi ? 'Sẵn sàng' : 'Ready'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Lead Toolkit */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>{isVi ? 'Bộ công cụ Quản lý Nhanh:' : 'Shift Leader Toolkit:'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setScreen('facilitator')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 transition shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{isVi ? 'Soạn SOP bằng AI' : 'Draft SOP with AI'}</span>
              </button>
              <button
                onClick={() => triggerSafetyAlert('RIGHT', 'trolley')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 transition shadow-2xs flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>{isVi ? 'Test Cảnh báo Góc Mù' : 'Test Blind-Corner Alert'}</span>
              </button>
              <button
                onClick={() => setScreen('published')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition shadow-2xs flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{isVi ? 'SOP v2.0 đã duyệt' : 'Approved SOP'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HR Career Advancement & Shift Audit Log */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: HR Full-time Contract Proposal (Stage 5 Heart) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 text-white rounded-2xl p-5 border border-slate-700 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-600/50">
                ADC STAGE 5 · HR PROPOSAL
              </span>
              <span className="text-xs font-extrabold text-amber-400">99.8% Accuracy</span>
            </div>
            <div>
              <h4 className="font-black text-base text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{isVi ? 'Đề xuất Hợp đồng Chính thức cho Minh' : 'Full-time Contract Proposal for Minh'}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {isVi
                  ? 'Minh đã hoàn thành 42 tác vụ với độ chính xác 99.8%. Việc chủ động gắn cờ hỏi Khay A giúp tránh lỗi nghẽn hàng. Đủ căn cứ định lượng để nâng từ CTV 25k/h lên Nhân viên chính thức 12–15M VNĐ.'
                  : 'Minh achieved 99.8% precision across 42 tasks. His proactive clarification prevented a line stoppage. Clear empirical data to support transitioning from 25k/h contractor to 12-15M VND full-time salaried specialist.'}
              </p>
            </div>
            <button
              onClick={() => setScreen('accountability')}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isVi ? 'Xem Hồ sơ Năng lực (Competency Passport)' : 'View Competency Passport'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Shift Leader Audit Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{isVi ? 'Nhật ký Phê duyệt Ca trực' : 'Shift Leader Audit Log'}</h3>
              <button
                onClick={() => setScreen('messages')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {t('home.view_all')}
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {isVerified
                    ? (isVi ? 'Quản lý An đã phê duyệt đổi Khay B cho Minh' : 'Lead An approved switch to Tray B for Minh')
                    : (isVi ? 'Minh gửi yêu cầu làm rõ Khay A bị đầy' : 'Minh submitted clarification: Tray A is full')}
                </p>
                <span className="text-xs text-slate-400">10:14 AM · {isVi ? 'Lưu vết tự động' : 'Auto-stamped'}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {isVi ? 'Ban hành SOP Dây chuyền A v1.0' : 'Published Assembly Line A SOP v1.0'}
                </p>
                <span className="text-xs text-slate-400">09:20 AM · {isVi ? 'Đã kiểm tra trực quan' : 'Visual check complete'}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  {isVi ? 'Kiểm tra hệ thống đèn LED góc mù Dây chuyền A' : 'Verified Blind-Corner LED Strobes on Line A'}
                </p>
                <span className="text-xs text-slate-400">08:00 AM · {isVi ? 'Hoạt động bình thường' : 'Normal status'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT EXPORT
// ==========================================
export const HomeScreen: React.FC = () => {
  const { state } = useHandoff();
  const isFacilitator = state.activePersona === 'facilitator';

  return isFacilitator ? <ManagerHomeView /> : <WorkerHomeView />;
};
