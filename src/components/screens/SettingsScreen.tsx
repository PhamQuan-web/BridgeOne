import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AnAvatar, MinhAvatar } from '../common/BrandGraphics';
import {
  Settings,
  Eye,
  Bell,
  Volume2,
  Sliders,
  CheckCircle2,
  Shield,
  Smartphone,
  Monitor,
  Zap,
  RotateCcw,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { state, switchPersona, resetDemo } = useHandoff();
  const { t } = useLanguage();
  const isFacilitator = state.activePersona === 'facilitator';

  // Universal Design settings state
  const [visualStrobeAlert, setVisualStrobeAlert] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'standard' | 'large' | 'terminal'>('standard');
  const [vslMode, setVslMode] = useState(true);
  const [autoSaveClarification, setAutoSaveClarification] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {t('settings.badge', 'Universal Design (UD) Settings')}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{t('settings.badge_sub', 'Perception & Ergonomics')}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              {t('settings.title', 'Accessibility & Workplace Preferences')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('settings.desc', 'Customize sensory modalities, visual notification strobes, and communication preferences for Assembly Line A.')}
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Settings className="w-4 h-4" />}
            <span>{savedSuccess ? t('settings.saved', 'Preferences Saved!') : t('settings.save', 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* User Persona Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
          {t('settings.active_profile', 'Active User Profile')}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            {isFacilitator ? <AnAvatar size="w-12 h-12" /> : <MinhAvatar size="w-12 h-12" name="M" />}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-950">
                  {isFacilitator ? 'An' : 'Minh'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isFacilitator ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}
                >
                  {isFacilitator ? t('persona.lead_title', 'Team lead') : t('role.worker', 'Assembly Specialist')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('settings.workstation_label', 'Workstation: Assembly Line A · Shift 1')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchPersona(isFacilitator ? 'worker' : 'facilitator')}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition flex items-center gap-2 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {t('settings.switch_persona_prefix', 'Switch to')} {isFacilitator ? 'Minh (Worker)' : 'An (Lead)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Group 1: Universal Design Principle 4 - Perceptible Information */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wide">
              {t('settings.p4_title', 'Principle 4: Perceptible Information & Alerts')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settings.p4_desc', 'Replace auditory-dependent sirens and bells with optical feedback.')}
          </p>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {/* Visual Strobe Alert Toggle */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="visual-strobe-toggle" className="font-bold text-xs text-slate-900 block cursor-pointer">
                {t('settings.strobe_title', 'Visual Screen Strobe on Clarification Reply')}
              </label>
              <p className="text-[11px] text-slate-500">
                {t('settings.strobe_desc', 'Flashes the workstation screen border in soft emerald or amber when a lead approves or updates an instruction.')}
              </p>
            </div>
            <button
              id="visual-strobe-toggle"
              role="switch"
              aria-checked={visualStrobeAlert}
              onClick={() => setVisualStrobeAlert(!visualStrobeAlert)}
              className={`w-12 h-6.5 rounded-full p-1 transition flex items-center shrink-0 ${
                visualStrobeAlert ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="high-contrast-toggle" className="font-bold text-xs text-slate-900 block cursor-pointer">
                {t('settings.contrast_title', 'High Contrast Mode (WCAG AAA)')}
              </label>
              <p className="text-[11px] text-slate-500">
                {t('settings.contrast_desc', 'Enhance edge definitions on task cards and Step 2 tray diagrams for low-light shopfloor environments.')}
              </p>
            </div>
            <button
              id="high-contrast-toggle"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6.5 rounded-full p-1 transition flex items-center shrink-0 ${
                highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Text Size Scaling */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-slate-900 block">
                {t('settings.typo_title', 'Workstation Typography Scale')}
              </span>
              <p className="text-[11px] text-slate-500">
                {t('settings.typo_desc', 'Optimized reading distance for standing 1.5 meters away from the line monitor.')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setTextSize('standard')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  textSize === 'standard' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('settings.scale_standard', 'Standard (16px)')}
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  textSize === 'large' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('settings.scale_large', 'Large (18px)')}
              </button>
              <button
                onClick={() => setTextSize('terminal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  textSize === 'terminal' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('settings.scale_terminal', 'Terminal (20px)')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Universal Design Principle 2 - Flexibility in Use */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wide">
              {t('settings.p2_title', 'Principle 2: Flexibility in Communication')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settings.p2_desc', 'Choose your preferred modal inputs and assistive tools.')}
          </p>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {/* VSL Quick Assistance */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="vsl-mode-toggle" className="font-bold text-xs text-slate-900 block cursor-pointer">
                {t('settings.vsl_title', 'Show Vietnamese Sign Language (VSL) Cues in Quick Prompts')}
              </label>
              <p className="text-[11px] text-slate-500">
                {t('settings.vsl_desc', 'Attaches VSL visual cue references to common phrases like "Khay A đầy" or "Cần hỗ trợ".')}
              </p>
            </div>
            <button
              id="vsl-mode-toggle"
              role="switch"
              aria-checked={vslMode}
              onClick={() => setVslMode(!vslMode)}
              className={`w-12 h-6.5 rounded-full p-1 transition flex items-center shrink-0 ${
                vslMode ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Tolerance for Error & Auto-Draft */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="auto-save-toggle" className="font-bold text-xs text-slate-900 block cursor-pointer">
                {t('settings.autosave_title', 'Auto-Draft Protection (Tolerance for Error)')}
              </label>
              <p className="text-[11px] text-slate-500">
                {t('settings.autosave_desc', 'Automatically preserve worker draft questions so questions are never accidentally wiped during shift change.')}
              </p>
            </div>
            <button
              id="auto-save-toggle"
              role="switch"
              aria-checked={autoSaveClarification}
              onClick={() => setAutoSaveClarification(!autoSaveClarification)}
              className={`w-12 h-6.5 rounded-full p-1 transition flex items-center shrink-0 ${
                autoSaveClarification ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-xs text-slate-900 block">
            {t('settings.reset_title', 'Reset Simulation Session')}
          </span>
          <p className="text-[11px] text-slate-500">
            {t('settings.reset_desc', 'Reverts all Task INS-1042 state back to initial Draft v1 (Khay A).')}
          </p>
        </div>
        <button
          onClick={resetDemo}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('settings.reset_btn', 'Reset Demo (Alt+R)')}</span>
        </button>
      </div>
    </div>
  );
};
