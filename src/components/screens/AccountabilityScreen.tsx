import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { MinhAvatar, AnAvatar } from '../common/BrandGraphics';
import {
  ShieldCheck,
  Scale,
  Award,
  TrendingUp,
  FileCheck2,
  AlertOctagon,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  BadgeCheck,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const AccountabilityScreen: React.FC = () => {
  const { state, setScreen, selectStep } = useHandoff();
  const [activeTab, setActiveTab] = useState<'justice' | 'career'>('justice');

  const isResolvedOrPublished =
    state.lifecycleStage === 'facilitator_replied' ||
    state.lifecycleStage === 'question_closed' ||
    state.lifecycleStage === 'published_v1';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ADC Stage 4 &amp; 5 Framework
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Objective Accountability &amp; Progression
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Workplace Justice &amp; Competency Passport
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Eliminating the blame culture through verifiable provenance stamps, and transitioning high-skilled Deaf employees from precarious collaborator wages (25k–30k/h) to formal full-time contracts (10M–15M VNĐ/month).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                selectStep('step-2');
                setScreen('worker_detail');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Xem trạm thao tác (INS-1042)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('justice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'justice'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Stage 4: Workplace Justice &amp; Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'career'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Stage 5: Competency Passport &amp; 12M–15M Career Path</span>
        </button>
      </div>

      {activeTab === 'justice' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Misconduct vs. Instruction Defect
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                100% Clarified
              </div>
              <p className="text-[11px] text-slate-500">
                Defective draft SOP was flagged by worker before packaging errors occurred.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Resolution Turnaround
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600">
                2.1 Minutes
              </div>
              <p className="text-[11px] text-slate-500">
                Instant digital clarification avoided 4 hours of assembly line halt.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Worker Protection Score
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Zero Penalty
              </div>
              <p className="text-[11px] text-slate-500">
                Immutable log proves worker acted in accordance with SOP safety norms.
              </p>
            </div>
          </div>

          {/* Audit Trail Case Log: INS-1042 Incident */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    CASE #2026-INS-1042
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Verified Non-Blame Resolution
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Incident Review: Tray A Staging Conflict vs. Instruction Accuracy
                </h3>
              </div>

              <div className="text-xs text-slate-500">
                Assembly Line A · Workstation 04
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 text-slate-700 font-bold text-xs">
                  01
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Initial Draft Assignment (Draft d1)</span>
                    <span className="text-slate-400">08:00 AM</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    SOP Draft specified placing harness assemblies into <strong>Tray A</strong>. Lead An published draft for assembly run.
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0 text-rose-800 font-bold text-xs">
                  02
                </div>
                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-950">
                      Physical Conflict Discovered &amp; Flagged by Minh
                    </span>
                    <span className="text-rose-600 font-medium">08:14 AM</span>
                  </div>
                  <p className="text-xs text-rose-900/80">
                    Tray A at Station 04 was already full of parts from Shift 3. Instead of guessing or forcing items, Minh flagged: <em>&ldquo;Khay A đã đầy. Có chuyển sang Khay B không?&rdquo;</em> via the in-task question card.
                  </p>
                  <div className="text-[11px] font-semibold text-rose-800 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Prevented $800 in potential component warping or drop damages.</span>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-xs">
                  03
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950">
                      Lead Confirmation &amp; Provenance Stamp Issued
                    </span>
                    <span className="text-emerald-700 font-medium">08:16 AM</span>
                  </div>
                  <p className="text-xs text-emerald-900/80">
                    Lead An confirmed Tray B usage and atomically updated the SOP. The system generated the audit stamp:
                  </p>
                  <div className="mt-2 p-2.5 rounded-xl bg-white border border-emerald-300/80 flex items-center gap-2 text-xs font-mono font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✔ Verified by An · Provenance: Worker Question Handoff · No Fault Accrued to Worker</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Callout Box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold uppercase tracking-wide text-[10px] text-blue-800 block">
                ADC Hackathon Stage 4 Employer Worry Answered:
              </span>
              <p className="leading-relaxed">
                <em>&ldquo;If a mistake happens, how do we determine who is at fault when the PwDs employee cannot easily explain their side?&rdquo;</em> — Cùng Nhịp provides complete mathematical and chronological auditability. The root cause is categorized as an <strong>Instruction Defect</strong> promptly corrected, protecting both the worker from unjust discipline and the company from costly miscommunication.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div className="space-y-6">
          {/* Stage 5: Competency Passport Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <MinhAvatar size="w-14 h-14" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-950">Minh</h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Full-Time Candidate Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assembly Specialist · Line A · Certified Precision Assembly
                  </p>
                </div>
              </div>

              {/* Progress to Formal Employment Contract */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-right sm:min-w-64">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Transition to Full-Time Contract (12M–15M VNĐ)
                </span>
                <div className="text-xl font-extrabold text-emerald-950 mt-0.5">
                  94% Ready
                </div>
                <span className="text-[11px] text-emerald-800">
                  Target: Level 2 Assembly Lead Engineer
                </span>
              </div>
            </div>

            {/* Comparison: Precarious Collaborator vs. Cùng Nhịp Competency-Based Full-time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide block">
                  Conventional Reality (ADC Stage 5 Barrier)
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="line-through text-slate-400">
                    • Blocked by degree benchmark: Required 12/12 certificate
                  </p>
                  <p className="line-through text-slate-400">
                    • Stuck at Part-time Collaborator: 25k–30k VNĐ/hour
                  </p>
                  <p className="line-through text-slate-400">
                    • No social or medical insurance for family protection
                  </p>
                  <p className="line-through text-slate-400">
                    • Unseen technical skills: Assumed limited capability
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide block">
                  Cùng Nhịp Competency-Based Path (Stage 5 Solution)
                </span>
                <div className="space-y-1.5 text-xs text-blue-950 font-medium">
                  <p>✔ <strong>1,420 Verifiable Assemblies:</strong> 99.8% precision record</p>
                  <p>✔ <strong>Formal Full-Time Contract:</strong> 12,500,000 VNĐ/month base</p>
                  <p>✔ <strong>Full Social &amp; Medical Insurance:</strong> Fully compliant</p>
                  <p>✔ <strong>SOP Co-Creator:</strong> 3 approved safety/ergonomic updates</p>
                </div>
              </div>
            </div>

            {/* Competency Badges Verified by Machine & Lead */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wide text-slate-900">
                Verified On-The-Job Competencies (Skills Over Degrees)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Precision Wiring</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    100% pass on magnified wire harness continuity tests.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">SOP Continuous Quality</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Active contributor to clear standard work visual cards.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Visual Safety Leader</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Level 1 Sightline &amp; Strobe Beacon certified.
                  </p>
                </div>
              </div>
            </div>

            {/* HR Sign-off Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-emerald-950">
                  Ready for Labor Contract Elevation (Q4/2026)
                </span>
                <p className="text-[11px] text-emerald-800">
                  Verified by Team Lead An &amp; Plant Production Manager. Meets all requirements for non-degree skills-based hiring.
                </p>
              </div>

              <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>Issue Labor Contract Proposal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
