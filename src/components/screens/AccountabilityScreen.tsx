import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t, isVi } = useLanguage();
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
                {isVi ? 'Khung Tiêu chuẩn ADC Giai đoạn 4 & 5' : 'ADC Stage 4 & 5 Framework'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {isVi ? 'Trách nhiệm Minh bạch & Lộ trình Thăng tiến' : 'Objective Accountability & Career Progression'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              {isVi ? 'Hồ sơ Công bằng Nơi làm việc & Hộ chiếu Năng lực' : 'Workplace Justice & Competency Passport'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              {isVi
                ? 'Bảo vệ người lao động Điếc bằng tem lưu vết bất biến (Provenance Stamps), đồng thời đánh giá năng lực thực chứng để mở đường thăng tiến lên Kỹ thuật viên chính thức (12M–15M VNĐ/tháng).'
                : 'Eliminating the blame culture through verifiable provenance stamps, and promoting skilled Deaf technicians to Level 2 Leadership based on objective production data (12M–15M VNĐ/month).'}
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
              <span>{isVi ? 'Xem trạm thao tác (INS-1042)' : 'View Workstation (INS-1042)'}</span>
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
          <span>{isVi ? 'Giai đoạn 4: Công bằng Nơi làm việc & Nhật ký Lưu vết' : 'Stage 4: Workplace Justice & Audit Trail'}</span>
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
          <span>{isVi ? 'Giai đoạn 5: Hộ chiếu Năng lực & Lộ trình 12M–15M' : 'Stage 5: Competency Passport & 12M–15M Career Path'}</span>
        </button>
      </div>

      {activeTab === 'justice' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {isVi ? 'Lỗi Cá nhân vs. Lỗi Quy trình' : 'Misconduct vs. Instruction Defect'}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                {isVi ? '100% Đã làm rõ' : '100% Clarified'}
              </div>
              <p className="text-[11px] text-slate-500">
                {isVi
                  ? 'Bản nháp SOP có lỗi được công nhân phát hiện và báo cờ trước khi xảy ra sai sót đóng gói.'
                  : 'Defective draft SOP was flagged by worker before packaging errors occurred.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {isVi ? 'Thời gian Xử lý Thắc mắc' : 'Resolution Turnaround'}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600">
                {isVi ? '2.1 Phút' : '2.1 Minutes'}
              </div>
              <p className="text-[11px] text-slate-500">
                {isVi
                  ? 'Làm rõ trực tiếp qua hệ thống giúp tránh dừng dây chuyền 4 tiếng.'
                  : 'Instant digital clarification avoided 4 hours of assembly line halt.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {isVi ? 'Mức độ Bảo vệ Công nhân' : 'Worker Protection Score'}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {isVi ? 'Miễn trừ Lỗi 100%' : 'Zero Penalty'}
              </div>
              <p className="text-[11px] text-slate-500">
                {isVi
                  ? 'Nhật ký bất biến chứng minh công nhân đã thao tác đúng chuẩn an toàn.'
                  : 'Immutable log proves worker acted in accordance with SOP safety norms.'}
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
                    {isVi ? 'Xác minh Giải quyết Không Đổ lỗi' : 'Verified Non-Blame Resolution'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  {isVi
                    ? 'Đánh giá Sự việc: Xung đột Khay A vs. Tính Chính xác của Quy trình'
                    : 'Incident Review: Tray A Staging Conflict vs. Instruction Accuracy'}
                </h3>
              </div>

              <div className="text-xs text-slate-500">
                {isVi ? 'Dây chuyền A · Trạm thao tác 04' : 'Assembly Line A · Workstation 04'}
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
                    <span className="font-bold text-slate-900">
                      {isVi ? 'Giao việc Ban đầu (Bản nháp d1)' : 'Initial Draft Assignment (Draft d1)'}
                    </span>
                    <span className="text-slate-400">08:00 AM</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {isVi ? (
                      <>Bản nháp SOP quy định xếp cụm linh kiện vào <strong>Khay A</strong>. Quản lý An chia sẻ bản nháp cho ca trực.</>
                    ) : (
                      <>SOP Draft specified placing harness assemblies into <strong>Tray A</strong>. Lead An published draft for assembly run.</>
                    )}
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
                      {isVi
                        ? 'Phát hiện Xung đột Thực tế & Minh Báo cờ'
                        : 'Physical Conflict Discovered & Flagged by Minh'}
                    </span>
                    <span className="text-rose-600 font-medium">08:14 AM</span>
                  </div>
                  <p className="text-xs text-rose-900/80">
                    {isVi ? (
                      <>Khay A tại Trạm 04 đã đầy phôi từ ca 3. Thay vì tự đoán hoặc cố nhét vào, Minh đã báo cờ: <em>&ldquo;Khay A đã đầy. Có chuyển sang Khay B không?&rdquo;</em> trực tiếp trên thẻ công việc.</>
                    ) : (
                      <>Tray A at Station 04 was already full of parts from Shift 3. Instead of guessing or forcing items, Minh flagged: <em>&ldquo;Khay A đã đầy. Có chuyển sang Khay B không?&rdquo;</em> via the in-task question card.</>
                    )}
                  </p>
                  <div className="text-[11px] font-semibold text-rose-800 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>
                      {isVi
                        ? 'Ngăn chặn thiệt hại ước tính 18–20 triệu VNĐ do rơi vỡ hoặc cong vênh vi mạch.'
                        : 'Prevented $800 in potential component warping or drop damages.'}
                    </span>
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
                      {isVi
                        ? 'Quản lý Xác nhận & Đóng Tem Bằng chứng'
                        : 'Lead Confirmation & Provenance Stamp Issued'}
                    </span>
                    <span className="text-emerald-700 font-medium">08:16 AM</span>
                  </div>
                  <p className="text-xs text-emerald-900/80">
                    {isVi
                      ? 'Quản lý An xác nhận dùng Khay B và cập nhật tức thì vào SOP. Hệ thống đóng tem kiểm toán:'
                      : 'Lead An confirmed Tray B usage and atomically updated the SOP. The system generated the audit stamp:'}
                  </p>
                  <div className="mt-2 p-2.5 rounded-xl bg-white border border-emerald-300/80 flex items-center gap-2 text-xs font-mono font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isVi
                        ? '✔ Đã xác minh bởi Quản lý An · Nguồn gốc: Câu hỏi làm rõ của công nhân · Miễn trừ trách nhiệm'
                        : '✔ Verified by An · Provenance: Worker Question Handoff · No Fault Accrued to Worker'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Callout Box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold uppercase tracking-wide text-[10px] text-blue-800 block">
                {isVi ? 'Giải đáp Nỗi lo của Doanh nghiệp trong Hồ sơ ADC Hackathon:' : 'ADC Hackathon Stage 4 Employer Worry Answered:'}
              </span>
              <p className="leading-relaxed">
                {isVi ? (
                  <><em>&ldquo;Nếu xảy ra lỗi, làm thế nào xác định ai chịu trách nhiệm khi lao động khuyết tật khó giải trình bằng lời?&rdquo;</em> — Cùng Nhịp cung cấp khả năng kiểm toán lưu vết chuẩn xác 100%. Nguyên nhân gốc rễ được phân loại là <strong>Lỗi Chỉ dẫn (Instruction Defect)</strong> và được sửa chữa kịp thời, bảo vệ công nhân khỏi bị kỷ luật oan và bảo vệ nhà máy khỏi chi phí sai sót.</>
                ) : (
                  <><em>&ldquo;If a mistake happens, how do we determine who is at fault when the PwDs employee cannot easily explain their side?&rdquo;</em> — Cùng Nhịp provides complete mathematical and chronological auditability. The root cause is categorized as an <strong>Instruction Defect</strong> promptly corrected, protecting both the worker from unjust discipline and the company from costly miscommunication.</>
                )}
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
                      {isVi ? 'Đủ Tiêu chuẩn Nâng bậc & Ký HĐ Dài hạn' : 'Eligible for Level 2 Promotion'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isVi
                      ? 'Chuyên viên Lắp ráp · Dây chuyền A · Đánh giá Năng lực Thực chứng'
                      : 'Assembly Specialist · Line A · Verified On-The-Job Competencies'}
                  </p>
                </div>
              </div>

              {/* Progress to Level 2 Promotion & Formal Contract */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-right sm:min-w-64">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  {isVi ? 'Mức độ Sẵn sàng Nâng bậc (Khung lương 12.5M–15M VNĐ)' : 'Promotion Readiness (Salary Tier 12.5M–15M VNĐ)'}
                </span>
                <div className="text-xl font-extrabold text-emerald-950 mt-0.5">
                  {isVi ? '94% Đạt chuẩn' : '94% Qualified'}
                </div>
                <span className="text-[11px] text-emerald-800">
                  {isVi ? 'Mục tiêu: Kỹ thuật viên Lắp ráp Bậc 2' : 'Target: Level 2 Assembly Lead Specialist'}
                </span>
              </div>
            </div>

            {/* Enterprise Performance Scorecard */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-800">
                  {isVi ? 'Hồ sơ Năng lực Thực tế (Ca trực 04 · Dây chuyền A)' : 'Verified Production & Quality Scorecard (Line A · Station 04)'}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {isVi ? 'Đạt chuẩn Xuất sắc' : 'Top Tier Performer'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 block">{isVi ? 'Sản lượng Đạt chuẩn' : 'Verified Assemblies'}</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">1,420 Units</div>
                  <span className="text-[11px] font-bold text-emerald-600">99.8% precision record</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 block">{isVi ? 'Tuân thủ An toàn' : 'Safety Adherence'}</span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">100%</div>
                  <span className="text-[11px] text-slate-500">{isVi ? '0 vi phạm quy trình' : '0 safety infractions'}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 block">{isVi ? 'Đóng góp Cải tiến SOP' : 'SOP Co-Creation'}</span>
                  <div className="text-lg font-black text-blue-600 mt-0.5">3 Approved</div>
                  <span className="text-[11px] text-slate-500">{isVi ? 'Cùng Quản lý hoàn thiện' : 'Approved safety updates'}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 block">{isVi ? 'Lộ trình Thăng tiến' : 'Promotion Pathway'}</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">12.5M - 15M</div>
                  <span className="text-[11px] font-bold text-emerald-600">{isVi ? 'HĐ Lao động Dài hạn' : 'Full Insurance & Contract'}</span>
                </div>
              </div>
            </div>

            {/* Competency Badges Verified by Machine & Lead */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wide text-slate-900">
                {isVi ? 'Năng lực Đã Kiểm chứng Thực tế (Trọng Kỹ năng hơn Bằng cấp)' : 'Verified On-The-Job Competencies (Skills Over Degrees)'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      {isVi ? 'Đấu nối Dây chính xác' : 'Precision Wiring'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isVi ? 'Đạt 100% bài kiểm tra thông mạch dây cáp dưới kính lúp.' : '100% pass on magnified wire harness continuity tests.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      {isVi ? 'Đóng góp Cải tiến SOP' : 'SOP Continuous Quality'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isVi ? 'Thành viên tích cực đề xuất hoàn thiện thẻ chỉ dẫn trực quan.' : 'Active contributor to clear standard work visual cards.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      {isVi ? 'Tiên phong An toàn Trực quan' : 'Visual Safety Leader'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isVi ? 'Đạt chứng chỉ Bậc 1 về Quan sát Tầm nhìn & Đèn nháy cảnh báo.' : 'Level 1 Sightline & Strobe Beacon certified.'}
                  </p>
                </div>
              </div>
            </div>

            {/* HR Sign-off Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-emerald-950">
                  {isVi ? 'Đủ Điều kiện Ký Hợp đồng Lao động Chính thức (Quý 4/2026)' : 'Ready for Labor Contract Elevation (Q4/2026)'}
                </span>
                <p className="text-[11px] text-emerald-800">
                  {isVi
                    ? 'Đã được xác nhận bởi Quản lý An & Quản đốc Nhà máy. Đáp ứng trọn vẹn tiêu chuẩn tuyển dụng dựa trên kỹ năng thực chất.'
                    : 'Verified by Team Lead An & Plant Production Manager. Meets all requirements for non-degree skills-based hiring.'}
                </p>
              </div>

              <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>{isVi ? 'Phê duyệt Đề xuất Ký HĐ Lao động' : 'Issue Labor Contract Proposal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
