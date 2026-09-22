import React from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { Layers, User, Shield, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, setScreen } = useHandoff();

  const isFacilitatorView =
    state.currentScreen === 'facilitator' || state.currentScreen === 'review_publish';

  const toggleRoleView = () => {
    if (isFacilitatorView) {
      setScreen('worker_detail');
    } else {
      setScreen('facilitator');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-3 group text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold tracking-tight shadow-xs group-hover:bg-blue-700 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">CÙNG NHỊP</span>
                <span className="text-[10px] px-1.5 py-0.5 font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  Onboarding
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Accessible task handoff &amp; instruction alignment
              </p>
            </div>
          </button>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-slate-200 pl-6 text-sm">
            <button
              onClick={() => setScreen('home')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                state.currentScreen === 'home'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setScreen('worker_detail')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                state.currentScreen === 'worker_detail' || state.currentScreen === 'ask_suggest'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Active Task Detail
            </button>
            <button
              onClick={() => setScreen('facilitator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                state.currentScreen === 'facilitator' || state.currentScreen === 'review_publish'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Facilitator Workspace
            </button>
            <button
              onClick={() => setScreen('published')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                state.currentScreen === 'published'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Published SOP
            </button>
          </nav>
        </div>

        {/* Right side: Role indicator and perspective switch */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right text-xs">
            <span className="text-slate-400 font-medium">Work Area</span>
            <span className="font-semibold text-slate-800">Assembly Line A · Shift 1</span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden lg:block" />

          {/* Active user persona badge */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-full px-3 py-1.5">
            {isFacilitatorView ? (
              <>
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  An
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <span>An</span>
                    <span className="text-[10px] text-amber-700 font-medium bg-amber-100 px-1 rounded">Lead</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">Task Facilitator</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <span>Minh</span>
                    <span className="text-[10px] text-blue-700 font-medium bg-blue-100 px-1 rounded">Worker</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">New team member</span>
                </div>
              </>
            )}

            <button
              onClick={toggleRoleView}
              className="ml-1 p-1 hover:bg-white rounded-full text-slate-400 hover:text-slate-700 transition"
              title={`Switch perspective to ${isFacilitatorView ? 'Minh (Worker)' : 'An (Facilitator)'}`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
