import React, { useState } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { WORKPLACE_TEMPLATES } from '../../types/workplaces';
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  Eye,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Users,
  FileCheck2,
  AlertCircle,
  Hand,
  Volume2,
} from 'lucide-react';

interface QnAPair {
  id: string;
  question: string;
  answer: string;
  visualCue: string;
  sopReference: string;
  isEscalated?: boolean;
}

const COMMUNICATION_GUIDELINES = [
  {
    id: 'cg-1',
    ruleNumber: '01',
    title: 'Ánh nhìn trực diện & Bình đẳng (Direct Sightline)',
    subtitle: 'Dành cho Quản lý & Đồng nghiệp nghe',
    desc: 'Luôn đứng đối diện và nhìn thẳng vào mặt người khiếm thính khi giao tiếp. Tuyệt đối không vừa đi vừa nói, không nói khi đang quay lưng về phía họ vì họ cần đọc khẩu hình và quan sát biểu cảm khuôn mặt.',
    example: '✓ Đúng: Bước tới trước trạm, chạm nhẹ vai hoặc vẫy tay ra hiệu, chờ họ ngước lên rồi mới bắt đầu giao tiếp.',
  },
  {
    id: 'cg-2',
    ruleNumber: '02',
    title: 'Thị giác hóa chỉ đạo & Tránh ẩn dụ (Visual Directives)',
    subtitle: 'Ngôn từ rõ ràng, đơn nghĩa',
    desc: 'Người Điếc bẩm sinh sử dụng cấu trúc ngữ pháp ngôn ngữ ký hiệu (VSL), vốn từ vựng tiếng Việt viết trừu tượng có thể bị hạn chế. Hãy dùng câu chủ ngữ - vị ngữ ngắn gọn, kèm hình ảnh mẫu thực tế hoặc chỉ thẳng vào vị trí khay kệ.',
    example: '✓ Đúng: "Đặt cụm bo mạch vào Khay B." (Kèm chỉ tay vào khay màu xanh). Tránh nói: "Em giải quyết cái này cho xong trước trưa nhé".',
  },
  {
    id: 'cg-3',
    ruleNumber: '03',
    title: 'Xác nhận thấu hiểu 2 chiều (Closed-Loop Confirmation)',
    subtitle: 'Chống hiểu lầm ngầm trong vận hành',
    desc: 'Không hỏi câu hỏi đóng chung chung như "Có hiểu không?". Hãy đề nghị họ thực hiện thử thao tác mẫu (visual demonstration) hoặc bấm xác nhận trên BridgeOne.',
    example: '✓ Đúng: Minh bấm thẻ "Đã hiểu" hoặc thực hiện mẫu 1 sản phẩm đầu tiên trước sự chứng kiến của Quản lý An.',
  },
  {
    id: 'cg-4',
    ruleNumber: '04',
    title: 'Tôn trọng không gian làm việc phi âm thanh',
    subtitle: 'Ngăn ngừa giật mình và hoảng hốt',
    desc: 'Người khiếm thính không nghe thấy tiếng bước chân hay tiếng dụng cụ đặt xuống. Tránh vỗ mạnh bất ngờ từ phía sau lưng. Hãy bật đèn báo tín hiệu LED tại trạm hoặc gõ nhẹ lên mặt bàn thao tác để tạo độ rung nhẹ nhận biết.',
    example: '✓ Đúng: Bật công tắc đèn trạm sáng vàng hoặc gõ mặt bàn 2 nhịp trước khi trao đổi.',
  },
  {
    id: 'cg-5',
    ruleNumber: '05',
    title: 'Tận dụng công cụ trợ thị có sẵn của BridgeOne',
    subtitle: 'Chia sẻ trách nhiệm hòa nhập từ hai phía',
    desc: 'Khuyến khích quản lý sử dụng tính năng nói qua Mic (chuyển phụ đề tự động) và tôn trọng các câu thoại chuẩn bị sẵn của công nhân. Không ép buộc người khiếm thính phải tự đọc khẩu hình trong tiếng ồn máy móc.',
    example: '✓ Đúng: An bật mic trên BridgeOne nói: "Chuyển sang Khay B", hệ thống tự hiện phụ đề to và rõ trên màn hình Minh.',
  },
];

