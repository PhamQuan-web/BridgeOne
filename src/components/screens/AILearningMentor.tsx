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
} from 'lucide-react';

interface QnAPair {
  id: string;
  question: string;
  answer: string;
  visualCue: string;
  sopReference: string;
}

export const AILearningMentor: React.FC = () => {
  const { state } = useHandoff();
  const currentTemplate = WORKPLACE_TEMPLATES[state.activeIndustry] || WORKPLACE_TEMPLATES.electronics;

  const [questionInput, setQuestionInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [chatHistory, setChatHistory] = useState<QnAPair[]>([
    {
      id: 'qa-1',
      question: 'Khi gặp sự cố hoặc khay/kệ bị đầy, quy tắc xử lý an toàn đầu tiên là gì?',
      answer: 'Quy tắc "Stop - Signal - Clarify": Dừng thao tác lập tức, bấm nút gắn Cờ đỏ (Red Flag) trên màn hình trạm BridgeOne để thông báo cho Lead An. Tuyệt đối không tự ý xếp chồng vật tư gây đổ vỡ hay sai lệch quy chuẩn.',
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

    // AI Mentor generates specialized, visual-first answer tailored to current industry SOP
    setTimeout(() => {
      let answer = `Đối với ${currentTemplate.nameVi}: Cần tuân thủ chỉ dẫn trực quan từng bước (Step-by-step SOP). Kiểm tra mã số ${currentTemplate.taskId} trước khi chuyển công đoạn.`;
      let visualCue = '👁️ Đối chiếu hình ảnh mẫu và đèn chỉ báo xanh trên màn hình trạm.';

      if (userQuestion.toLowerCase().includes('đầy') || userQuestion.toLowerCase().includes('hết')) {
        answer = `Khi ${currentTemplate.destinationLabel} bị đầy: Sử dụng tính năng "Hỏi & Đề xuất" trên BridgeOne để xin lệnh chuyển sang ${currentTemplate.updatedDestination}. Hệ thống sẽ lưu bằng chứng đồng thuận của Lead An.`;
        visualCue = `📍 Vị trí dự phòng phê duyệt: ${currentTemplate.updatedDestination}.`;
      } else if (userQuestion.toLowerCase().includes('khiếm thính') || userQuestion.toLowerCase().includes('giao tiếp')) {
        answer = 'BridgeOne dùng cơ chế giao tiếp 2 chiều phi âm thanh (Zero auditory dependencies). Bạn có thể bấm các thẻ câu nhanh (Quick Chips) hoặc bật phụ đề trực tiếp Live STT/TTS.';
        visualCue = '💬 Bật thanh Live Voice & Sign ở góc dưới màn hình.';
      }

      const newQA: QnAPair = {
        id: 'qa-' + Date.now(),
        question: userQuestion,
        answer,
        visualCue,
        sopReference: `${currentTemplate.referenceStandard} · AI Mentor Real-time Grounding`,
      };

      setChatHistory((prev) => [...prev, newQA]);
      setIsAnswering(false);
    }, 600);
  };

  const handleQuickQuestionClick = (q: string) => {
    setQuestionInput(q);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                BridgeOne AI Mentor
              </span>
              <span className="text-xs text-slate-400 font-medium">Grounded in SOP &amp; Safety</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Hỏi đáp trực quan quy trình &amp; An toàn lao động
            </h3>
            <p className="text-xs text-slate-600">
              Trợ lý thông minh giải đáp thắc mắc không dùng thuật ngữ phức tạp, kèm dẫn chứng thị giác cho người khiếm thính.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 self-start sm:self-auto">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Áp dụng chuẩn: {currentTemplate.nameVi.split('/')[0]}</span>
        </div>
      </div>

      {/* Suggested Questions based on Current Workplace */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Câu hỏi gợi ý thường gặp cho trạm hiện tại:</span>
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

      {/* Q&A Chat Stream */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {chatHistory.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            {/* User Question */}
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                Q
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                {item.question}
              </p>
            </div>

            {/* AI Visual Answer */}
            <div className="flex items-start gap-2.5 pl-8 border-l-2 border-blue-500 ml-3 space-y-2">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {item.answer}
                </p>

                {/* Visual Cue Badge */}
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.visualCue}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dẫn chứng tiêu chuẩn: {item.sopReference}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isAnswering && (
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3 text-xs text-blue-700 font-semibold animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>AI Mentor đang tra cứu SOP và trích xuất chỉ dẫn trực quan...</span>
          </div>
        )}
      </div>

      {/* Ask Input Form */}
      <form onSubmit={handleAsk} className="flex items-center gap-2 pt-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Hỏi AI Mentor về thao tác, an toàn, hoặc cách xử lý khi gặp khó khăn..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>
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
  );
};
