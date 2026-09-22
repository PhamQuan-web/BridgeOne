import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import {
  FolderKanban,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';

export const ResourcesScreen: React.FC = () => {
  const { setScreen } = useHandoff();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const resources = [
    {
      id: 'SOP-INS-1042',
      code: 'SOP-INS-1042',
      title: 'Pack Finished Assemblies (Assembly Line A)',
      version: 'v2.0 (Updated to Tray B)',
      category: 'Standard Work',
      provenance: '✔ Verified by An · Provenance: Worker Question Handoff',
      date: 'Today',
      description: 'Step-by-step visual packing instructions for high-volume electrical units, updated with Tray B staging.',
      isGoldenFlow: true,
      downloads: '142 views',
    },
    {
      id: 'SOP-SAF-002',
      code: 'SOP-SAF-002',
      title: 'Blind-Corner LED & Sightline Plant Floor Protocol',
      version: 'v1.4 Official',
      category: 'Safety & EHS',
      provenance: 'Approved by Plant EHS Committee',
      date: '15 Sep 2026',
      description: 'Architectural Pillar 3 specification: Strobe patterns, forklift crossings, and zero-blindspot U-layouts.',
      isGoldenFlow: false,
      downloads: '89 views',
    },
    {
      id: 'SOP-HR-001',
      code: 'SOP-HR-001',
      title: 'Non-Verbal & Text-Based Inclusive Interview Protocol',
      version: 'v1.1 Pilot',
      category: 'HR & Recruitment',
      provenance: 'ADC Hackathon Roundtable 2026',
      date: '02 Sep 2026',
      description: 'Stage 3 Brief solution: Standardized protocols for HR to conduct fair, barrier-free evaluations without oral guessing.',
      isGoldenFlow: false,
      downloads: '64 views',
    },
    {
      id: 'SOP-ACC-004',
      code: 'SOP-ACC-004',
      title: 'Workplace Justice & Disciplinary Evidence Guidelines',
      version: 'v2.1 Legal Approved',
      category: 'Policy & Governance',
      provenance: 'Labor Law & Inclusion Taskforce',
      date: '20 Aug 2026',
      description: 'Stage 4 Brief solution: Objective audit trails distinguishing instruction defects from deliberate misconduct.',
      isGoldenFlow: false,
      downloads: '112 views',
    },
    {
      id: 'TMPL-VIS-008',
      code: 'TMPL-VIS-008',
      title: 'Universal Design 7-Principle Checklist for Shopfloor SOPs',
      version: 'v3.0 Template',
      category: 'Templates',
      provenance: 'Universal Design Institute',
      date: '10 Aug 2026',
      description: 'Formatting checklist for creating visual instructions with 44px touch targets, zero auditory cues, and low cognitive fatigue.',
      isGoldenFlow: false,
      downloads: '230 views',
    },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'all' || res.category.toLowerCase().includes(filterTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                SOP &amp; Policy Repository
              </span>
              <span className="text-xs text-slate-400 font-semibold">Audited &amp; Accessible</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Standard Work &amp; Policy Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Official operating standards, inclusive HR interview guidelines, and objective accountability frameworks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScreen('published')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Published SOP (INS-1042)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standards by SOP code or keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'Standard Work', 'Safety & EHS', 'HR & Recruitment', 'Policy & Governance'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                filterTag === tag
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tag === 'all' ? 'All Resources' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xs flex flex-col justify-between space-y-4 transition hover:shadow-md ${
              res.isGoldenFlow ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200/90'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {res.code}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {res.version}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {res.title}
                </h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mt-1">
                  {res.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.description}
              </p>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1 font-medium">{res.provenance}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">{res.date}</span>

              {res.isGoldenFlow ? (
                <button
                  onClick={() => setScreen('published')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open SOP</span>
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>PDF Card</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
