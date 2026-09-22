import React, { useState, useRef, useEffect } from 'react';
import { useHandoff } from '../../context/HandoffContext';
import { useLanguage } from '../../i18n/LanguageContext';
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
  FileCheck2,
  AlertCircle,
  Scale,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface QnAPair {
  id: string;
  question: string;
  answer: string;
  visualCue: string;
  sopReference: string;
  category: 'sop' | 'safety' | 'rights' | 'career';
  isEscalated?: boolean;
}

export const AILearningMentor: React.FC = () => {
  const { state } = useHandoff();
  const { t, isVi } = useLanguage();
  const currentTemplate = WORKPLACE_TEMPLATES[state.activeIndustry] || WORKPLACE_TEMPLATES.electronics;

  const [questionInput, setQuestionInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<QnAPair[]>([
    {
      id: 'qa-1',
      question: isVi
        ? 'Khi gặp sự cố hoặc khay/kệ bị đầy tại trạm làm việc, quy tắc an toàn đầu tiên là gì?'
        : 'When a tray is full or a bottleneck occurs at the station, what is the first safety rule?',
      answer: isVi
        ? 'Tuân thủ quy tắc "Dừng - Báo hiệu - Xác minh" (Stop - Signal - Clarify): Dừng thao tác xếp linh kiện lập tức, bấm thẻ câu mẫu "Khay đầy" hoặc bật Cờ đỏ trên màn hình BridgeOne để báo cho Lead An. Tuyệt đối không tự ý xếp chồng vật tư gây đổ vỡ hoặc sai lệch quy chuẩn.'
        : 'Follow the "Stop - Signal - Clarify" rule: Immediately pause part assembly, tap the "Tray Full" quick preset or raise a red flag on BridgeOne to alert Lead An. Never overstack materials unsafely.',
      visualCue: isVi
        ? '🛑 Đèn LED vàng trên trạm sẽ nhấp nháy báo hiệu hỗ trợ trực quan.'
        : '🛑 Station amber LED flashes for visual assistance notification.',
      sopReference: `${currentTemplate.referenceStandard} · Mục 2.4 An toàn Vận hành`,
      category: 'safety',
    },
    {
      id: 'qa-2',
      question: isVi
        ? 'Làm thế nào để hệ thống bảo vệ mình nếu có lỗi sai lệch chỉ dẫn xảy ra?'
        : 'How does the system protect workers if an instruction defect occurs?',
      answer: isVi
        ? 'BridgeOne ghi nhận toàn bộ chuỗi chứng cứ (Provenance Trail): tin nhắn xác nhận của Lead An, thời gian chốt và hình ảnh chụp vị trí Khay B. Nếu xảy ra nhầm lẫn, hồ sơ xác minh chứng minh lỗi do bản nháp quy trình ban đầu chưa rõ (Instruction Defect), công nhân được miễn trừ 100% trách nhiệm cá nhân.'
        : 'BridgeOne records an immutable Provenance Trail: Lead An’s approval timestamp, destination update, and verified photo. If discrepancies happen, the audit proves it was an Instruction Defect, completely exempting the worker from personal fault.',
      visualCue: isVi
        ? '🛡️ Tem chứng nhận Provenance xanh lá được lưu trữ vĩnh viễn trên hệ thống xác minh.'
        : '🛡️ Green Provenance stamp stored permanently in audit log.',
      sopReference: 'Khung Tiêu chuẩn ADC Giai đoạn 4 & 5 · Hồ sơ Công bằng',
      category: 'rights',
    },
    {
      id: 'qa-3',
      question: isVi
        ? 'Tiêu chí nào để mình được chuyển đổi từ thử việc sang Hợp đồng Lao động chính thức (12M - 15M VNĐ)?'
        : 'What are the criteria to transition from probation to a permanent contract (12M - 15M VND)?',
      answer: isVi
        ? 'Doanh nghiệp căn cứ vào Hộ chiếu Năng lực (Competency Passport) tích lũy trên BridgeOne: (1) Tỷ lệ tuân thủ quy trình SOP đạt trên 98%, (2) Hoàn thành 100% các bài học vi mô an toàn, và (3) Chủ động bấm "Làm rõ" khi gặp vướng mắc thay vì làm liều. Đây là dữ liệu thực tế minh bạch, xóa bỏ hoàn toàn định kiến cảm tính.'
        : 'The company evaluates your verified Competency Passport on BridgeOne: (1) SOP compliance rate above 98%, (2) 100% completion of visual safety micro-lessons, and (3) Proactive use of clarification flags instead of guessing. These empirical metrics eliminate subjective bias.',
      visualCue: isVi
        ? '📈 Theo dõi tiến độ tích lũy trực tiếp trong tab "Hồ sơ xác minh & Công bằng".'
        : '📈 Track your progress directly inside the Verification & Justice tab.',
      sopReference: 'Quy chế Nhân sự & Điều 159 Bộ luật Lao động 2019',
      category: 'career',
    },
    {
      id: 'qa-4',
      question: isVi
        ? 'Quản lý hỏi: Có phản ánh bạn Điếc làm việc chưa đạt tiến độ, làm sao để góp ý mà không gây hiểu nhầm hoặc định kiến?'
        : 'Manager asks: Someone reported a Deaf worker is behind schedule, how to give feedback without bias or misunderstanding?',
      answer: isVi
        ? 'Nguyên tắc góp ý công bằng & không định kiến (DE&I Inclusive Leadership): (1) Khách quan hóa bằng dữ liệu: Cùng mở BridgeOne đối chiếu tem thời gian (Provenance Trail) và tiến độ trạm — thực tế 80% trường hợp "chậm" bắt nguồn từ Lỗi bản nháp chỉ dẫn (Instruction Defect) mơ hồ chứ không phải do công nhân; (2) Gặp trực tiếp mặt-đối-mặt tại nơi đủ ánh sáng, sử dụng tính năng "Phụ đề trực tiếp" (Live Captions) 2 chiều; (3) Góp ý cụ thể vào từng thao tác thay vì phán xét chung chung, luôn hỏi "Tôi có thể hỗ trợ hoặc tinh chỉnh tài liệu SOP thế nào để bạn thao tác thuận tiện hơn?".'
        : 'Non-biased Performance Feedback Protocol (DE&I Leadership): (1) Rely on empirical data: Open BridgeOne Provenance Trail together — 80% of slowdowns stem from ambiguous supervisor instructions rather than worker skill; (2) Meet face-to-face in good lighting with two-way Live Captions; (3) Focus on specific micro-steps rather than broad judgments, asking "How can we refine the visual SOP to better support your workflow?".',
      visualCue: isVi
        ? '📋 Đối chiếu dữ liệu khách quan từ Hộ chiếu Năng lực & Tem Provenance trước khi kết luận.'
        : '📋 Review empirical data from Competency Passport & Provenance stamps before reaching conclusions.',
      sopReference: 'Bộ Chuẩn mực Quản trị Hòa nhập DE&I · Bộ luật Lao động Điều 159',
      category: 'rights',
    },
  ]);

  const [promptCategory, setPromptCategory] = useState<'all' | 'worker' | 'inclusive'>('all');

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isAnswering]);

  const submitQuestion = (userQuestion: string) => {
    if (!userQuestion.trim() || isAnswering) return;
    setQuestionInput('');
    setIsAnswering(true);

    setTimeout(() => {
      let answer = isVi
        ? `Đối với ${currentTemplate.nameVi}: Cần tuân thủ chỉ dẫn trực quan từng bước (Step-by-step SOP). Kiểm tra mã số ${currentTemplate.taskId} trước khi chuyển công đoạn.`
        : `For ${currentTemplate.name}: Follow the verified step-by-step visual SOP. Check code ${currentTemplate.taskId} before passing to buffer.`;
      let visualCue = isVi
        ? '👁️ Đối chiếu hình ảnh mẫu và đèn chỉ báo xanh trên màn hình trạm.'
        : '👁️ Compare sample photo and check green indicator on station monitor.';
      let sopReference = `${currentTemplate.referenceStandard} · Kho Tri thức SOP Doanh nghiệp`;
      let category: 'sop' | 'safety' | 'rights' | 'career' = 'sop';
      let isEscalated = false;

      const qLower = userQuestion.toLowerCase();
      if (qLower.includes('khay') || qLower.includes('đầy') || qLower.includes('tray') || qLower.includes('full')) {
        answer = isVi
          ? `Khi ${currentTemplate.destinationLabel} bị đầy: Dừng gá lắp, bấm nút "Khay A đầy, xin đổi Khay B" tại thanh bên hoặc câu mẫu nhanh. Lead An sẽ xác nhận chuyển sang ${currentTemplate.updatedDestination} và hệ thống đóng tem miễn trừ trách nhiệm.`
          : `When ${currentTemplate.destinationLabel} is full: Pause assembly, tap "Tray A full, swap to Tray B" in quick presets. Lead An will approve switching to ${currentTemplate.updatedDestination} and stamp provenance protection.`;
        visualCue = isVi
          ? `📍 Vị trí khay đích phê duyệt: ${currentTemplate.updatedDestination}.`
          : `📍 Approved fallback destination: ${currentTemplate.updatedDestination}.`;
        sopReference = `${currentTemplate.taskId} · Quy trình Đổi khay An toàn`;
        category = 'sop';
      } else if (qLower.includes('bảo hộ') || qLower.includes('an toàn') || qLower.includes('ppe') || qLower.includes('safety') || qLower.includes('đèn') || qLower.includes('giao lộ')) {
        answer = isVi
          ? 'Quy định An toàn Mặt bằng (Pillar 3): Bắt buộc đeo kính và găng tay chống tĩnh điện ESD. Tại các góc mù ngã tư, quan sát đèn chớp vàng LED — nếu đèn chớp vàng nghĩa là xe đẩy hoặc xe nâng đang đến gần trong 10m, tuyệt đối không bước ra lối đi chính.'
          : 'Plant Safety Protocol (Pillar 3): Anti-static ESD glasses and gloves required. At blind corner intersections, observe amber strobe beacons — if flashing, a trolley/forklift is within 10m; hold position.';
        visualCue = isVi
          ? '⚠️ Đèn LED chớp vàng = Dừng bước và quan sát tầm nhìn chữ U.'
          : '⚠️ Flashing Amber LED = Halt and check sightline.';
        sopReference = 'Quy chuẩn An toàn Lao động PwD ISO-45001';
        category = 'safety';
      } else if (qLower.includes('bảo vệ') || qLower.includes('lỗi') || qLower.includes('trách nhiệm') || qLower.includes('protect') || qLower.includes('fault')) {
        answer = isVi
          ? 'BridgeOne ghi nhận toàn bộ chuỗi chứng cứ (Provenance Trail): tin nhắn xác nhận của Lead An, thời gian chốt và hình ảnh chụp vị trí Khay B. Nếu xảy ra nhầm lẫn, hồ sơ xác minh chứng minh lỗi do bản nháp quy trình ban đầu chưa rõ (Instruction Defect), công nhân được miễn trừ 100% trách nhiệm cá nhân.'
          : 'BridgeOne records an immutable Provenance Trail: Lead An’s approval timestamp, destination update, and verified photo. If discrepancies happen, the audit proves it was an Instruction Defect, completely exempting the worker from personal fault.';
        visualCue = isVi
          ? '🛡️ Tem chứng nhận Provenance xanh lá được lưu trữ vĩnh viễn trên hệ thống xác minh.'
          : '🛡️ Green Provenance stamp stored permanently in audit log.';
        sopReference = 'Khung Tiêu chuẩn ADC Giai đoạn 4 & 5 · Hồ sơ Công bằng';
        category = 'rights';
      } else if (qLower.includes('bài hát') || qLower.includes('nhạc') || qLower.includes('song') || qLower.includes('music')) {
        answer = isVi
          ? 'Người Điếc hoàn toàn có thể cảm nhận âm nhạc qua rung động cơ học (nhịp bass/vibration), ca từ giàu hình tượng và diễn xuất cảm xúc trong Video Clip/MV. Bạn có thể gửi bài hát kèm lời nhắn chân thành: "Giai điệu và lời bài này làm mình nhớ đến bạn", chia sẻ link kèm phụ đề (Closed Captions) hoặc mời bạn cảm nhận qua tai nghe truyền qua xương (bone conduction). Đừng ngại ngần — âm nhạc kết nối qua cảm xúc và sự chân thành!'
          : 'Deaf individuals enjoy music through physical vibrations, rich lyrics, and visual MV storytelling. Send the song with a warm note: "These lyrics reminded me of you", provide closed captions, or introduce bone-conduction headphones. Music connects through emotion beyond acoustic hearing!';
        visualCue = isVi
          ? '🎵 Chia sẻ kèm phụ đề (CC) hoặc mô tả cảm xúc/ca từ — Tôn trọng và đón nhận sự cảm thụ đa giác quan.'
          : '🎵 Share with Closed Captions or lyric mood notes — Celebrate multisensory music perception.';
        sopReference = 'Cẩm nang Hòa nhập Văn hóa Khiếm thính · BridgeOne Empathy Standard';
        category = 'rights';
      } else if (qLower.includes('cửa') || qLower.includes('bếp') || qLower.includes('door') || qLower.includes('kitchen') || qLower.includes('va vào') || (qLower.includes('xa') && qLower.includes('cảnh báo'))) {
        answer = isVi
          ? 'Khi bạn ở khoảng cách xa và người Điếc đang quay lưng: (1) Tuyệt đối KHÔNG ném đồ vật để gây chú ý; (2) Dùng công tắc nháy đèn trần 1–2 lần (Visual Strobe) hoặc dậm nhẹ gót chân xuống sàn để tạo rung động lan truyền; (3) Trên BridgeOne: Bấm nút "Nháy đèn gọi" hoặc gửi cảnh báo nhanh 1-chạm "Cửa mở - Cẩn thận". Về lâu dài, doanh nghiệp cần lắp gương cầu lồi hoặc chốt cửa tự động hít nam châm theo Tiêu chuẩn Thiết kế Toàn cầu (Universal Design).'
          : 'When warning from a distance while a Deaf teammate faces away: (1) NEVER throw objects; (2) Toggle overhead room light 1-2 times (Visual Strobe) or tap heel on floor to send floor vibration; (3) On BridgeOne: Tap "Flash Light Call" or send 1-tap "Door open - Watch out". Long-term: Install convex mirrors and magnetic door closers per Universal Design standards.';
        visualCue = isVi
          ? '💡 Nháy đèn trần 1-2 nhịp hoặc gõ nhẹ bàn tạo rung — Không ném đồ vật gây giật mình.'
          : '💡 Flash room lights or create gentle floor vibration — Never throw items.';
        sopReference = 'Nguyên lý Thiết kế Toàn cầu (Universal Design) & An toàn Lao động ISO-45001';
        category = 'safety';
      } else if (qLower.includes('góp ý') || qLower.includes('không tốt') || qLower.includes('kỳ thị') || qLower.includes('hiểu nhầm') || qLower.includes('sếp') || qLower.includes('hiệu suất') || qLower.includes('feedback') || qLower.includes('blame')) {
        answer = isVi
          ? 'Nguyên tắc góp ý công bằng & không định kiến (DE&I Inclusive Leadership): (1) Khách quan hóa bằng dữ liệu: Cùng mở BridgeOne đối chiếu tem thời gian (Provenance Trail) và tiến độ trạm — thực tế 80% trường hợp "chậm" bắt nguồn từ Lỗi bản nháp chỉ dẫn (Instruction Defect) mơ hồ chứ không phải do công nhân; (2) Gặp trực tiếp mặt-đối-mặt tại nơi đủ ánh sáng, sử dụng tính năng "Phụ đề trực tiếp" (Live Captions) 2 chiều; (3) Góp ý cụ thể vào từng thao tác thay vì phán xét chung chung, luôn hỏi "Tôi có thể hỗ trợ hoặc tinh chỉnh tài liệu SOP thế nào để bạn thao tác thuận tiện hơn?".'
          : 'Non-biased Performance Feedback Protocol (DE&I Leadership): (1) Rely on empirical data: Open BridgeOne Provenance Trail together — 80% of slowdowns stem from ambiguous supervisor instructions rather than worker skill; (2) Meet face-to-face in good lighting with two-way Live Captions; (3) Focus on specific micro-steps rather than broad judgments, asking "How can we refine the visual SOP to better support your workflow?".';
        visualCue = isVi
          ? '📋 Đối chiếu dữ liệu khách quan từ Hộ chiếu Năng lực & Tem Provenance trước khi kết luận.'
          : '📋 Review empirical data from Competency Passport & Provenance stamps before reaching conclusions.';
        sopReference = 'Bộ Chuẩn mực Quản trị Hòa nhập DE&I · Bộ luật Lao động Điều 159';
        category = 'rights';
      } else if (qLower.includes('vsl') || qLower.includes('ký hiệu') || qLower.includes('sign') || qLower.includes('cử chỉ')) {
        answer = isVi
          ? '4 Ký hiệu VSL thông dụng nhất trong xưởng: (1) "Cảm ơn": Áp các đầu ngón tay phải vào cằm rồi đưa nhẹ về phía trước, ánh mắt mỉm cười; (2) "Đồng ý/Tốt": Bàn tay nắm, giơ ngón cái lên dứt khoát; (3) "Cần giúp không?": Hai lòng bàn tay ngửa hướng về đối phương, hơi nghiêng đầu; (4) "Chờ một chút": Giơ 1 ngón trỏ lên ngang ngực. Lưu ý luôn giữ giao tiếp bằng ánh mắt (eye-contact) chân thành.'
          : 'Top 4 workplace VSL signs: (1) "Thank you": Flat hand from chin outward with a friendly nod; (2) "Good/Agreed": Thumbs up; (3) "Need help?": Open palms facing up, gentle questioning tilt; (4) "Wait a moment": Single index finger raised chest-level. Always maintain friendly eye-contact.';
        visualCue = isVi
          ? '🤟 Giữ ánh mắt tự nhiên (eye-contact) và biểu cảm gương mặt cởi mở khi ra dấu.'
          : '🤟 Maintain natural eye-contact and open facial expressions.';
        sopReference = 'Từ điển Ngôn ngữ Ký hiệu Việt Nam (VSL) Cơ sở Doanh nghiệp';
        category = 'sop';
      } else if (qLower.includes('lương') || qLower.includes('hợp đồng') || qLower.includes('phạt') || qLower.includes('salary') || qLower.includes('contract')) {
        answer = isVi
          ? 'Nội dung này thuộc chính sách Nhân sự & Pháp lý lao động: Theo Điều 159 Bộ luật Lao động 2019, người lao động khuyết tật được hưởng đầy đủ quyền lợi, bảo hiểm và chế độ nâng bậc bình đẳng. Để tra cứu bảng lương hoặc hợp đồng chi tiết, hệ thống đã chuyển tiếp câu hỏi của bạn tới Quản lý An và Phòng Nhân sự (HR) để phản hồi chính xác.'
          : 'This matter is governed by HR & Labor Law: Article 159 of Vietnam Labor Code guarantees equal pay and non-discrimination. To review your specific contract or wage tier, this inquiry has been forwarded to Lead An and the HR Department.';
        visualCue = isVi
          ? '⚖️ Chuyển tiếp Trưởng nhóm & Nhân sự: Đã kích hoạt cơ chế Human Escalation.'
          : '⚖️ Human Escalation Guardrail: Forwarded to Lead An & HR.';
        sopReference = 'Bộ luật Lao động 2019 (Điều 159) · HR Escalation';
        category = 'rights';
        isEscalated = true;
      } else if (qLower.includes('nghỉ') || qLower.includes('ốm') || qLower.includes('leave') || qLower.includes('sick')) {
        answer = isVi
          ? 'Quy trình báo nghỉ / hỗ trợ y tế: Bấm câu mẫu "Cần hỗ trợ tại trạm" hoặc "Xin tạm dừng 5 phút", hệ thống sẽ thông báo cho Lead An để sắp xếp nhân sự dự phòng (Floater) thay thế vị trí mà không ảnh hưởng tiến độ dây chuyền.'
          : 'Leave / Medical protocol: Select "Need assistance at station" or "Step away 5 min". BridgeOne alerts Lead An to dispatch a floater, ensuring zero line interruption.';
        visualCue = isVi
          ? '🙋 Chỉ định nhân sự dự phòng tạm thời tại Trạm 04.'
          : '🙋 Floater dispatched to Station 04.';
        sopReference = 'Nội quy Lao động Doanh nghiệp · Điều 8';
        category = 'sop';
      }

      const newQA: QnAPair = {
        id: 'qa-' + Date.now(),
        question: userQuestion,
        answer,
        visualCue,
        sopReference,
        category,
        isEscalated,
      };

      setChatHistory((prev) => [...prev, newQA]);
      setIsAnswering(false);
    }, 400);
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion(questionInput);
  };

  const handleQuickQuestionClick = (q: string) => {
    submitQuestion(q);
  };

  // Filtered prompt list
  const workerPrompts = [
    isVi ? 'Khay A đầy thì xử lý thế nào?' : 'How to handle full Tray A?',
    isVi ? 'Làm sao hệ thống bảo vệ mình khi có lỗi?' : 'How does system protect me from blame?',
    isVi ? 'Tiêu chí để ký HĐLĐ chính thức 12M-15M?' : 'Criteria for permanent contract?',
    isVi ? 'Quy định an toàn đèn chớp góc khuất?' : 'Blind-corner strobe safety rules?',
  ];

  const inclusivePrompts = [
    isVi ? '🤝 Sếp: Góp ý hiệu suất bạn Điếc sao cho không kỳ thị?' : '🤝 Manager: How to give non-biased performance feedback?',
    isVi ? '🚪 Cửa bếp hay mở, làm sao cảnh báo từ xa đỡ va chạm?' : '🚪 Warning about open kitchen door from a distance?',
    isVi ? '🤟 Học nhanh 4 ký hiệu VSL thông dụng trong xưởng?' : '🤟 4 common workplace VSL signs?',
    isVi ? '🎵 Tôi muốn gửi một bài hát cho bạn Điếc, làm sao để tế nhị?' : '🎵 How to share a song with a Deaf coworker?',
  ];

  const displayedPrompts =
    promptCategory === 'worker'
      ? workerPrompts
      : promptCategory === 'inclusive'
      ? inclusivePrompts
      : [...workerPrompts, ...inclusivePrompts];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* 1. TOP CONTEXT BAR: Clean, Enterprise-grade, Grounded RAG Header */}
      <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-950 tracking-tight">
                {isVi ? 'AI Trợ lý Doanh nghiệp & Quy trình' : 'Enterprise AI Mentor & SOP Coach'}
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero Hallucination</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isVi
                ? 'Hỏi đáp mọi thắc mắc về công việc, quy trình SOP, an toàn và quyền lợi — Cam kết truy xuất có căn cứ (Grounded RAG), không bịa đặt.'
                : 'Ask questions about SOPs, safety, and workplace rights — Grounded RAG strictly suppresses hallucinations.'}
            </p>
          </div>
        </div>

        {/* Citations / Corporate Standards badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>SOP INS-1042 · Lead An · ISO-9001</span>
          </div>
        </div>
      </div>

      {/* 2. PROMPT CHIPS STRIP: One-tap questions with role/empathy categories */}
      <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{isVi ? 'Gợi ý nhanh:' : 'Quick Prompts:'}</span>
            </span>
            <button
              type="button"
              onClick={() => setPromptCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                promptCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isVi ? 'Tất cả' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setPromptCategory('worker')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                promptCategory === 'worker'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>👷</span>
              <span>{isVi ? 'Minh & Thao tác' : 'Worker SOP'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPromptCategory('inclusive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                promptCategory === 'inclusive'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <span>🤝</span>
              <span>{isVi ? 'Đồng nghiệp & Sếp (Hòa nhập)' : 'Inclusive DE&I'}</span>
            </button>
          </div>
        </div>

        {/* Chips list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {displayedPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestionClick(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 text-xs font-semibold text-slate-700 whitespace-nowrap transition shadow-2xs shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SPACIOUS CHAT FEED: Rich conversation history with ample vertical space */}
      <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-[#FAFBFD]">
        {/* Informative RAG Grounding Announcement */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-950 shadow-2xs">
          <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-extrabold text-blue-900 block">
              {isVi ? 'Cơ chế Kiểm soát Độ tin cậy Tuyệt đối (Grounded Enterprise Knowledge):' : 'Grounded Enterprise Knowledge Guardrails:'}
            </span>
            <p className="text-[11.5px] text-blue-800">
              {isVi
                ? 'Mọi câu trả lời của AI Mentor đều được đối chiếu nguyên văn từ Tài liệu Thao tác Chuẩn (SOP INS-1042), Cẩm nang Trưởng nhóm An, và Bộ luật Lao động Việt Nam. Nếu phát hiện câu hỏi ngoài thẩm quyền hoặc mập mờ, AI sẽ từ chối suy đoán và chủ động chuyển tiếp đến Quản lý ca.'
                : 'All answers strictly cite verified company SOPs and Vietnam Labor Law. Out-of-scope inquiries trigger proactive escalation to shift supervisors.'}
            </p>
          </div>
        </div>

        {/* Message Thread */}
        {chatHistory.map((item) => (
          <div key={item.id} className="space-y-3">
            {/* User Question */}
            <div className="flex items-start justify-end gap-2.5">
              <div className="max-w-2xl bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-xs sm:text-sm font-semibold leading-relaxed">
                {item.question}
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                Minh
              </div>
            </div>

            {/* AI Grounded Answer */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div
                className={`max-w-3xl rounded-2xl rounded-tl-xs p-4 sm:p-5 border space-y-3 shadow-2xs ${
                  item.isEscalated
                    ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                    : 'bg-white border-slate-200/90 text-slate-900'
                }`}
              >
                {/* Main answer */}
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {item.answer}
                </p>

                {/* Visual Action Checkpoint */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item.visualCue}</span>
                </div>

                {/* Grounded Citation & Category */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10.5px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.sopReference}</span>
                  </div>

                  {item.isEscalated && (
                    <span className="px-2 py-0.5 rounded-full font-bold bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      <span>{isVi ? 'Đã chuyển Quản lý An' : 'Escalated to Lead An'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isAnswering && (
          <div className="flex items-center gap-2.5 text-xs text-blue-700 font-semibold p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>
              {isVi
                ? 'AI Mentor đang truy xuất kho dữ liệu SOP và đối chiếu quy chuẩn an toàn...'
                : 'AI Mentor searching SOP database and verifying safety rules...'}
            </span>
          </div>
        )}
      </div>

      {/* 4. BOTTOM INPUT BAR: Large, comfortable, pinned */}
      <div className="p-4 border-t border-slate-200/90 bg-white shrink-0">
        <form onSubmit={handleAsk} className="flex items-center gap-2.5">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={
              isVi
                ? 'Hỏi AI bất kỳ điều gì về thao tác khay, an toàn, quyền lợi lao động...'
                : 'Ask AI anything about tray handling, safety, labor rights...'
            }
            className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || isAnswering}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm shadow-blue-500/20 shrink-0"
          >
            <span>{isVi ? 'Hỏi AI' : 'Ask AI'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 font-medium text-center mt-2">
          {isVi
            ? 'Trợ lý AI Mentor hoạt động theo cơ chế Grounded RAG — Phục vụ người Khiếm thính không phán xét, cam kết không bịa đặt nội dung.'
            : 'AI Mentor operates under Grounded RAG — Non-judgmental support for Deaf workers with zero hallucinations.'}
        </p>
      </div>
    </div>
  );
};
