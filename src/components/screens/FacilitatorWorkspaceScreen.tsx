import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
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

  const [activeTab, setActiveTab] = useState<'instructions' | 'discussion' | 'changes' | 'related'>('instructions');
  const [replyText, setReplyText] = useState(
    state.facilitatorDraftReply ||
      "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction."
  );
  const [selectedDestination, setSelectedDestination] = useState(state.facilitatorDraftDestination || 'Tray B');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);

  const handleGenerateAiDraft = () => {
    setIsGeneratingAiDraft(true);
    setTimeout(() => {
      setReplyText(
        "Great question, Minh! You're right — the finished units on Assembly Line A should go to Tray B (not Tray A) starting today. I've updated Step 2 and attached an updated photo of Tray B so everyone is clear. Thank you for flagging this!"
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
      {/* Top back breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to instructions</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Editing as <strong className="text-slate-800">An (Team lead)</strong>
          </span>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Facilitator Instruction Editor View */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                Shared draft
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Assembly Line A
              </span>
              <span className="text-xs text-slate-400 font-medium">INS-1042</span>
            </div>

            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Pack finished assemblies
              </h1>
            </div>

            <p className="text-sm text-slate-600 font-medium">
              Setting up the packing workflow for shift 1 handoff.
            </p>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-600">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 shadow-2xs">
                Medium
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~ 15 minutes
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                Standard Work
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                Assembly Line A
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
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'discussion'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Discussion (2)
            </button>
            <button
              onClick={() => setActiveTab('changes')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'changes'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Changes (3)
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'related'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Related (2)
            </button>
          </div>

          {/* Step-by-step instructions card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900">
                Step-by-step instructions
              </h2>
              <div className="flex items-center gap-2">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add step</span>
                </button>
              </div>
            </div>

            {/* 4 Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        Check unit is complete
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Make sure all components are securely attached and no parts are loose.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="inspect-unit" className="w-full h-full" />
                </div>
              </div>

              {/* Step 2 (The Target of Atomic Update) */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl bg-blue-50/40 border border-blue-200 shadow-2xs transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        Place in tray
                      </h3>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                        Updating to Tray B
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Gently place the finished unit in <strong className="text-blue-700 font-bold">Tray B</strong>.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-blue-300 shadow-2xs">
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
                        Add label
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Attach a green &ldquo;Completed&rdquo; label to the top of the unit.
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
                        Move to next stage
                      </h3>
                      <button className="text-[11px] text-slate-400 hover:text-slate-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Take Tray B to the staging rack.
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

        {/* RIGHT COLUMN (5 cols): Worker Feedback & Atomic Reply (Image 3 Main Reference) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Latest worker feedback from Minh */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                Latest worker feedback
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Today at 9:48 AM</span>
            </div>

            <div className="flex items-start gap-3">
              <MinhAvatar size="w-8 h-8" name="M" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900">Minh</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    New team member · Line A
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-800 leading-relaxed border border-slate-100">
                  {state.workerQuestion ||
                    "Just checking — do we still put the finished units in Tray A? I saw a new tray setup and wasn't sure. Also, would it be helpful to add a photo of the correct layout?"}
                </div>
              </div>
            </div>

            {/* AI Suggestion Pill for Facilitator */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1 text-[11px]">
                <span className="font-bold text-amber-950 block">
                  Clarification Recommendation
                </span>
                <p className="text-amber-900 leading-relaxed">
                  Worker observed visual difference on the floor. Affirm their initiative and align Step 2 with the actual Tray B physical setup.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateAiDraft}
                  disabled={isGeneratingAiDraft}
                  className="mt-1 text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 underline"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>{isGeneratingAiDraft ? 'Generating draft...' : 'Insert AI-assisted aligned response'}</span>
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
                  Your reply (to Minh)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivateNote(!isPrivateNote)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                {isPrivateNote ? <Lock className="w-3.5 h-3.5" /> : null}
                <span>{isPrivateNote ? 'Private note' : 'Switch to private note'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                id="facilitator-reply-textarea"
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response to Minh..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition resize-none leading-relaxed"
              />

              {/* Sub-card: Update to instruction (happens together) */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">
                    Update to instruction (happens together)
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Atomic handoff
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Step 2: Place in tray</span>
                    <span className="text-[11px] text-slate-500">Destination:</span>
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
                      Tray B (Recommended)
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
                      Keep Tray A
                    </button>
                  </div>

                  {/* Before vs After */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-slate-500">
                    <div className="line-through text-slate-400">
                      Before: &ldquo;Place the finished unit in Tray A.&rdquo;
                    </div>
                    <div className="text-slate-900 font-semibold flex items-center gap-1.5 text-emerald-800">
                      <span>After: &ldquo;Place the finished unit in {selectedDestination}.&rdquo;</span>
                    </div>
                  </div>

                  {/* Tray thumbnail preview */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-emerald-300 shrink-0">
                      <RealisticPhoto type="tray-b" className="w-full h-full" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        ✓ Verified photo of Tray B added
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Updated based on Minh&apos;s question. Verified by An (Lead).
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
                  <span>Share update &amp; reply</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  This will atomically update the instruction and send your verified reply to Minh.
                </p>
              </div>
            </form>

            {successToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Update committed atomically! Opening Review &amp; Publish screen...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

