import React, { useEffect } from 'react';
import { useHandoff } from '../../context/HandoffContext';
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
  } = useHandoff();

  // Keyboard shortcuts:
  // Alt + D: toggle drawer
  // Alt + 1: State 1 (Nhận việc & Khay A đầy)
  // Alt + 2: State 2 (Minh hỏi & Cờ đỏ)
  // Alt + 3: State 3 (An duyệt & Tem bằng chứng)
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
    { id: 'home', label: '1. Home Dashboard', number: '1' },
    { id: 'tasks', label: '2. My Tasks Hub (Line A)', number: '2' },
    { id: 'worker_detail', label: '3. Task Detail (INS-1042)', number: '3' },
    { id: 'ask_suggest', label: '4. Ask or Suggest', number: '4' },
    { id: 'facilitator', label: '5. Lead Workspace (An)', number: '5' },
    { id: 'review_publish', label: '6. Review & Publish', number: '6' },
    { id: 'published', label: '7. Published SOP', number: '7' },
    { id: 'accountability', label: '8. Workplace Justice & Career', number: '8' },
    { id: 'messages', label: '9. Handoff Messages', number: '9' },
    { id: 'learning', label: '10. Safety & Micro-learning', number: '10' },
    { id: 'team', label: '11. Inclusive Team (Line A)', number: '11' },
    { id: 'resources', label: '12. SOP & Policy Hub', number: '12' },
    { id: 'settings', label: '13. Accessibility / UD', number: '13' },
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
                    Submission Demo Assistant
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
                title="Close drawer (Esc)"
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
                    <span>The Golden Flow (3 Trạng thái)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    Quay video demo
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
                          Nhận việc &amp; Khay A đầy
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+1
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      Minh mở task <strong>&ldquo;Pack finished assemblies&rdquo; (INS-1042)</strong>. Thấy Bước 2 ghi <strong>&ldquo;Tray A&rdquo;</strong>, nhưng khay A thực tế đã đầy.
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
                          <span>In-task Clarification &amp; Cờ đỏ</span>
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+2
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      Minh hỏi: <em>&ldquo;Can we use Tray B instead of Tray A for high-volume units?&rdquo;</em>. Task lập tức gắn cờ <strong>&ldquo;Needs clarification&rdquo;</strong>.
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
                          <span>An duyệt &amp; Tem bằng chứng</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Alt+3
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                      An phản hồi đồng ý. Bước 2 viền xanh highlight đổi thành <strong>&ldquo;Place in tray Tray B&rdquo;</strong> kèm badge <strong>[Updated]</strong> và tem: <strong>&ldquo;✔ Verified by An (Lead) · Provenance: Worker Question Handoff&rdquo;</strong>.
                    </p>
                  </button>
                </div>
              </div>

              {/* Persona Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide block">
                  Switch Active Perspective
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
                      <span className="text-[10px] text-slate-500">Worker View</span>
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
                      <span className="text-[10px] text-slate-500">Lead View</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Screen Direct Access */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide block">
                  All 6 Core Screens
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
                <span>Reset (Alt+R)</span>
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
