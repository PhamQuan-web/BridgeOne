import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
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
  Bot,
  Send,
  ClipboardCheck,
  Award,
  Users,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

const COMMUNICATION_GUIDELINES = [
  {
    id: 'cg-1',
    ruleNumber: '01',
    titleVi: 'Ánh nhìn trực diện & Bình đẳng (Direct Sightline)',
    titleEn: 'Direct Sightline & Respectful Posture',
    subtitleVi: 'Dành cho Quản lý & Đồng nghiệp nghe',
    subtitleEn: 'For Hearing Managers & Coworkers',
    descVi: 'Luôn đứng đối diện và nhìn thẳng vào mặt người khiếm thính khi giao tiếp. Tuyệt đối không vừa đi vừa nói, không nói khi đang quay lưng về phía họ vì họ cần đọc khẩu hình và quan sát biểu cảm khuôn mặt.',
    descEn: 'Always face the Deaf employee directly at eye level when communicating. Never speak while walking away or with your back turned, as lip-reading and facial cues are essential.',
    exampleVi: '✓ Đúng: Bước tới trước trạm, chạm nhẹ vai hoặc vẫy tay ra hiệu, chờ họ ngước lên rồi mới bắt đầu giao tiếp.',
    exampleEn: '✓ Correct: Approach the station, give a gentle wave or shoulder tap, wait for them to look up before speaking.',
  },
  {
    id: 'cg-2',
    ruleNumber: '02',
    titleVi: 'Thị giác hóa chỉ đạo & Tránh ẩn dụ (Visual Directives)',
    titleEn: 'Visual Directives & Clear Specifics',
    subtitleVi: 'Ngôn từ rõ ràng, đơn nghĩa',
    subtitleEn: 'Unambiguous, concrete phrasing',
    descVi: 'Người Điếc bẩm sinh sử dụng cấu trúc ngữ pháp ngôn ngữ ký hiệu (VSL), vốn từ vựng tiếng Việt viết trừu tượng có thể bị hạn chế. Hãy dùng câu chủ ngữ - vị ngữ ngắn gọn, kèm hình ảnh mẫu thực tế hoặc chỉ thẳng vào vị trí khay kệ.',
    descEn: 'Native signers operate in VSL syntax where abstract written idioms can be confusing. Use concise subject-predicate instructions paired with concrete physical references or color-coded trays.',
    exampleVi: '✓ Đúng: "Đặt cụm bo mạch vào Khay B." (Kèm chỉ tay vào khay màu xanh). Tránh nói: "Em giải quyết cái này cho xong trước trưa nhé".',
    exampleEn: '✓ Correct: "Place circuit assembly into Tray B." (Point to the blue tote). Avoid vague: "Wrap this up before lunch."',
  },
  {
    id: 'cg-3',
    ruleNumber: '03',
    titleVi: 'Xác nhận thấu hiểu 2 chiều (Closed-Loop Confirmation)',
    titleEn: 'Closed-Loop Confirmation (Reciprocal Handoff)',
    subtitleVi: 'Chống hiểu lầm ngầm trong vận hành',
    subtitleEn: 'Preventing hidden operational misunderstandings',
    descVi: 'Không hỏi câu hỏi đóng chung chung như "Có hiểu không?". Hãy đề nghị họ thực hiện thử thao tác mẫu (visual demonstration) hoặc bấm xác nhận trên BridgeOne.',
    descEn: 'Do not ask generic questions like "Did you understand?". Ask for a physical demonstration of the first unit or confirmation on the BridgeOne screen.',
    exampleVi: '✓ Đúng: Minh bấm thẻ "Đã hiểu" hoặc thực hiện mẫu 1 sản phẩm đầu tiên trước sự chứng kiến của Quản lý An.',
    exampleEn: '✓ Correct: Minh taps "Understood" or completes one sample unit in front of Lead An.',
  },
  {
    id: 'cg-4',
    ruleNumber: '04',
    titleVi: 'Tôn trọng không gian làm việc phi âm thanh',
    titleEn: 'Respecting the Non-Auditory Workspace',
    subtitleVi: 'Ngăn ngừa giật mình và hoảng hốt',
    subtitleEn: 'Preventing startle and panic',
    descVi: 'Người khiếm thính không nghe thấy tiếng bước chân hay tiếng dụng cụ đặt xuống. Tránh vỗ mạnh bất ngờ từ phía sau lưng. Hãy bật đèn báo tín hiệu LED tại trạm hoặc gõ nhẹ lên mặt bàn thao tác để tạo độ rung nhẹ nhận biết.',
    descEn: 'Deaf workers cannot hear footsteps or placed tools. Never slap someone unexpectedly from behind. Toggle the station LED indicator or tap the workstation surface twice.',
    exampleVi: '✓ Đúng: Bật công tắc đèn trạm sáng vàng hoặc gõ mặt bàn 2 nhịp trước khi trao đổi.',
    exampleEn: '✓ Correct: Switch on the amber station light or double-tap the table before speaking.',
  },
  {
    id: 'cg-5',
    ruleNumber: '05',
    titleVi: 'Tận dụng công cụ trợ thị có sẵn của BridgeOne',
    titleEn: 'Leverage BridgeOne Visual Assistive Tools',
    subtitleVi: 'Chia sẻ trách nhiệm hòa nhập từ hai phía',
    subtitleEn: 'Shared inclusion responsibility from both sides',
    descVi: 'Khuyến khích quản lý sử dụng tính năng nói qua Mic (chuyển phụ đề tự động) và tôn trọng các câu thoại chuẩn bị sẵn của công nhân. Không ép buộc người khiếm thính phải tự đọc khẩu hình trong tiếng ồn máy móc.',
    descEn: 'Encourage leads to speak into the microphone (auto live subtitles) and respect workers’ prepared response presets. Never force workers to lip-read amid factory machinery roar.',
    exampleVi: '✓ Đúng: An bật mic trên BridgeOne nói: "Chuyển sang Khay B", hệ thống tự hiện phụ đề to và rõ trên màn hình Minh.',
    exampleEn: '✓ Correct: An speaks via mic: "Move to Tray B", BridgeOne displays clear enlarged subtitles for Minh.',
  },
];

