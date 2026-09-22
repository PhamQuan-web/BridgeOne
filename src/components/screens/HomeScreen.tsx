import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { AnAvatar } from '../common/BrandGraphics';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Paperclip,
  Smile,
  Send,
  Sparkles,
  ChevronRight,
  MessageSquarePlus,
  HelpCircle,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { state, setScreen, sendLiveMessage } = useHandoff();
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'in_progress' | 'completed' | 'all'>('my_tasks');
  const [quickReplyText, setQuickReplyText] = useState('');
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;
    sendLiveMessage(quickReplyText.trim(), 'Minh');
    setReplySentSuccess(true);
    setQuickReplyText('');
    setTimeout(() => setReplySentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Good morning, Minh</span>
            <span>👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My tasks
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Assembly Line A · Here&apos;s what&apos;s happening today. You&apos;re making a difference!
          </p>
        </div>

        {/* Handwritten Cursive Note */}
        <div className="hidden sm:flex items-center gap-1 text-right transform rotate-[-3deg]">
          <span className="font-handwriting text-blue-600 text-2xl font-bold tracking-wide">
            Same team. Brighter tomorrow.
          </span>
          <div className="text-emerald-500 flex gap-0.5 ml-1">
            <span className="font-bold text-sm">/</span>
            <span className="font-bold text-sm">|</span>
            <span className="font-bold text-sm">\</span>
          </div>
        </div>
      </div>

      {/* 2. Top Live Conversation Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Live conversation</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              2 team members online
            </span>
          </div>
          <button
            onClick={() => setScreen('worker_detail')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Open task detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* An's Live Message Bubble */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-start gap-3.5">
          <div className="relative shrink-0">
            <AnAvatar size="w-10 h-10" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">An</span>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-bold border border-amber-300">
                Team lead
              </span>
              <span className="text-[11px] text-slate-400">Today at 10:14 AM</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              Great question, Minh! You&apos;re right — the units should go to <strong className="text-blue-700 font-bold">Tray B</strong> (not Tray A). I&apos;ve updated the instruction and added a clearer photo.
            </p>
          </div>
        </div>

        {/* Inline Quick Reply Box */}
        <form onSubmit={handleSendQuickReply} className="flex items-center gap-2 pt-1">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              placeholder="Reply to An..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
            />
            <div className="absolute right-3 flex items-center gap-1.5 text-slate-400">
              <button type="button" className="hover:text-slate-600 transition p-1">
                <Paperclip className="w-4 h-4" />
              </button>
              <button type="button" className="hover:text-slate-600 transition p-1">
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {replySentSuccess && (
          <div className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reply sent directly to An!</span>
          </div>
        )}
      </div>

      {/* 3. Main Grid: Task Feed (Left) & Summary Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Filter Tabs & Task Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
            <button
              onClick={() => setActiveTab('my_tasks')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'my_tasks'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>My tasks</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'my_tasks' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                4
              </span>
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                activeTab === 'in_progress'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>In progress</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                2
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                activeTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Completed</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                12
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>All tasks</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                26
              </span>
            </button>
          </div>

          {/* 4 Task Cards Stack */}
          <div className="space-y-3">
            {/* Task Card 1: Pack finished units (Primary Demo Anchor) */}
            <div
              id="card-pack-finished-units"
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Photo Thumbnail */}
              <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="inspect-unit" className="w-full h-full" />
              </div>

              {/* Task Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {state.isDestinationUpdated || state.lifecycleStage === 'facilitator_replied' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Updated (Tray B)
                    </span>
                  ) : state.lifecycleStage === 'worker_sent' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      🚩 Needs clarification
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Standard Work
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-semibold">INS-1042</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Pack finished assemblies
                </h3>
                <p className="text-xs text-slate-500 font-medium">Assembly Line A</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 5 minutes
                  </span>
                  <span>•</span>
                  <span>Standard Work</span>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="self-end sm:self-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 2: Check parts in Tray B */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Photo Thumbnail */}
              <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="tray-b" className="w-full h-full" />
              </div>

              {/* Task Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    New reply
                  </span>
                  <span className="text-[11px] text-slate-400">Updated 10:14 AM</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Check parts in Tray B
                </h3>
                <p className="text-xs text-slate-500 font-medium">Assembly Line A</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 3 minutes
                  </span>
                  <span>•</span>
                  <span>Standard Work</span>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="self-end sm:self-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 3: Add "Completed" label */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Photo Thumbnail */}
              <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="completed-label" className="w-full h-full" />
              </div>

              {/* Task Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Published update
                  </span>
                  <span className="text-[11px] text-slate-400">Updated 9:20 AM</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Add &ldquo;Completed&rdquo; label
                </h3>
                <p className="text-xs text-slate-500 font-medium">Assembly Line A</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 4 minutes
                  </span>
                  <span>•</span>
                  <span>Standard Work</span>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="self-end sm:self-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Task Card 4: Move to next stage */}
            <div
              onClick={() => setScreen('worker_detail')}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Photo Thumbnail */}
              <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs">
                <RealisticPhoto type="staging-rack" className="w-full h-full" />
              </div>

              {/* Task Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Ready to start
                  </span>
                  <span className="text-[11px] text-slate-400">Assigned today</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                  Move to next stage
                </h3>
                <p className="text-xs text-slate-500 font-medium">Assembly Line A</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~ 2 minutes
                  </span>
                  <span>•</span>
                  <span>Standard Work</span>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="self-end sm:self-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Catchup card, Recent activity, Question encouragement */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Caught up */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              You&apos;re all caught up!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All required tasks for shift 1 have clear instructions. Questions from earlier have been resolved.
            </p>
          </div>

          {/* Card 1.5: Stage 4 & 5 Accountability & Career Link (ADC Brief) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ADC Stage 4 &amp; 5
              </span>
              <span className="text-[11px] font-extrabold text-slate-800">99.8% Precision</span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">
                Workplace Justice &amp; Career Passport
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Immutable handoff stamps prove instruction errors are never blamed on workers. 94% ready for 12M–15M VNĐ full-time contract.
              </p>
            </div>
            <button
              onClick={() => setScreen('accountability')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>View Justice Audit &amp; Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Recent activity</h3>
              <button className="text-xs text-blue-600 font-semibold hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Taylor Kim replied to your question
                </p>
                <span className="text-[11px] text-slate-400">10:14 AM</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Pack finished units instruction updated
                </p>
                <span className="text-[11px] text-slate-400">10:14 AM</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  You completed &ldquo;Check parts in Tray A&rdquo;
                </p>
                <span className="text-[11px] text-slate-400">9:45 AM</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 space-y-0.5">
                <p className="font-semibold text-slate-800">
                  Maria R. joined Assembly Line A
                </p>
                <span className="text-[11px] text-slate-400">8:30 AM</span>
              </div>
            </div>
          </div>

          {/* Card 3: Good questions card */}
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl p-5 border border-blue-200/70 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Good questions build better work.
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you&apos;re ever unsure about an instruction, ask! Your team is here to support you.
            </p>
            <button
              onClick={() => setScreen('ask_suggest')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Ask or suggest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