const VERIFIED_VSL_CARDS = [
  {
    id: 'vsl-1',
    phraseVi: 'Đợi một chút',
    usage: 'Dùng khi cần công nhân tạm dừng thao tác để quản lý kiểm tra hoặc lấy thêm linh kiện.',
    gestureDescription: 'Bàn tay phải mở, lòng bàn tay hướng về phía trước, các ngón tay khép nhẹ, đưa lên ngang ngực và ấn nhẹ về phía trước 1 nhịp.',
    icon: '✋',
    reviewer: 'Chuyên gia Khiếm thính & VSL Co-designer (Hội Người Điếc Hà Nội & TP.HCM)',
    contextNote: 'Cử chỉ phổ quát dễ hiểu cho mọi miền, không gây nhầm lẫn với dấu hiệu dừng khẩn cấp.',
  },
  {
    id: 'vsl-2',
    phraseVi: 'Đi theo tôi',
    usage: 'Dùng khi hướng dẫn công nhân mới chuyển sang trạm kiểm tra hoặc đi nhận bảo hộ lao động.',
    gestureDescription: 'Bàn tay phải khép, lòng bàn tay hướng vào trong ngực, vẫy nhẹ về phía mình 2 lần, sau đó xoay người chỉ hướng đi.',
    icon: '👉',
    reviewer: 'Kiểm định thực tế tại xưởng Chuyền May & Điện tử',
    contextNote: 'Thay thế việc kéo tay thô bạo, tôn trọng khoảng cách cá nhân tại nơi làm việc.',
  },
  {
    id: 'vsl-3',
    phraseVi: 'Nguy hiểm / Cẩn thận',
    usage: 'Cảnh báo vật cản, nhiệt độ cao, hóa chất hoặc khu vực xe nâng đang di chuyển.',
    gestureDescription: 'Hai bàn tay nắm lại thành nắm đấm, ngón trỏ và ngón cái mở hình chữ C, lắc nhẹ cổ tay hai bên kèm nét mặt mở to mắt cảnh giác.',
    icon: '⚠️',
    reviewer: 'Tiêu chuẩn An toàn Lao động PwD (ADC Roundtable 2026)',
    contextNote: 'Biểu cảm khuôn mặt là 50% ngữ nghĩa của cử chỉ này.',
  },
  {
    id: 'vsl-4',
    phraseVi: 'Họp giao ca ngay',
    usage: 'Tập trung toàn đội đầu giờ sáng hoặc sau giờ nghỉ trưa để phổ biến kế hoạch sản xuất.',
    gestureDescription: 'Hai bàn tay mở rộng, các ngón tay khum lại hướng vào nhau thành hình vòng tròn, khép dần lại tượng trưng cho sự tập hợp.',
    icon: '👥',
    reviewer: 'Tổ trưởng Chuyền A & Đại diện Công nhân Điếc',
    contextNote: 'Kèm theo đèn flash nhấp nháy trên bảng LED trạm máy.',
  },
];