export const LearningScreen: React.FC = () => {
  const { state, setScreen, addAssignedLesson, completeAssignedLesson } = useHandoff();
  const { isVi } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'ai_mentor' | 'assigned' | 'guidelines' | 'safety'>('ai_mentor');

  // State for Lead An creating a new micro-lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonCategory, setLessonCategory] = useState<'sop' | 'safety' | 'inclusion'>('sop');
  const [lessonDesc, setLessonDesc] = useState('');

  const isLeader = state.activePersona === 'facilitator';

  const handleAssignLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    addAssignedLesson({
      titleVi: lessonTitle.trim(),
      titleEn: lessonTitle.trim(),
      category: lessonCategory,
      assignedBy: isVi ? 'An · Tổ trưởng ca' : 'An · Shift Lead',
      targetWorker: isVi ? 'Minh · Trạm 04' : 'Minh · Station 04',
      durationMinutes: 2,
      summaryVi:
        lessonDesc.trim() || 'Bài học vi mô trực quan do Quản lý An chỉ định cho trạm làm việc.',
      summaryEn:
        lessonDesc.trim() || 'Visual micro-lesson assigned by Lead An for the workstation.',
      keySteps: [
        isVi ? 'Đọc kỹ hình ảnh thao tác và vị trí khay đích' : 'Inspect visual diagram & target bin',
        isVi ? 'Xác thực tem Provenance trước khi chuyển tiếp' : 'Verify Provenance stamp before handover',
      ],
    });

    setLessonTitle('');
    setLessonDesc('');
  };

  const completedLessonCount = state.assignedLessons.filter((l) => l.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner: Clean, uncluttered, focused on ADC Hackathon goals */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                {isVi ? 'ADC Giai đoạn 4, 5 & 6 · Học hỏi & Hòa nhập' : 'ADC Stage 4, 5 & 6 · Learning & Inclusion'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {isVi ? 'Trợ lý AI Grounded · Tri thức Doanh nghiệp' : 'Grounded AI Assistant · Enterprise Knowledge'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {isVi ? 'Trung tâm Học tập & Hỏi đáp Doanh nghiệp' : 'Workplace Learning & Enterprise AI Coach'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {isVi
                ? 'Hệ thống tri thức trực quan hỗ trợ người Khiếm thính thấu hiểu quy trình thao tác và văn hóa doanh nghiệp — Không bị bỏ lại, không phán xét.'
                : 'Visual knowledge center empowering Deaf specialists to master SOPs and enterprise policies without judgment.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>
                {isVi
                  ? `Bài học hoàn tất: ${completedLessonCount} / ${state.assignedLessons.length}`
                  : `Completed: ${completedLessonCount} / ${state.assignedLessons.length}`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Tabs: 4 Focused Top-Level Categories (NO NESTED TABS, NO VSL) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold select-none">
        <button
          onClick={() => setActiveCategory('ai_mentor')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'ai_mentor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>{isVi ? 'AI Trợ lý Doanh nghiệp (RAG Q&A)' : 'Enterprise AI Q&A (RAG)'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('assigned')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'assigned'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>
            {isLeader
              ? (isVi ? 'Soạn & Giao Bài học cho Minh' : 'Assign Lessons to Minh')
              : (isVi ? 'Bài học Vi mô Ca trực' : 'My Assigned Lessons')}
          </span>
          {state.assignedLessons.some((l) => l.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveCategory('guidelines')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'guidelines'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isVi ? 'Cẩm nang Lãnh đạo & Đồng minh (5)' : 'Inclusive Leadership Guidelines (5)'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('safety')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeCategory === 'safety'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isVi ? 'An toàn Mặt bằng & Đèn LED Góc khuất' : 'Plant Safety & Strobe LEDs'}</span>
        </button>
      </div>

      {/* TAB 1: SPACIOUS CONVERSATIONAL AI MENTOR */}
      {activeCategory === 'ai_mentor' && <AILearningMentor />}

      {/* TAB 2: BI-DIRECTIONAL MICRO-LESSONS (LEAD PUSHES / WORKER EARNS PASSPORT) */}
      {activeCategory === 'assigned' && (
        <div className="space-y-6">
          {isLeader ? (
            /* LEAD AN VIEW: Create & Assign Micro-Lessons */
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {isVi ? 'Công cụ Quản lý Ca' : 'Shift Lead Tool'}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-950 mt-1">
                    {isVi ? 'Soạn & Giao Bài học Vi mô Trực quan cho Trạm Minh' : 'Create & Assign Visual Micro-Lesson to Minh'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isVi
                      ? 'Giao bài học ngắn (1–2 phút) về thao tác linh kiện hoặc an toàn trực tiếp đến màn hình trạm của Minh.'
                      : 'Push 1-2 min visual micro-lessons directly to Minh’s workstation display.'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAssignLesson} className="space-y-4 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Tiêu đề bài học / Thao tác' : 'Lesson Title / SOP'}
                  </label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder={isVi ? 'Ví dụ: SOP INS-1042: Xử lý khi Khay A quá tải...' : 'e.g., SOP INS-1042: Handling overflow...'}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isVi ? 'Phân loại bài học' : 'Category'}
                    </label>
                    <select
                      value={lessonCategory}
                      onChange={(e: any) => setLessonCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="sop">{isVi ? 'Quy trình thao tác chuẩn (SOP)' : 'Standard SOP'}</option>
                      <option value="safety">{isVi ? 'An toàn mặt bằng & Đèn LED' : 'Plant Safety & LEDs'}</option>
                      <option value="inclusion">{isVi ? 'Lãnh đạo hòa nhập & Đồng minh' : 'Inclusive Leadership'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isVi ? 'Giao cho ai' : 'Assign to'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={isVi ? 'Minh · Chuyên viên Lắp ráp (Trạm 04)' : 'Minh · Assembly Specialist (Stn 04)'}
                      className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isVi ? 'Mô tả ngắn & Điểm kiểm tra trực quan' : 'Short Description & Key Visual Checkpoints'}
                  </label>
                  <textarea
                    rows={2}
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                    placeholder={isVi ? 'Mô tả các bước thao tác, vị trí khay hoặc đèn hiệu cần chú ý...' : 'Describe steps, tray locations, or visual beacons...'}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Quick suggestion tags */}
                  <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setLessonTitle(isVi ? 'SOP INS-1042: Quy trình đổi sang Khay B khi khay đầy' : 'SOP INS-1042: Tray B Overflow swap');
                        setLessonDesc(isVi ? 'Bước 1: Bấm "Hỏi/Đề xuất". Bước 2: Chờ Lead An xác nhận tem Provenance. Bước 3: Đặt bảng tên Khay B.' : 'Step 1: Click Ask/Suggest. Step 2: Await Lead Provenance stamp. Step 3: Tag Tray B.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold whitespace-nowrap"
                    >
                      + Mẫu Khay B
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLessonTitle(isVi ? 'An toàn: Quy tắc phản xạ khi Đèn Chớp Vàng Trụ 3 bật' : 'Safety: Pillar 3 Amber Strobe Reflex');
                        setLessonDesc(isVi ? 'Bước 1: Dừng xe đẩy. Bước 2: Nhìn góc mù bên phải. Bước 3: Chỉ bước ra khi đèn chuyển xanh.' : 'Step 1: Stop trolley. Step 2: Check blind corner right. Step 3: Proceed only when green.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold whitespace-nowrap"
                    >
                      + Mẫu Đèn Chớp Vàng
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!lessonTitle.trim()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Giao cho Minh ngay' : 'Assign to Minh'}</span>
                  </button>
                </div>
              </form>

              {/* List of currently assigned lessons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  {isVi ? 'Danh sách Bài học Đã giao cho Minh' : 'Lessons Assigned to Minh'} ({state.assignedLessons.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {state.assignedLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lesson.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {lesson.status === 'completed'
                              ? (isVi ? 'Minh đã hoàn thành (100%)' : 'Completed (100%)')
                              : (isVi ? 'Đang chờ Minh học' : 'Pending completion')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{lesson.assignedAt}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {isVi ? lesson.titleVi : lesson.titleEn}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {isVi ? lesson.summaryVi : lesson.summaryEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* WORKER MINH VIEW: Interactive Assigned Lessons -> Competency Passport */
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {isVi ? 'Nhiệm vụ Đào tạo Ca trực' : 'Shift Learning Tasks'}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-950 mt-1">
                    {isVi ? 'Bài học Vi mô Được Giao từ Quản lý An' : 'Micro-Lessons Assigned by Lead An'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isVi
                      ? 'Hoàn thành các bài học trực quan để tích lũy điểm thẩm định vào Hộ chiếu Năng lực cho Hợp đồng Chính thức Giai đoạn 6.'
                      : 'Complete visual lessons to earn verified competency credentials for your Stage 6 Full-Time Contract.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold">
                    {completedLessonCount} / {state.assignedLessons.length} {isVi ? 'Đã hoàn tất' : 'Completed'}
                  </div>
                </div>
              </div>

              {/* Cards for each assigned lesson */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.assignedLessons.map((lesson) => {
                  const isCompleted = lesson.status === 'completed';
                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition ${
                        isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {lesson.category.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{lesson.assignedAt}</span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {isVi ? lesson.titleVi : lesson.titleEn}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isVi ? lesson.summaryVi : lesson.summaryEn}
                        </p>

                        {/* Key Checkpoints */}
                        {lesson.keySteps && lesson.keySteps.length > 0 && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold text-slate-700 block">
                              {isVi ? 'Điểm kiểm tra trực quan:' : 'Visual Checkpoints:'}
                            </span>
                            {lesson.keySteps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div>
                        {isCompleted ? (
                          <div className="w-full py-2 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border border-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isVi ? 'Đã tích lũy Hộ chiếu Năng lực (100%)' : 'Credited to Passport (100%)'}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => completeAssignedLesson(lesson.id, 100)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                            <span>{isVi ? 'Đã hiểu & Xác nhận hoàn thành' : 'Mark Lesson as Completed'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 5 INCLUSIVE COMMUNICATION GUIDELINES FOR HEARING ALLIES & MANAGERS */}
      {activeCategory === 'guidelines' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
          <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
            <span className="font-black text-indigo-900 flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-indigo-600" />
              {isVi ? 'Cẩm nang Lãnh đạo & Đồng nghiệp Hòa nhập (5 Quy tắc Vàng)' : '5 Principles for Deaf-Inclusive Leadership'}
            </span>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">
              {isVi
                ? 'Hòa nhập không thể chỉ đến từ nỗ lực đơn phương của người khiếm thính. Đây là 5 quy tắc vàng giúp đồng nghiệp nghe và các cấp quản lý thay đổi tư duy, loại bỏ sự lúng túng khi giao tiếp hàng ngày tại xưởng.'
                : 'Inclusion is a two-way commitment. These 5 core guidelines help hearing coworkers and leaders collaborate smoothly.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMUNICATION_GUIDELINES.map((guide) => (
              <div
                key={guide.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {guide.ruleNumber}
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm leading-snug">
                      {isVi ? guide.titleVi : guide.titleEn}
                    </h4>
                    <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                      {isVi ? guide.subtitleVi : guide.subtitleEn}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isVi ? guide.descVi : guide.descEn}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-emerald-800 font-medium">
                  {isVi ? guide.exampleVi : guide.exampleEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLANT SAFETY & SIGHTLINE U-SHAPED LAYOUT */}
      {activeCategory === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Blind-Corner LED Visual Warning */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {isVi ? 'Trụ cột 3' : 'Pillar 3'}
                </span>
                <span className="text-xs text-slate-400">{isVi ? 'An toàn Mặt bằng' : 'Plant Safety'}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isVi ? 'Hệ thống Đèn LED Cảnh báo Góc khuất' : 'Blind-Corner LED Warning System'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isVi
                  ? 'Tìm hiểu các mã đèn cảnh báo lắp tại ngã rẽ và góc mù. Đèn chớp vàng báo hiệu xe đẩy hoặc xe nâng đang đến gần trong phạm vi 10 mét.'
                  : 'Learn the visual light codes installed at door intersections and blind corners. Amber strobes indicate an approaching trolley or forklift within 10 meters.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isVi ? 'Xanh đứng yên: Đường thông thoáng' : 'Green Solid: Clear path'}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>{isVi ? 'Vàng nhấp nháy: Giảm tốc độ & quan sát tầm nhìn' : 'Amber Flash: Slow down & check sightline'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Sightline U-Shaped Layout */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Eye className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {isVi ? 'Thiết kế Phổ quát' : 'Universal Design'}
                </span>
                <span className="text-xs text-slate-400">{isVi ? 'Tầm nhìn Chữ U' : 'U-Shape Sightline'}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isVi ? 'Tầm nhìn Thông suốt & Bàn làm việc Chữ U' : 'Sightline & U-Shaped Workstations'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isVi
                  ? 'Dây chuyền A xếp hình chữ U: tầm nhìn không vật cản giúp giao tiếp mắt và cử chỉ tay tức thì giữa 4 trạm thao tác.'
                  : 'Why our Assembly Line A is oriented in a U-shape: unobstructed sightlines allow instant non-verbal eye contact across all 4 stations.'}
              </p>
            </div>

            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-blue-900">
              <strong>{isVi ? 'Nguyên tắc Tầm nhìn: ' : 'Sightline Principle: '}</strong>
              {isVi
                ? 'Không bao giờ để kệ cao phía sau lưng ghế nhân viên nhằm triệt tiêu phản xạ giật mình.'
                : 'Never place high storage racks behind worker back rests to eliminate startle reflex.'}
            </div>
          </div>

          {/* Card 3: Emergency Evacuation Visual Beacons */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                  {isVi ? 'An toàn Khẩn cấp' : 'Critical EHS'}
                </span>
                <span className="text-xs text-slate-400">{isVi ? 'Sơ tán Trực quan' : 'Visual Evacuation'}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isVi ? 'Báo cháy Trực quan & Sơ tán' : 'Visual Fire Alarm & Evacuation'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isVi
                  ? 'Thay thế còi hú bằng đèn chớp trần hai màu cường độ cao. Điểm tập kết và quy tắc bạn đồng hành (Buddy) với bạn cùng ca.'
                  : 'Replaces sirens with high-intensity dual-color ceiling strobes. Learn assembly points and buddy protocol.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong>{isVi ? 'Bạn đồng hành sơ tán: ' : 'Evacuation Buddy: '}</strong>
              {isVi
                ? 'An (Chuyền trưởng) & Lan (Kiểm định QC) kiểm tra các khu đệm trước khi rời vị trí.'
                : 'An (Lead) & Lan (QC Inspector) check Line A staging zones before exiting.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
