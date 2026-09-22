import React, { useEffect } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ScreenId } from '../../types/handoff';
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  X,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flag,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const {
    state,
    setScreen,
    resetDemo,
    switchPersona,
    toggleDemoDrawer,
    setDemoDrawerOpen,
    setGoldenFlowState,
    triggerSafetyAlert,
  } = useHandoff();
  const { isVi } = useLanguage();

  // Keyboard shortcuts:
  // Alt + D: toggle drawer
  // Alt + 1: State 1 (Nhận việc & Khay A đầy)
  // Alt + 2: State 2 (Minh hỏi & Cờ đỏ)
  // Alt + 3: State 3 (An duyệt & Tem bằng chứng)
  // Alt + 4: Module 2 (Cảnh báo góc mù phi âm thanh)
  // Alt + R: Reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        toggleDemoDrawer();
      } else if (e.altKey && e.key === '1') {
        e.preventDefault();
        setGoldenFlowState(1);
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setGoldenFlowState(2);
      } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setGoldenFlowState(3);
      } else if (e.altKey && e.key === '4') {
        e.preventDefault();
        triggerSafetyAlert('RIGHT', 'trolley');
      } else if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetDemo();
      }

      if (e.key === 'Escape' && state.isDemoDrawerOpen) {
        setDemoDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isDemoDrawerOpen, toggleDemoDrawer, setDemoDrawerOpen, setGoldenFlowState, resetDemo]);

  const screens: { id: ScreenId; label: string; number: string }[] = [
    { id: 'home', label: isVi ? '1. Trang chủ tổng quan' : '1. Home Dashboard', number: '1' },
    { id: 'tasks', label: isVi ? '2. Danh mục nhiệm vụ (Chuyền A)' : '2. My Tasks Hub (Line A)', number: '2' },
    { id: 'worker_detail', label: isVi ? '3. Chi tiết tác vụ (INS-1042)' : '3. Task Detail (INS-1042)', number: '3' },
    { id: 'ask_suggest', label: isVi ? '4. Hỏi hoặc Đề xuất' : '4. Ask or Suggest', number: '4' },
    { id: 'facilitator', label: isVi ? '5. Không gian Trưởng nhóm (An)' : '5. Lead Workspace (An)', number: '5' },
    { id: 'review_publish', label: isVi ? '6. Rà soát & Xuất bản' : '6. Review & Publish', number: '6' },
    { id: 'published', label: isVi ? '7. SOP đã xuất bản' : '7. Published SOP', number: '7' },
    { id: 'accountability', label: isVi ? '8. Công bằng & Hồ sơ năng lực' : '8. Workplace Justice & Career', number: '8' },
    { id: 'messages', label: isVi ? '9. Tin nhắn bàn giao' : '9. Handoff Messages', number: '9' },
    { id: 'learning', label: isVi ? '10. An toàn & Học vi mô' : '10. Safety & Micro-learning', number: '10' },
    { id: 'team', label: isVi ? '11. Đội ngũ hòa nhập (Chuyền A)' : '11. Inclusive Team (Line A)', number: '11' },
    { id: 'resources', label: isVi ? '12. Kho lưu trữ SOP & Chính sách' : '12. SOP & Policy Hub', number: '12' },
    { id: 'settings', label: isVi ? '13. Trợ năng / Thiết kế phổ quát' : '13. Accessibility / UD', number: '13' },
  ];

  return (
    <>
      {/* Slide-over Drawer / Modal for Demo Tour & Jump Controls (Open via Alt+D or Header/Live Caption) */}
      {state.isDemoDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-assistant-title"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end transition-opacity"
        >
          {/* Backdrop click to close */}
          <div
            className="flex-1"
            onClick={() => setDemoDrawerOpen(false)}
            aria-label="Close demo drawer backdrop"
          />

          {/* Drawer container */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="demo-assistant-title" className="font-extrabold text-sm text-slate-950">
                    {isVi ? 'Trợ lý Trình diễn Bài thi' : 'Submission Demo Assistant'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Cùng Nhịp · ADC Hackathon 2026 Golden Flow
                  </p>
                </div>
              </div>
              <button
                id="btn-close-demo-assistant"
                onClick={() => setDemoDrawerOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition"
                title={isVi ? 'Đóng ngăn kéo (Esc)' : 'Close drawer (Esc)'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
              {/* THE GOLDEN FLOW SECTION (PROMINENT FOR RECORDING) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-950 text-xs uppercase tracking-wide">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{isVi ? 'The Golden Flow (3 Trạng thái)' : 'The Golden Flow (3 States)'}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    {isVi ? 'Quay video demo' : 'Record demo video'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Trạng thái 1 */}
                  <button
                    id="drawer-state-1-btn"
                    onClick={() => {
                      setGoldenFlowState(1);
                      setDemoDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition group ${
                      state.lifecycleStage === 'draft_shared' && !state.isDestinationUpdated
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                          1
                        </span>
                        <span className="font-extrabold text-slate-900 group-hover:text-blue-700">
                          {isVi ? 'Nhận việc & Khay A đầy' : 'Task Assigned & Tray A Full'}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+1
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      {isVi ? (
                        <>Minh mở task <strong>“Pack finished assemblies” (INS-1042)</strong>. Thấy Bước 2 ghi <strong>“Khay A”</strong>, nhưng khay A thực tế đã đầy.</>
                      ) : (
                        <>Minh opens task <strong>“Pack finished assemblies” (INS-1042)</strong>. Sees Step 2 directs to <strong>“Tray A”</strong>, but Tray A is already full.</>
                      )}
                    </p>
                  </button>

                  {/* Trạng thái 2 */}
                  <button
                    id="drawer-state-2-btn"
                    onClick={() => {
                      setGoldenFlowState(2);
                      setDemoDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition group ${
                      state.lifecycleStage === 'worker_sent'
                        ? 'border-rose-500 bg-rose-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-rose-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                          2
                        </span>
                        <span className="font-extrabold text-slate-900 group-hover:text-rose-700 flex items-center gap-1.5">
                          <span>{isVi ? 'In-task Clarification & Cờ đỏ' : 'In-task Clarification & Red Flag'}</span>
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+2
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      {isVi ? (
                        <>Minh hỏi: <em>“Can we use Tray B instead of Tray A for high-volume units?”</em>. Task lập tức gắn cờ <strong>“Needs clarification”</strong>.</>
                      ) : (
                        <>Minh asks: <em>“Can we use Tray B instead of Tray A for high-volume units?”</em>. Task immediately flagged with <strong>“Needs clarification”</strong>.</>
                      )}
                    </p>
                  </button>

                  {/* Trạng thái 3 */}
                  <button
                    id="drawer-state-3-btn"
                    onClick={() => {
                      setGoldenFlowState(3);
                      setDemoDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition group ${
                      state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied'
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                          3
                        </span>
                        <span className="font-extrabold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                          <span>{isVi ? 'An duyệt & Tem bằng chứng' : 'Lead Approved & Provenance Stamp'}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+3
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      {isVi ? (
                        <>An phản hồi đồng ý. Bước 2 viền xanh highlight đổi thành <strong>“Đặt vào khay Khay B”</strong> kèm badge <strong>[Đã cập nhật]</strong> và tem: <strong>“✔ Đã xác minh bởi An (Trưởng nhóm) · Nguồn gốc: Bàn giao câu hỏi nhân viên”</strong>.</>
                      ) : (
                        <>An replies and approves. Step 2 highlighted in green and updated to <strong>“Place in tray Tray B”</strong> with <strong>[Updated]</strong> badge and stamp: <strong>“✔ Verified by An (Lead) · Provenance: Worker Question Handoff”</strong>.</>
                      )}
                    </p>
                  </button>

                  {/* Trạng thái 4 (Module 2: Cảnh báo góc mù) */}
                  <button
                    id="drawer-state-4-btn"
                    onClick={() => {
                      triggerSafetyAlert('RIGHT', 'trolley');
                      setDemoDrawerOpen(false);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-rose-300 hover:border-rose-500 bg-rose-50/60 hover:bg-rose-100/60 transition group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                          4
                        </span>
                        <span className="font-extrabold text-rose-900 group-hover:text-rose-950 flex items-center gap-1.5">
                          <span>{isVi ? 'Module 2: Cảnh báo Góc mù' : 'Module 2: Blind-Corner Alert'}</span>
                          <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-bold">New</span>
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+4
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800 mt-1.5 leading-snug">
                      {isVi ? (
                        <>Kích hoạt mô phỏng camera AI phát hiện xe đẩy hàng tiếp cận góc khuất: Bật cảnh báo rung điện thoại và banner chỉ hướng <strong>[BÊN PHẢI]</strong> đếm lùi 3 giây né tránh an toàn.</>
                      ) : (
                        <>Triggers simulated AI camera detecting approaching hand-trolley at blind corner: Activates haptic alert and directional banner <strong>[RIGHT SIDE]</strong> with 3s countdown for safe evasion.</>
                      )}
                    </p>
                  </button>
                </div>
              </div>

              {/* Persona Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide block">
                  {isVi ? 'Chuyển Đổi Góc Nhìn Người Dùng' : 'Switch Active Perspective'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      switchPersona('worker');
                      setDemoDrawerOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      state.activePersona === 'worker'
                        ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      M
                    </div>
                    <div>
                      <span className="block font-bold">Minh</span>
                      <span className="text-[10px] text-slate-500">
                        {isVi ? 'Góc nhìn Nhân viên' : 'Worker View'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('facilitator');
                      setDemoDrawerOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      state.activePersona === 'facilitator'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      An
                    </div>
                    <div>
                      <span className="block font-bold">An</span>
                      <span className="text-[10px] text-slate-500">
                        {isVi ? 'Góc nhìn Trưởng nhóm' : 'Lead View'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Screen Direct Access */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide block">
                  {isVi ? 'Tất cả các màn hình' : 'All Core Screens'}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {screens.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setScreen(s.id);
                        setDemoDrawerOpen(false);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition text-xs font-semibold ${
                        state.currentScreen === s.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                id="btn-reset-demo-state"
                onClick={() => {
                  resetDemo();
                  setDemoDrawerOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold transition shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>{isVi ? 'Đặt lại (Alt+R)' : 'Reset (Alt+R)'}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                Cùng Nhịp · ADC 2026
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