export const AILearningMentor: React.FC = () => {
  const { state } = useHandoff();
  const currentTemplate = WORKPLACE_TEMPLATES[state.activeIndustry] || WORKPLACE_TEMPLATES.electronics;

  const [activeTab, setActiveTab] = useState<'qna' | 'guidelines' | 'vsl'>('qna');
  const [questionInput, setQuestionInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [chatHistory, setChatHistory] = useState<QnAPair[]>([
    {
      id: 'qa-1',
      question: 'Khi gặp sự cố hoặc khay/kệ bị đầy, quy tắc xử lý an toàn đầu tiên là gì?',
      answer: 'Quy tắc "Dừng - Báo hiệu - Xác minh" (Stop - Signal - Clarify): Dừng thao tác lập tức, bấm thẻ "Khay đầy" hoặc gắn Cờ đỏ trên màn hình BridgeOne để thông báo cho Lead An. Tuyệt đối không tự ý xếp chồng vật tư gây đổ vỡ hay sai lệch quy chuẩn.',
      visualCue: '🛑 Đèn LED trạm sẽ nhấp nháy vàng để báo hiệu hỗ trợ trực quan.',
      sopReference: `${currentTemplate.referenceStandard} · Mục An toàn trạm`,
    },
    {
      id: 'qa-2',
      question: 'Làm thế nào để hệ thống bảo vệ mình nếu có lỗi sai lệch xảy ra?',
      answer: 'BridgeOne ghi nhận toàn bộ chuỗi chứng cứ (Provenance Trail): tin nhắn xác nhận của Lead An, thời gian chốt và hình ảnh chụp vị trí mới. Nếu xảy ra nhầm lẫn, hồ sơ chứng minh lỗi do quy trình ban đầu chưa rõ, không phải lỗi cá nhân.',
      visualCue: '🛡️ Tem chứng nhận Provenance xanh lá được lưu trữ vĩnh viễn trên hệ thống.',
      sopReference: 'Pillar 2: Workplace Justice & Provenance Record',
    },
  ]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || isAnswering) return;

    const userQuestion = questionInput.trim();
    setQuestionInput('');
    setIsAnswering(true);

    setTimeout(() => {
      let answer = `Đối với ${currentTemplate.nameVi}: Cần tuân thủ chỉ dẫn trực quan từng bước (Step-by-step SOP). Kiểm tra mã số ${currentTemplate.taskId} trước khi chuyển công đoạn.`;
      let visualCue = '👁️ Đối chiếu hình ảnh mẫu và đèn chỉ báo xanh trên màn hình trạm.';
      let sopReference = `${currentTemplate.referenceStandard} · Tra cứu trích xuất SOP nội bộ`;
      let isEscalated = false;

      const qLower = userQuestion.toLowerCase();
      if (qLower.includes('đầy') || qLower.includes('hết')) {
        answer = `Khi ${currentTemplate.destinationLabel} bị đầy: Sử dụng tính năng câu thoại sẵn "Khay đầy" trên BridgeOne để xin lệnh chuyển sang ${currentTemplate.updatedDestination}. Hệ thống sẽ lưu bằng chứng đồng thuận của Lead An.`;
        visualCue = `📍 Vị trí dự phòng phê duyệt: ${currentTemplate.updatedDestination}.`;
      } else if (qLower.includes('khiếm thính') || qLower.includes('giao tiếp') || qLower.includes('nói')) {
        answer = 'BridgeOne dùng cơ chế giao tiếp 2 chiều phi âm thanh (Zero auditory dependencies). Bạn có thể bấm Sổ tay câu thoại chuẩn bị sẵn hoặc bật phụ đề trực tiếp Live STT/TTS.';
        visualCue = '💬 Bật thanh Live Conversation ở góc dưới màn hình.';
      } else if (qLower.includes('lương') || qLower.includes('hợp đồng') || qLower.includes('kỷ luật')) {
        answer = 'Nội dung này thuộc thẩm quyền Pháp lý & Nhân sự (HR). AI không tự ý đưa ra kết luận. Vui lòng bấm liên hệ trực tiếp Quản lý An hoặc Phòng Nhân sự Công ty để được giải quyết chính xác theo Bộ luật Lao động.';
        visualCue = '⚖️ Quy tắc Human Escalation: Đã chuyển tiếp yêu cầu đến Quản lý.';
        sopReference = 'Nguyên tắc Chống Ảo Giác: Từ chối tư vấn pháp lý vượt thẩm quyền';
        isEscalated = true;
      }

      const newQA: QnAPair = {
        id: 'qa-' + Date.now(),
        question: userQuestion,
        answer,
        visualCue,
        sopReference,
        isEscalated,
      };

      setChatHistory((prev) => [...prev, newQA]);
      setIsAnswering(false);
    }, 600);
  };

  const handleQuickQuestionClick = (q: string) => {
    setQuestionInput(q);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header with Anti-Hallucination & Provenance Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                BridgeOne AI Mentor
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero-Hallucination Guardrails Active</span>
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight mt-0.5">
              Học việc hòa nhập &amp; Sổ tay quy tắc xưởng
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Trợ lý thông minh không phán xét cho người khiếm thính, kết hợp cẩm nang thay đổi nhận thức cho đồng nghiệp nghe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Tiêu chuẩn: {currentTemplate.nameVi.split('/')[0]}</span>
          </span>
        </div>
      </div>

      {/* THREE CORE TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold select-none">
        <button
          type="button"
          onClick={() => setActiveTab('qna')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'qna'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Hỏi đáp SOP &amp; Quy tắc ({chatHistory.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guidelines')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'guidelines'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Sổ tay Giao tiếp Doanh nghiệp (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vsl')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'vsl'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Hand className="w-4 h-4" />
          <span>Ký hiệu VSL Thực tế (4)</span>
        </button>
      </div>

      {/* TAB 1: GROUNDED Q&A */}
      {activeTab === 'qna' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Anti-hallucination note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
            <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-slate-900 block">
                Cơ chế truy xuất có kiểm soát (Retrieval-Augmented SOP):
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mọi câu trả lời được đối chiếu nguyên văn với tài liệu quy trình thao tác chuẩn của nhà máy. AI bị khóa tính năng tự do bịa đặt nội dung và sẽ từ chối các câu hỏi nằm ngoài phạm vi công việc.
              </p>
            </div>
          </div>

          {/* Quick Suggested Questions */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Gợi ý câu hỏi thường gặp tại trạm của bạn:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTemplate.typicalQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickQuestionClick(q)}
                  className="text-left text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 px-3 py-1.5 rounded-xl transition text-slate-700 font-medium"
                >
                  ❓ {q}
                </button>
              ))}
            </div>
          </div>

          {/* Q&A Chat Log */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {chatHistory.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border space-y-3 ${
                  item.isEscalated
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-slate-50/90 border-slate-200/80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    Q
                  </span>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.question}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 pl-8 border-l-2 border-blue-500 ml-3 space-y-2">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {item.answer}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.visualCue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.sopReference}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isAnswering && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3 text-xs text-blue-700 font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>AI Mentor đang tra cứu kho SOP và kiểm duyệt dữ liệu an toàn...</span>
              </div>
            )}
          </div>

          {/* Ask Input Form */}
          <form onSubmit={handleAsk} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Hỏi về thao tác, an toàn, hoặc cách xử lý khi gặp khó khăn tại trạm..."
              className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
            />
            <button
              type="submit"
              disabled={!questionInput.trim() || isAnswering}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md shadow-blue-500/20 shrink-0"
            >
              <span>Hỏi ngay</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: COMMUNICATION GUIDELINES FOR THE WORKPLACE */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
            <span className="font-black text-indigo-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Sổ tay Văn hóa Giao tiếp Hòa nhập (Communication Guidelines)
            </span>
            <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
              Hòa nhập không thể chỉ đến từ nỗ lực đơn phương của người khiếm thính. Đây là 5 quy tắc vàng giúp đồng nghiệp nghe và các cấp quản lý thay đổi tư duy, loại bỏ sự lúng túng khi giao tiếp hàng ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {COMMUNICATION_GUIDELINES.map((guide) => (
              <div
                key={guide.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {guide.ruleNumber}
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 text-xs leading-snug">
                      {guide.title}
                    </h4>
                    <span className="text-[10px] text-blue-700 font-bold">
                      {guide.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.desc}
                </p>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-emerald-800 font-medium">
                  {guide.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN-VERIFIED VSL MICRO-LESSONS */}
      {activeTab === 'vsl' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-black text-emerald-900 flex items-center gap-1.5">
              <Hand className="w-4 h-4 text-emerald-600" />
              Ký hiệu VSL Thực tế đã Kiểm định (Human-Verified Micro-Lessons)
            </span>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              Vì ngôn ngữ ký hiệu Việt Nam (VSL) có biến thể vùng miền và ngữ cảnh công nghiệp đặc thù, BridgeOne <strong>tuyệt đối không dùng AI tạo cử chỉ tự do</strong>. 100% các cụm từ cốt lõi dưới đây được kiểm duyệt và ghi hình trực tiếp cùng đại diện người Điếc Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {VERIFIED_VSL_CARDS.map((card) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        &ldquo;{card.phraseVi}&rdquo;
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500">
                        {card.usage}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Đã kiểm duyệt
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold block mb-1">Mô tả cử chỉ thao tác:</strong>
                  {card.gestureDescription}
                </div>

                <div className="space-y-1 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Nguồn thẩm định: {card.reviewer}</span>
                  </div>
                  <p className="italic text-slate-400">{card.contextNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
