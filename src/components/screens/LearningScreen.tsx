import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { AILearningMentor } from './AILearningMentor';
import {
  GraduationCap,
  ShieldAlert,
  Eye,
  CheckCircle2,
  BookOpen,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  Info,
  BadgeCheck,
  Video,
  Bot,
} from 'lucide-react';

export const LearningScreen: React.FC = () => {
  const { setScreen } = useHandoff();
  const [activeCategory, setActiveCategory] = useState<'safety' | 'handoff' | 'vsl' | 'career' | 'ai_mentor'>('ai_mentor');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ADC Stage 4 &amp; 6 · Onboarding &amp; Skill Retention
              </span>
              <span className="text-xs text-slate-400 font-semibold">Visual Micro-learning</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Workplace Safety &amp; Skills Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed for Deaf &amp; Hard of Hearing team members and hearing allies — zero auditory dependencies, 100% visual SOPs and architectural safety protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Progress: 4 / 6 Completed
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveCategory('ai_mentor')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'ai_mentor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>AI Mentor Hỏi Đáp (SOP &amp; An Toàn)</span>
        </button>

        <button
          onClick={() => setActiveCategory('safety')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'safety'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pillar 3: Plant Safety &amp; Blind-Corner LEDs</span>
        </button>

        <button
          onClick={() => setActiveCategory('handoff')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'handoff'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Pillar 1: BridgeOne Two-Way Handoff</span>
        </button>

        <button
          onClick={() => setActiveCategory('vsl')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'vsl'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Shopfloor VSL Quick Signs</span>
        </button>

        <button
          onClick={() => setActiveCategory('career')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'career'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>Pillar 2: Workplace Justice &amp; Career Path</span>
        </button>
      </div>

      {/* Tab 0: AI Mentor Q&A */}
      {activeCategory === 'ai_mentor' && <AILearningMentor />}

      {/* Tab 1: Safety & Pillar 3 Architectural */}
      {activeCategory === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Blind-Corner LED Visual Warning */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Architectural Pillar
                </span>
                <span className="text-xs text-slate-400">Section 3.1</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Blind-Corner LED Warning System
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn the visual light codes installed at door intersections and blind corners. Amber strobes indicate an approaching trolley or forklift within 10 meters.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Green Solid: Clear path</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>Amber Flash: Slow down &amp; check sightline</span>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Review Visual Protocol (3 min)</span>
            </button>
          </div>

          {/* Card 2: Sightline U-Shaped Layout */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Eye className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  Universal Design
                </span>
                <span className="text-xs text-slate-400">Section 3.2</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Sightline &amp; U-Shaped Workstations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Why our Assembly Line A is oriented in a U-shape: unobstructed sightlines allow instant non-verbal eye contact and hand cues across all 4 workstations.
              </p>
            </div>

            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-blue-900">
              <strong>Sightline Principle:</strong> Never place high storage racks behind worker back rests to eliminate startle reflex.
            </div>

            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Layout Diagram</span>
            </button>
          </div>

          {/* Card 3: Emergency Evacuation Visual Beacons */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                  Critical EHS
                </span>
                <span className="text-xs text-slate-400">Section 3.3</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Visual Fire Alarm &amp; Evacuation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Replaces sirens with high-intensity dual-color ceiling strobes. Learn assembly points and buddy protocol with your shift partner.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong>Evacuation Buddy:</strong> An (Lead) &amp; Lan (QC Inspector) check Line A staging zones before exiting.
            </div>

            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
              <Play className="w-3.5 h-3.5 text-blue-600" />
              <span>Watch Visual Walkthrough</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Cùng Nhịp Two-Way Handoff Workflow */}
      {activeCategory === 'handoff' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-950">
              The Reciprocal Handoff Protocol (Quy trình bàn giao 2 chiều)
            </h2>
            <p className="text-xs text-slate-600">
              How Cùng Nhịp protects both worker and company from miscommunication errors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Visual Task Inspection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Worker reviews instructions visually. If a bin is full (like Tray A in Task INS-1042), click <strong>[Ask or suggest]</strong> right on that step.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">In-Task Clarification Flag</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flags step with &ldquo;Needs Clarification&rdquo;. The worker is formally protected: work is paused safely without blame for idle time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Provenance Stamp Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lead confirms destination (Tray B). System stamps <strong>✔ Verified by An</strong>, creating a permanent audit trail.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setScreen('worker_detail')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <span>Practice in Task INS-1042</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Shopfloor VSL Quick Signs */}
      {activeCategory === 'vsl' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-950">
              Essential Vietnamese Sign Language (VSL) on Line A
            </h2>
            <p className="text-xs text-slate-600">
              5 essential signs used by both hearing allies and Deaf specialists for quick communication without shouting across machines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { sign: 'Tạm dừng (Pause)', desc: 'Flat hand facing forward at chest level', symbol: '✋' },
              { sign: 'Khay A / Khay B', desc: 'Finger gesture shape A or B towards staging shelf', symbol: '📦' },
              { sign: 'Cần hỗ trợ (Support)', desc: 'Two hands clasping upward toward lead', symbol: '🤝' },
              { sign: 'Đã xong (Done)', desc: 'Two open palms turning outward twice', symbol: '✅' },
              { sign: 'Chất lượng tốt (OK)', desc: 'Thumb up with visual contact nod', symbol: '👍' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="text-3xl">{item.symbol}</div>
                <h4 className="font-bold text-slate-900 text-xs">{item.sign}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Workplace Justice & Career Growth */}
      {activeCategory === 'career' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Stage 5: Value-Compensation Gap
            </span>
            <h2 className="text-lg font-extrabold text-slate-950 mt-1">
              Path from Collaborator to Full-Time Assembly Specialist
            </h2>
            <p className="text-xs text-slate-600">
              How Cùng Nhịp provides the auditable track record required by HR to transition high-performing Deaf workers from 25k–30k/h collaborator status to 10–15M VND full-time salaried contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Without Cùng Nhịp (The Barrier)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                HR relies on rigid degrees (12/12) and fears liability if errors happen. PwDs are kept on disposable hourly contracts without medical insurance.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-2">
              <h4 className="font-bold text-emerald-950 text-xs">With Cùng Nhịp (The Solution)</h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Every task has verified visual logs and zero-fault clarification history. Skill-based competency is demonstrated with objective data, giving leadership confidence for permanent hiring.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
