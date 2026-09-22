import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { WORKPLACE_TEMPLATES, WorkplaceIndustry } from '../../types/workplaces';
import {
  Briefcase,
  Coffee,
  Cpu,
  Package,
  ShoppingBag,
  Sliders,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

export const WorkplaceTemplateSwitcher: React.FC = () => {
  const { state, switchWorkplaceTemplate } = useHandoff();
  const { isVi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentTemplate = WORKPLACE_TEMPLATES[state.activeIndustry] || WORKPLACE_TEMPLATES.electronics;

  const getIndustryIcon = (industry: WorkplaceIndustry, className = 'w-4 h-4') => {
    switch (industry) {
      case 'electronics':
        return <Cpu className={className} />;
      case 'fnb':
        return <Coffee className={className} />;
      case 'logistics':
        return <Package className={className} />;
      case 'retail':
        return <ShoppingBag className={className} />;
      case 'office':
        return <Briefcase className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div className="relative select-none">
      {/* TRIGGER BUTTON */}
      <button
        id="btn-workplace-switcher"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-bold shadow-xs border border-slate-700"
        title={isVi ? 'Chuyển đổi kịch bản ngành nghề Universal Design' : 'Switch Universal Design Workplace Template'}
      >
        <span className="p-1 rounded-md bg-blue-600 text-white">
          {getIndustryIcon(state.activeIndustry, 'w-3.5 h-3.5')}
        </span>
        <div className="text-left hidden sm:block">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold leading-none">
            Universal Workplace
          </span>
          <span className="text-xs font-extrabold text-white leading-tight">
            {isVi ? currentTemplate.nameVi.split('/')[0] : currentTemplate.name.split('/')[0]}
          </span>
        </div>
        <Sliders className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <div>
                <h4 className="font-extrabold text-xs">Workplace Template Engine</h4>
                <p className="text-[10px] text-slate-300">
                  {isVi
                    ? 'Universal Design đồng nhất cho mọi môi trường'
                    : 'Consistent Universal Design across all environments'}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-mono border border-blue-500/30">
              {isVi ? '5 Ngành' : '5 Industries'}
            </span>
          </div>

          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {(Object.keys(WORKPLACE_TEMPLATES) as WorkplaceIndustry[]).map((key) => {
              const item = WORKPLACE_TEMPLATES[key];
              const isSelected = state.activeIndustry === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    switchWorkplaceTemplate(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200 text-blue-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {getIndustryIcon(key, 'w-4 h-4')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        {isVi ? item.nameVi : item.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                      {item.tagline}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {isVi ? `Nhiệm vụ: ${item.taskId}` : `Task: ${item.taskId}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
            {isVi
              ? '💡 Dù ở ngành nào, quy trình làm rõ 2 chiều và tem Provenance vẫn hoạt động nhất quán!'
              : '💡 In every industry, 2-way clarification and Provenance stamps remain fully consistent!'}
          </div>
        </div>
      )}
    </div>
  );
};
