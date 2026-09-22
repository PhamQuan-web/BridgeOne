import React from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';
import {
  Users,
  ShieldCheck,
  Award,
  HeartHandshake,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';

export const TeamScreen: React.FC = () => {
  const { state, setScreen, switchPersona } = useHandoff();
  const isFacilitator = state.activePersona === 'facilitator';

  const members = [
    {
      id: 'minh',
      name: 'Minh',
      role: 'Assembly Specialist',
      hearingStatus: 'Deaf · VSL Dominant',
      preferredComm: 'Visual step cards, In-task clarifications',
      currentTask: 'INS-1042: Pack finished assemblies',
      status: state.lifecycleStage === 'worker_sent' ? 'Clarification Pending' : 'On Line A',
      statusColor: state.lifecycleStage === 'worker_sent' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800',
      isMinh: true,
      stats: '1,420 assemblies completed · 99.8% precision',
    },
    {
      id: 'an',
      name: 'An',
      role: 'Team Lead & Facilitator',
      hearingStatus: 'Hearing · Inclusive Lead Ally',
      preferredComm: 'Visual SOP updates, Rapid step verification',
      currentTask: 'Supervising Line A · Shift 1',
      status: 'Active on Line A',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isAn: true,
      stats: 'Avg clarification turnaround: 2.1 mins',
    },
    {
      id: 'lan',
      name: 'Lan',
      role: 'Quality Inspector (QC)',
      hearingStatus: 'Hearing Ally · VSL Level 1 Certified',
      preferredComm: 'Visual color tagging & digital sign-off',
      currentTask: 'QC Audit: Harness batch #402',
      status: 'Active on Line A',
      statusColor: 'bg-emerald-100 text-emerald-800',
      stats: 'Inspection clearance: 100%',
    },
    {
      id: 'hung',
      name: 'Hùng',
      role: 'Material Handler & Logistics',
      hearingStatus: 'Hearing Ally',
      preferredComm: 'Direct Tray staging, Staging light signals',
      currentTask: 'Restocking Tray B & packaging cartons',
      status: 'Active in Staging',
      statusColor: 'bg-emerald-100 text-emerald-800',
      stats: 'Staging replenishment: On time',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ADC Stage 6 · Inclusive Workplace Roster
              </span>
              <span className="text-xs text-slate-400 font-semibold">Assembly Line A</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Line A Inclusive Team &amp; Allies
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear communication preferences, active task visibility, and peer support networks — bridging the empathy and understanding gap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchPersona(isFacilitator ? 'worker' : 'facilitator')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Switch to {isFacilitator ? 'Minh (Worker)' : 'An (Lead)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Inclusive Lead Score
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">99.4%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero communication blame incidents</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Clarification Speed
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">2.1 min</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fastest response in plant</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Shift Sightline
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">360° Clear</div>
          <div className="text-[11px] text-slate-500 mt-0.5">U-shaped layout active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Active Roster
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">4 / 4 On Shift</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Line A operating at capacity</div>
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {member.isAn ? (
                    <AnAvatar size="w-12 h-12" />
                  ) : (
                    <MinhAvatar size="w-12 h-12" name={member.name[0]} />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-950">{member.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {member.role}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">
                      {member.hearingStatus}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${member.statusColor}`}
                >
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Preferred Communication Style
                  </span>
                  <span className="font-semibold text-slate-800">{member.preferredComm}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Active Assignment
                  </span>
                  <span className="font-semibold text-slate-900">{member.currentTask}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{member.stats}</span>
              {member.isMinh ? (
                <button
                  onClick={() => setScreen('worker_detail')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <span>View Task INS-1042</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Pillar 2 Intermediary & Mediator Support (ADC Brief Callout) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-3xl p-6 border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-700" />
            <h3 className="font-extrabold text-sm sm:text-base text-blue-950">
              ADC Brief Connector: On-Call VSL Professional Mediator
            </h3>
          </div>
          <p className="text-xs text-blue-900/80 max-w-2xl leading-relaxed">
            Addressing the brief constraint: <em>&ldquo;Absence of specialized HR agencies or connectors to act as mediators&rdquo;</em>. Line A has direct on-demand video access to certified Vietnamese Sign Language interpreters for complex HR reviews or safety briefings.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 shrink-0">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Connect VSL Mediator (Video)</span>
        </button>
      </div>
    </div>
  );
};
