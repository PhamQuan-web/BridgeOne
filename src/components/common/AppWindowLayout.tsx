import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { CungNhipLogo, WorkerIllustration, AnAvatar, MinhAvatar } from './BrandGraphics';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PersistentLiveConversation } from './PersistentLiveConversation';
import {
  CheckSquare,
  MessageSquarePlus,
  BookOpen,
  Mail,
  Users,
  Search,
  Bell,
  ChevronDown,
  Home,
  FileText,
  Settings,
  FolderKanban,
  GraduationCap,
  Menu,
  X,
  ArrowLeftRight,
  Scale,
  Layers,
  PanelLeftClose,
  PanelLeft,
  HelpCircle,
  Sparkles,
  AlertCircle,
  Sliders,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { ScreenId } from '../../types/handoff';

export const AppWindowLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, setScreen, switchPersona, toggleDemoDrawer, toggleRightSidebar, setGoldenFlowState } = useHandoff();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isFacilitator = state.activePersona === 'facilitator';

  // Dynamic notification count: 1 if worker has unread lead reply or lead has pending question
  const hasUnread =
    (isFacilitator && state.lifecycleStage === 'worker_sent') ||
    (!isFacilitator && state.lifecycleStage === 'facilitator_replied');

  const handleNavClick = (screen: ScreenId) => {
    setScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#F8FAFC] text-slate-900">
      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-30">
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 focus:outline-hidden"
        >
          <CungNhipLogo className="scale-90 origin-left" />
        </button>

        <div className="flex items-center gap-2">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher compact />

          {/* Mobile notification */}
          <button
            onClick={() => handleNavClick(isFacilitator ? 'facilitator' : 'worker_detail')}
            className="p-2 text-slate-600 hover:text-slate-900 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* LEFT SIDEBAR (Consolidated to Core Hubs, w-72, high-contrast, collapsible, fixed h-screen) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col justify-between select-none transform transition-all duration-200 ease-in-out md:static md:h-screen shrink-0 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl w-72 p-4' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20 md:p-3' : 'md:w-72 md:p-4'}`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-hidden hover:opacity-90 transition block"
              title="BridgeOne"
            >
              <CungNhipLogo compact={isSidebarCollapsed} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation links - Consolidated 5 Core Hubs */}
          <nav aria-label="Main Navigation" className="space-y-2 pt-1">
            {isFacilitator ? (
              /* Facilitator Navigation (Lead):
                 1. Dashboard (Home)
                 2. SOP Management (Facilitator)
                 3. Verification Audit (Accountability)
                 4. Messages
                 5. Team & SOP Docs (Team / Resources)
                 6. Settings */
              <>
                <button
                  id="nav-lead-home"
                  onClick={() => handleNavClick('home')}
                  title={t('nav.home', 'Tổng quan ca trực')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'home'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Home className={`w-5 h-5 shrink-0 ${state.currentScreen === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.home', 'Tổng quan ca trực')}</span>}
                </button>

                <button
                  id="nav-lead-instructions"
                  onClick={() => handleNavClick('facilitator')}
                  title={t('nav.lead_workspace', 'Quy trình & Hướng dẫn SOP')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'facilitator' ||
                    state.currentScreen === 'review_publish' ||
                    state.currentScreen === 'published'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3.5'}`}>
                    <FileText
                      className={`w-5 h-5 shrink-0 ${
                        state.currentScreen === 'facilitator' ||
                        state.currentScreen === 'review_publish' ||
                        state.currentScreen === 'published'
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    />
                    {!isSidebarCollapsed && <span>{t('nav.lead_workspace', 'Quy trình & SOP')}</span>}
                  </div>
                  {!isSidebarCollapsed && state.lifecycleStage === 'worker_sent' && (
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center animate-pulse">
                      1
                    </span>
                  )}
                </button>

                <button
                  id="nav-lead-accountability"
                  onClick={() => handleNavClick('accountability')}
                  title={t('nav.justice', 'Hồ sơ xác minh & Công bằng')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'accountability'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Scale className={`w-5 h-5 shrink-0 ${state.currentScreen === 'accountability' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.justice', 'Hồ sơ xác minh')}</span>}
                </button>

                <button
                  id="nav-lead-messages"
                  onClick={() => handleNavClick('messages')}
                  title={t('nav.messages', 'Luồng trao đổi ca trực')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'messages'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3.5'}`}>
                    <Mail className={`w-5 h-5 shrink-0 ${state.currentScreen === 'messages' ? 'text-blue-600' : 'text-slate-400'}`} />
                    {!isSidebarCollapsed && <span>{t('nav.messages', 'Trao đổi ca trực')}</span>}
                  </div>
                  {state.lifecycleStage === 'worker_sent' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                <button
                  id="nav-lead-learning"
                  onClick={() => handleNavClick('learning')}
                  title={t('nav.learning', 'Học tập & Hỏi đáp AI')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'learning'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 shrink-0 ${state.currentScreen === 'learning' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.learning_short', 'Học tập & AI')}</span>}
                </button>

                <button
                  id="nav-lead-team"
                  onClick={() => handleNavClick('team')}
                  title={t('nav.team', 'Đội ngũ & Tài liệu')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'team' || state.currentScreen === 'resources'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className={`w-5 h-5 shrink-0 ${state.currentScreen === 'team' || state.currentScreen === 'resources' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.team', 'Đội ngũ & Tài liệu')}</span>}
                </button>

                <button
                  id="nav-lead-settings"
                  onClick={() => handleNavClick('settings')}
                  title={t('nav.settings', 'Cài đặt hệ thống')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'settings'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Settings className={`w-5 h-5 shrink-0 ${state.currentScreen === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.settings', 'Cài đặt hệ thống')}</span>}
                </button>
              </>
            ) : (
              /* Worker Navigation (Minh - 5 Core Hubs):
                 1. Nhiệm vụ & Trạm làm việc (Workstation Hub)
                 2. Hồ sơ xác minh & Công bằng (Verification Trail)
                 3. Luồng trao đổi ca trực (Contextual Messages)
                 4. Đào tạo & Thủ ngữ VSL (Visual Learning)
                 5. Trợ năng & Cài đặt trạm (Accessibility Settings) */
              <>
                <button
                  id="nav-worker-workstation"
                  onClick={() => handleNavClick('home')}
                  title={t('nav.home', 'Nhiệm vụ & Trạm làm việc')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'home' ||
                    state.currentScreen === 'tasks' ||
                    state.currentScreen === 'worker_detail' ||
                    state.currentScreen === 'ask_suggest'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3.5'}`}>
                    <CheckSquare
                      className={`w-5 h-5 shrink-0 ${
                        state.currentScreen === 'home' ||
                        state.currentScreen === 'tasks' ||
                        state.currentScreen === 'worker_detail' ||
                        state.currentScreen === 'ask_suggest'
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    />
                    {!isSidebarCollapsed && <span>{t('nav.home', 'Nhiệm vụ & Trạm')}</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      INS-1042
                    </span>
                  )}
                </button>

                <button
                  id="nav-worker-accountability"
                  onClick={() => handleNavClick('accountability')}
                  title={t('nav.justice', 'Hồ sơ xác minh & Công bằng')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'accountability'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3.5'}`}>
                    <Scale className={`w-5 h-5 shrink-0 ${state.currentScreen === 'accountability' ? 'text-blue-600' : 'text-slate-400'}`} />
                    {!isSidebarCollapsed && <span>{t('nav.justice', 'Hồ sơ xác minh')}</span>}
                  </div>
                  {!isSidebarCollapsed && state.isDestinationUpdated && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Đã có bằng chứng xác nhận đổi Khay B" />
                  )}
                </button>

                <button
                  id="nav-worker-messages"
                  onClick={() => handleNavClick('messages')}
                  title={t('nav.messages', 'Luồng trao đổi ca trực')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'messages'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3.5'}`}>
                    <Mail className={`w-5 h-5 shrink-0 ${state.currentScreen === 'messages' ? 'text-blue-600' : 'text-slate-400'}`} />
                    {!isSidebarCollapsed && <span>{t('nav.messages', 'Trao đổi ca trực')}</span>}
                  </div>
                  {state.lifecycleStage === 'facilitator_replied' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>

                <button
                  id="nav-worker-learning"
                  onClick={() => handleNavClick('learning')}
                  title={t('nav.learning', 'Học tập & Hỏi đáp AI')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'learning'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 shrink-0 ${state.currentScreen === 'learning' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.learning_short', 'Học tập & AI')}</span>}
                </button>

                <button
                  id="nav-worker-settings"
                  onClick={() => handleNavClick('settings')}
                  title={t('nav.settings', 'Trợ năng & Cài đặt trạm')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'settings'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Sliders className={`w-5 h-5 shrink-0 ${state.currentScreen === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.settings', 'Trợ năng trạm')}</span>}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Character Motivation - hidden when sidebar collapsed */}
        {!isSidebarCollapsed && (
          <div className="mt-6 border-t border-slate-100 pt-3">
            <WorkerIllustration
              phrase={isFacilitator ? t('brand.quote_lead') : t('brand.quote')}
              subphrase={isFacilitator ? t('brand.quote_lead_sub') : t('brand.quote_sub')}
            />
          </div>
        )}
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA: FIXED h-screen overflow-hidden */}
      <section aria-label="Main Application View" className="flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Top Product Bar: Search, Work Area, Notification Bell, User Persona Switcher */}
        <header className="shrink-0 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-20">
          {/* Focus Mode Toggle & Search Bar */}
          <div className="flex-1 max-w-md flex items-center gap-2">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
              title={isSidebarCollapsed ? t('header.focus_mode_expand') : t('header.focus_mode_collapse')}
            >
              {isSidebarCollapsed ? <PanelLeft className="w-5 h-5 text-blue-600" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.search_placeholder', 'Tìm kiếm quy trình SOP, linh kiện, trạm...')}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
              />
              <span className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs pointer-events-none">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Right Header Area: Language Switcher + Sightline LED status + Notification + Persona Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Instant Language Switcher (VI, EN) */}
            <LanguageSwitcher />

            {/* Visual Safety Beacon status (ADC Stage 6 Pillar 3) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left text-xs leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {t('header.sightline_title')}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-950">
                  {t('header.sightline_active')}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden xl:block" />

            {/* Toggle Right Live Handoff Sidebar */}
            <button
              id="btn-toggle-right-sidebar"
              onClick={toggleRightSidebar}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition border flex items-center gap-1.5 text-xs font-bold ${
                state.isRightSidebarOpen
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200'
              }`}
              title={t('header.toggle_live_sidebar', 'Bật/tắt Kênh trực tiếp (STT / Phụ đề / TTS)')}
            >
              <Radio className={`w-4 h-4 ${state.isLiveMicActive ? 'text-rose-500 animate-pulse' : 'text-blue-600'}`} />
              <span className="hidden lg:inline">{t('header.live_channel', 'Kênh Trực Tiếp')}</span>
              {state.liveTranscriptLog.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => handleNavClick(isFacilitator ? 'facilitator' : 'worker_detail')}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title={t('header.notifications')}
            >
              <Bell className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* DIRECT 1-CLICK PERSONA SWITCHER: MINH <-> AN (No hidden menu, zero-friction toggle) */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/90 shadow-2xs">
              <button
                id="toggle-persona-worker"
                type="button"
                onClick={() => switchPersona('worker')}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition ${
                  !isFacilitator
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chuyển sang góc nhìn Minh (Công nhân)"
              >
                <MinhAvatar size="w-5 h-5" name="M" />
                <span>Minh</span>
                <span className="text-[10px] font-normal opacity-75 hidden xl:inline">({t('role.worker', 'Công nhân')})</span>
              </button>

              <button
                id="toggle-persona-facilitator"
                type="button"
                onClick={() => switchPersona('facilitator')}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition ${
                  isFacilitator
                    ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chuyển sang góc nhìn An (Quản lý chuyền)"
              >
                <AnAvatar size="w-5 h-5" />
                <span>An</span>
                <span className="text-[10px] font-normal opacity-75 hidden xl:inline">({t('role.lead', 'Quản lý')})</span>
              </button>
            </div>

            {/* Quick Reset Flow Button (Shortcut: Option+1) */}
            <button
              id="btn-quick-reset-shot2"
              onClick={() => setGoldenFlowState(1)}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 transition flex items-center gap-1 text-xs font-bold shadow-2xs"
              title="Khôi phục trạng thái ban đầu (Khay A) để quay Shot 2 (Phím tắt: Option+1)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden xl:inline">Làm lại Shot 2</span>
            </button>
          </div>
        </header>

        {/* 3-COLUMN ARCHITECTURE: Center Workspace + Right Live Handoff Sidebar */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* CENTER WORKSPACE: 100% unobstructed, responsive, clean */}
          <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-7">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>

          {/* DESKTOP RIGHT LIVE HANDOFF SIDEBAR (Teams-style live STT & reciprocal dialogue) */}
          {state.isRightSidebarOpen && (
            <aside
              aria-label="Live Handoff Sidebar"
              className="hidden md:flex w-80 lg:w-92 xl:w-[410px] shrink-0 border-l border-slate-200/90 bg-white flex-col h-full z-20 transition-all duration-200"
            >
              <PersistentLiveConversation isSidebarMode onClose={toggleRightSidebar} />
            </aside>
          )}
        </div>

        {/* MOBILE SLIDE-OVER SHEET FOR RIGHT LIVE HANDOFF SIDEBAR */}
        {state.isRightSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-end">
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={toggleRightSidebar}
            />
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              <PersistentLiveConversation isSidebarMode onClose={toggleRightSidebar} />
            </div>
          </div>
        )}

        {/* FLOATING RE-OPEN PILL IF SIDEBAR IS CLOSED */}
        {!state.isRightSidebarOpen && (
          <button
            type="button"
            onClick={toggleRightSidebar}
            className="fixed bottom-4 right-4 z-30 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-extrabold transition border border-blue-500/30 animate-in fade-in"
            title={t('header.toggle_live_sidebar', 'Bật/tắt Kênh trực tiếp')}
          >
            <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>{t('header.live_channel', 'Kênh Trực Tiếp')}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        )}
      </section>
    </div>
  );
};
