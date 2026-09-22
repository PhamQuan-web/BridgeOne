import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { MinhAvatar, AnAvatar } from '../common/BrandGraphics';
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Eye,
  Filter,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Calendar,
  Tag,
  Check,
} from 'lucide-react';

export const TasksHubScreen: React.FC = () => {
  const { state, setScreen, selectStep } = useHandoff();
  const isFacilitator = state.activePersona === 'facilitator';
  const [filterState, setFilterState] = useState<'all' | 'active' | 'review' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status for INS-1042 responds dynamically to the Golden Flow lifecycle
  const ins1042Status = (() => {
    switch (state.lifecycleStage) {
      case 'worker_sent':
        return {
          label: 'Needs Clarification (Khay A)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          dotColor: 'bg-rose-500 animate-pulse',
        };
      case 'facilitator_replied':
        return {
          label: 'Updated to Khay B · Ready to resume',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dotColor: 'bg-emerald-500',
        };
      case 'published_v1':
        return {
          label: 'Published Official v1.0',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          dotColor: 'bg-blue-500',
        };
      default:
        return {
          label: 'In Progress (Active Shift)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          dotColor: 'bg-amber-500',
        };
    }
  })();

  const taskList = [
    {
      id: state.taskId,
      title: state.taskTitle,
      line: state.workArea,
      assignee: 'Minh (Chuyên viên trạm)',
      stepsCount: state.steps.length,
      currentStep: state.isDestinationUpdated
        ? `Đích mới: ${state.destination}`
        : `Bước 2: ${state.steps[1]?.title || 'Đặt vào vị trí'}`,
      category: 'Quy trình chuẩn Universal SOP',
      priority: 'Nhiệm vụ ưu tiên',
      estimatedTime: state.estimatedDuration,
      progress: state.lifecycleStage === 'published_v1' ? 100 : 66,
      status: ins1042Status,
      isGolden: true,
      hasIssue: state.lifecycleStage === 'worker_sent',
    },
    {
      id: 'INS-1039',
      title: 'Pre-flight Wire Harness Solder Inspection',
      line: 'Assembly Line A · Station 02',
      assignee: 'Minh & Lan (QC)',
      stepsCount: 4,
      currentStep: 'Step 4: Magnifier Continuity Check',
      category: 'Quality Control',
      priority: 'Standard',
      estimatedTime: '30 mins',
      progress: 100,
      status: {
        label: 'Completed (100% Quality Pass)',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        dotColor: 'bg-slate-400',
      },
      isGolden: false,
      hasIssue: false,
    },
    {
      id: 'INS-1045',
      title: 'Visual Labeling & Barcode Verification',
      line: 'Assembly Line A · Station 05',
      assignee: 'Minh',
      stepsCount: 2,
      currentStep: 'Waiting for INS-1042 batch release',
      category: 'Dispatch Logistics',
      priority: 'Scheduled',
      estimatedTime: '20 mins',
      progress: 0,
      status: {
        label: 'Queued (Next in Line)',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotColor: 'bg-indigo-400',
      },
      isGolden: false,
      hasIssue: false,
    },
    {
      id: 'SOP-SAF-002',
      title: 'Weekly Blind-Corner LED Beacon Sensor Test',
      line: 'Plant Floor Safety System',
      assignee: 'Hùng & An (Lead)',
      stepsCount: 5,
      currentStep: 'Step 3: Strobe luminosity calibration',
      category: 'Safety & EHS',
      priority: 'Routine',
      estimatedTime: '15 mins',
      progress: 60,
      status: {
        label: 'In Review by Lead',
        badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        dotColor: 'bg-cyan-500',
      },
      isGolden: false,
      hasIssue: false,
    },
  ];

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterState === 'active') return matchesSearch && task.progress > 0 && task.progress < 100;
    if (filterState === 'review') return matchesSearch && task.hasIssue;
    if (filterState === 'completed') return matchesSearch && task.progress === 100;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Shift Tasks Hub
              </span>
              <span className="text-xs text-slate-400 font-semibold">Assembly Line A · Shift 1</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Assigned Tasks &amp; SOP Instructions
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear visual instruction cards, real-time status flags, and step-level clarification tracking for each assigned task.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                selectStep('step-2');
                setScreen('worker_detail');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Resume Active Task (INS-1042)</span>
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
            placeholder="Search task by ID, name or category..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'active', label: 'In Progress' },
            { id: 'review', label: 'Needs Clarification' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                filterState === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border transition hover:shadow-md ${
              task.isGolden
                ? 'border-blue-400 ring-2 ring-blue-100/80 shadow-xs'
                : 'border-slate-200/90 shadow-2xs'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {task.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${task.status.badgeColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${task.status.dotColor}`} />
                    {task.status.label}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {task.line}
                  </span>
                  {task.isGolden && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      ★ Golden Flow Task
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                    <span>
                      <strong className="text-slate-700">Assignee:</strong> {task.assignee}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">Current:</strong> {task.currentStep}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">Est. Time:</strong> {task.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-2 max-w-md">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress: {task.progress}%</span>
                    <span>{task.stepsCount} visual steps</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        task.progress === 100
                          ? 'bg-emerald-500'
                          : task.hasIssue
                          ? 'bg-rose-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                {task.isGolden ? (
                  <>
                    <button
                      onClick={() => {
                        selectStep('step-2');
                        setScreen('worker_detail');
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                    >
                      <span>Open Task Workstation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {isFacilitator && (
                      <button
                        onClick={() => setScreen('facilitator')}
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lead Workspace</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center gap-1.5"
                  >
                    <span>Inspect Log</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
