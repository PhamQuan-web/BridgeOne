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
} from 'lucide-react';
import { ScreenId } from '../../types/handoff';

export const AppWindowLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, setScreen, switchPersona, toggleDemoDrawer } = useHandoff();
  const { t } = useLanguage();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-slate-900">
      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
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

      {/* LEFT SIDEBAR (Consolidated to Core Hubs, w-64, high-contrast, collapsible) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col justify-between select-none transform transition-all duration-200 ease-in-out md:static ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl w-64 p-4' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-18 md:p-3' : 'md:w-64 md:p-4'}`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-hidden hover:opacity-90 transition block"
              title="BridgeOne"
            >
              {isSidebarCollapsed ? (
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
                  B
                </div>
              ) : (
                <CungNhipLogo />
              )}
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
                  title={t('nav.learning', 'Đào tạo & Thủ ngữ VSL')}
                  className={`w-full min-h-[50px] flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-3 rounded-xl text-sm font-semibold transition ${
                    state.currentScreen === 'learning'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 shrink-0 ${state.currentScreen === 'learning' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{t('nav.learning', 'Đào tạo & VSL')}</span>}
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
              phrase={
                isFacilitator
                  ? 'Support people to succeed.'
                  : 'Clear communication builds stronger teams.'
              }
              subphrase={
                isFacilitator
                  ? 'Better instructions, brighter tomorrows. Inclusive workplaces create opportunities for everyone.'
                  : 'Inclusive workplaces create safer, stronger opportunities for everyone.'
              }
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

      {/* MAIN CONTENT AREA */}
      <section aria-label="Main Application View" className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Top Product Bar: Search, Work Area, Notification Bell, User Persona Switcher */}
        <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Focus Mode Toggle & Search Bar */}
          <div className="flex-1 max-w-md flex items-center gap-2">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
              title={isSidebarCollapsed ? 'Mở rộng thanh bên (Focus Mode Tắt)' : 'Thu gọn thanh bên (Bật Focus Mode cho trạm làm việc)'}
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
            {/* Instant Language Switcher (VI, EN, JA, KO, ZH) */}
            <LanguageSwitcher />

            {/* Visual Safety Beacon status (ADC Stage 6 Pillar 3) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left text-xs leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Pillar 3 Sightline
                </span>
                <span className="text-[11px] font-extrabold text-emerald-950">
                  Corner LED Active
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden xl:block" />

            {/* Notification Bell */}
            <button
              onClick={() => handleNavClick(isFacilitator ? 'facilitator' : 'worker_detail')}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Active Persona Switcher Pill */}
            <div className="relative">
              <button
                id="btn-persona-switcher"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/90 bg-white transition shadow-2xs"
                title="Switch active user perspective"
              >
                {isFacilitator ? (
                  <AnAvatar size="w-7 h-7" />
                ) : (
                  <MinhAvatar size="w-7 h-7" name="M" />
                )}

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{isFacilitator ? 'An' : 'Minh'}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                        isFacilitator
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {isFacilitator ? 'Lead' : 'Worker'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                    {isFacilitator ? 'Team lead' : 'New team member'}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Persona Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{t('persona.switch_title', 'Switch Perspective')}</p>
                    <p className="text-[11px] text-slate-500">
                      {t('persona.switch_desc', 'Experience reciprocal handoff as Worker or Facilitator')}
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* Worker Option */}
                    <button
                      onClick={() => {
                        switchPersona('worker');
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                        !isFacilitator ? 'bg-blue-50 text-blue-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MinhAvatar size="w-7 h-7" name="M" />
                        <div>
                          <span className="block font-bold">Minh</span>
                          <span className="text-[10px] text-slate-500">
                            {t('role.worker', 'Worker')} · {t('persona.worker_title', 'New team member')}
                          </span>
                        </div>
                      </div>
                      {!isFacilitator && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                          {t('persona.active', 'Active')}
                        </span>
                      )}
                    </button>

                    {/* Facilitator Option */}
                    <button
                      onClick={() => {
                        switchPersona('facilitator');
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                        isFacilitator ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <AnAvatar size="w-7 h-7" />
                        <div>
                          <span className="block font-bold">An</span>
                          <span className="text-[10px] text-slate-500">
                            {t('role.lead', 'Lead')} · {t('persona.lead_title', 'Team lead')}
                          </span>
                        </div>
                      </div>
                      {isFacilitator && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          {t('persona.active', 'Active')}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Screen View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">{children}</main>

        {/* Universal Persistent Live Conversation (STT/TTS and AI shift catch-up across all screens) */}
        <PersistentLiveConversation />
      </section>
    </div>
  );
};
