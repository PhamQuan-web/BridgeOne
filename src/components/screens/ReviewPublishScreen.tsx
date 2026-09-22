import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { MinhAvatar, BotanicalCorner } from '../common/BrandGraphics';
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Users,
  Check,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ReviewPublishScreen: React.FC = () => {
  const {
    state,
    setScreen,
    publishInstruction,
    toggleFacilitatorConfirmation,
  } = useHandoff();

  const [changeLogNote, setChangeLogNote] = useState(
    'Updated tray location based on question from Minh. Replaced photo with Tray B setup for clarity.'
  );

  const canPublish =
    state.facilitatorCheckedDetails &&
    state.facilitatorCheckedAccessibleOpportunity;

  const handlePublish = () => {
    publishInstruction();
    setScreen('published');
  };

  return (
    <div className="space-y-6">
      {/* Top back breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('facilitator')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to instruction</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Step 3 of 4: Review before publication
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Review &amp; publish
        </h1>
        <p className="text-sm text-slate-600">
          Review all changes before publishing. Everyone on Assembly Line A will see the updated version immediately.
        </p>
      </div>

      {/* Main Two-Column Layout (Matching Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): What's Changing, Change Log Note, Who Will Be Notified */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: What's changing */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                What&apos;s changing
              </h2>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Atomic Handoff Verified
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800">
                Step 2: Place in tray
              </div>

              {/* Before vs After comparison cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before */}
                <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
                    Before
                  </span>
                  <div className="h-28 rounded-lg overflow-hidden border border-rose-200 bg-slate-900">
                    <RealisticPhoto type="tray-a" className="w-full h-full" />
                  </div>
                  <p className="text-xs text-slate-600 line-through">
                    &ldquo;Place the finished unit in Tray A.&rdquo;
                  </p>
                </div>

                {/* After */}
                <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    After
                  </span>
                  <div className="h-28 rounded-lg overflow-hidden border border-emerald-300 bg-slate-900">
                    <RealisticPhoto type="tray-b" className="w-full h-full" />
                  </div>
                  <p className="text-xs text-emerald-950 font-bold">
                    &ldquo;Place the finished unit in Tray B.&rdquo;
                  </p>
                </div>
              </div>

              {/* Summary of change & Provenance */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 leading-relaxed border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Provenance &amp; Validation</span>
                </div>
                <p>
                  Tray updated from A to B based on worker question from Minh. Verified against standard work by An (Team lead). Clearer photo of Tray B added.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Change log note (optional) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Change log note
              </h2>
              <span className="text-[11px] text-slate-400">Auditable release history</span>
            </div>
            <textarea
              rows={3}
              value={changeLogNote}
              onChange={(e) => setChangeLogNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition resize-none leading-relaxed"
            />
          </div>

          {/* Card 3: Who will be notified */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">
              Who will be notified
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <MinhAvatar size="w-7 h-7" name="M" />
                <div className="flex-1">
                  <span className="font-extrabold text-slate-900 block">Minh</span>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Asked question · will receive direct notification &amp; reply
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    All Assembly Line A team members
                  </span>
                  <span className="text-[11px] text-slate-400">12 team members</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Ready to publish? & Checklist (Image 4) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Ready to publish?
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All checks passed. Instruction is ready to be published.
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>Step numbers and sequence verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>Clear photos for each step</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>Worker question addressed with reply</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>No conflicting instructions</span>
              </div>
            </div>

            {/* Mandatory Facilitator Confirmation Checks */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition">
                <input
                  type="checkbox"
                  checked={state.facilitatorCheckedDetails}
                  onChange={() => toggleFacilitatorConfirmation('details')}
                  className="mt-0.5 rounded text-blue-600"
                />
                <span className="font-medium text-slate-800">
                  I checked the task details and references against the standard work.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs transition">
                <input
                  type="checkbox"
                  checked={state.facilitatorCheckedAccessibleOpportunity}
                  onChange={() => toggleFacilitatorConfirmation('accessible')}
                  className="mt-0.5 rounded text-blue-600"
                />
                <span className="font-medium text-slate-800">
                  I provided an accessible opportunity for Minh to ask or suggest.
                </span>
              </label>
            </div>

            {/* Publish Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                id="btn-confirm-publish-instruction"
                disabled={!canPublish}
                onClick={handlePublish}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish instruction</span>
              </button>

              <button
                onClick={() => setScreen('facilitator')}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
              >
                Save as draft
              </button>

              <button
                onClick={() => setScreen('facilitator')}
                className="w-full py-2 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Botanical Quote Corner */}
          <BotanicalCorner phrase="Clear instructions, confident teams." />
        </div>
      </div>
    </div>
  );
};

