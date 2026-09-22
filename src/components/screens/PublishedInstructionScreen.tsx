import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { RealisticPhoto } from '../common/RealisticPhotos';
import { AnAvatar, MinhAvatar, BotanicalCorner } from '../common/BrandGraphics';
import {
  ArrowLeft,
  CheckCircle2,
  Printer,
  Share2,
  Clock,
  Check,
  FileText,
  MessageSquarePlus,
  X,
  Send,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';

export const PublishedInstructionScreen: React.FC = () => {
  const { state, setScreen, playTextToSpeech } = useHandoff();
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [followUpSent, setFollowUpSent] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const fullInstructionText =
    "Pack finished units. Step 1: Check unit is complete. Step 2: Gently place the finished unit in Tray B. Step 3: Attach green Completed label. Step 4: Take Tray B to the staging rack.";

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;
    setFollowUpSent(true);
    setTimeout(() => {
      setFollowUpSent(false);
      setAskModalOpen(false);
      setFollowUpText('');
    }, 1500);
  };

  const handleShare = () => {
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
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
      </div>

      {/* Main Two-Column Layout (Matching Image 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Title, Live Banner, 4 Steps */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                PUBLISHED
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Assembly Line A
              </span>
              <span className="text-xs text-slate-400 font-medium">INS-1042</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Pack finished assemblies
              </h1>
              {/* Cursive quote */}
              <div className="flex items-center gap-1 transform rotate-[-2deg]">
                <span className="font-handwriting text-blue-600 text-xl font-bold">
                  Clear instructions, smooth operations.
                </span>
                <div className="text-emerald-500 flex gap-0.5 ml-1">
                  <span className="font-bold text-xs">/</span>
                  <span className="font-bold text-xs">|</span>
                  <span className="font-bold text-xs">\</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-medium">
              Pack completed units into the correct tray for next stage.
            </p>

            {/* Meta tags & TTS audio */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-600">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 shadow-2xs">
                Medium
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~ 5 minutes
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 shadow-2xs">
                Standard Work
              </span>

              {/* Text to Speech Button */}
              <button
                id="btn-published-tts"
                onClick={() => playTextToSpeech(fullInstructionText)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 shadow-2xs border ${
                  state.ttsPlaying
                    ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-blue-700 border-blue-200'
                }`}
                title="Read aloud instructions"
              >
                {state.ttsPlaying ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Read aloud</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Top Success Banner */}
          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
              ✓
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs text-emerald-950">
                This instruction is live and published.
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Version 2.0 was verified and published today by An (Team lead). Changes from Minh&apos;s feedback have been incorporated atomically.
              </p>
            </div>
          </div>

          {/* Steps Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Steps (4)
            </h2>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      Check unit is complete
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Make sure all components are securely attached and no parts are loose.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-40 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="inspect-unit" className="w-full h-full" />
                </div>
              </div>

              {/* Step 2 (Updated) */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl bg-emerald-50/30 border border-emerald-200 shadow-2xs transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        Place in tray
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Updated
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Gently place the finished unit in <strong className="text-blue-700 font-bold underline">Tray B</strong>.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-40 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-emerald-300 shadow-2xs">
                  <RealisticPhoto type="tray-b" className="w-full h-full" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      Add label
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Attach a green &ldquo;Completed&rdquo; label to the top of the unit.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-40 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="completed-label" className="w-full h-full" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/70 border border-slate-100 transition">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      Move to next stage
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Take <strong className="text-blue-700 font-bold">Tray B</strong> to the staging rack.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-40 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs">
                  <RealisticPhoto type="staging-rack" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Details, Version History, Questions/Feedback */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Instruction details */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
              Instruction details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Version</span>
                <span className="font-bold text-slate-900">2.0 (Latest)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Published</span>
                <span className="font-semibold text-slate-800">Today at 10:24 AM</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Facilitator</span>
                <span className="font-bold text-slate-900">An (Team lead)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Originating Worker</span>
                <span className="font-semibold text-blue-700">Minh (Question handoff)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Work Area</span>
                <span className="font-semibold text-slate-800">Assembly Line A</span>
              </div>
            </div>

            {/* Print & Share actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print SOP</span>
              </button>
              <button
                onClick={handleShare}
                className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? 'Link copied!' : 'Share link'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Version history */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
              Version history
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">v2.0 (Current)</span>
                  <span className="text-[11px] text-slate-400">Today, 10:24 AM</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Updated tray location from A to B based on worker feedback.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">v1.0</span>
                  <span className="text-[11px] text-slate-400">Oct 12, 8:00 AM</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Initial standard work publication.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Questions or feedback? */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
              Questions or feedback?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Even after publication, you can always ask questions or suggest improvements.
            </p>
            <button
              id="published-ask-question-btn"
              onClick={() => setAskModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Ask a question</span>
            </button>
          </div>

          {/* Botanical Corner */}
          <BotanicalCorner phrase="Together we build better workflows." />
        </div>
      </div>

      {/* Follow-up question modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-950">
                  Ask about this instruction
                </h3>
              </div>
              <button
                onClick={() => setAskModalOpen(false)}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {followUpSent ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Question sent to An (Team lead)!</span>
              </div>
            ) : (
              <form onSubmit={handleSendFollowUp} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Have a suggestion or encounter a question on the line? An will receive your message directly.
                </p>
                <textarea
                  rows={3}
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition resize-none"
                  required
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAskModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

