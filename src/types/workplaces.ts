import { TaskStep, ProvenanceField } from './handoff';

export type WorkplaceIndustry = 
  | 'electronics'   // Nhà máy điện tử / cơ khí (Golden flow gốc)
  | 'fnb'           // F&B / Chuỗi cà phê & trà
  | 'logistics'     // Kho vận E-commerce & Logistics
  | 'retail'        // Bán lẻ / Chuỗi siêu thị tiện lợi
  | 'office';       // Khối văn phòng / Xử lý hồ sơ tài liệu

export interface WorkplaceTemplate {
  id: WorkplaceIndustry;
  name: string;
  nameVi: string;
  iconName: string;
  tagline: string;
  workArea: string;
  taskId: string;
  taskTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Technical';
  estimatedDuration: string;
  referenceStandard: string;
  outputDescription: string;
  quantity: string;
  provenance: {
    task: ProvenanceField;
    quantity: ProvenanceField;
    expectedOutput: ProvenanceField;
    destination: ProvenanceField;
    deadline: ProvenanceField;
  };
  initialDestination: string;
  updatedDestination: string;
  destinationLabel: string;
  steps: TaskStep[];
  typicalQuestions: string[];
  typicalQuestionsEn?: string[];
}

export const WORKPLACE_TEMPLATES: Record<WorkplaceIndustry, WorkplaceTemplate> = {
  electronics: {
    id: 'electronics',
    name: 'Electronics Assembly',
    nameVi: '🏭 Nhà máy điện tử & Cơ khí',
    iconName: 'Cpu',
    tagline: 'Lắp ráp bo mạch, phân loại khay linh kiện & kiểm chuẩn QA.',
    workArea: 'Assembly Line A · Trạm 04',
    taskId: 'INS-1042',
    taskTitle: 'Đóng gói linh kiện hoàn thiện vào khay trung chuyển',
    difficulty: 'Medium',
    estimatedDuration: '~ 5 phút',
    referenceStandard: 'Quy chuẩn SOP Nhà máy Điện tử ISO-9001',
    outputDescription: '2 cụm bo mạch đã test QA, dán tem Pass sẵn sàng chuyển công đoạn.',
    quantity: '2 bo mạch',
    provenance: {
      task: {
        value: 'Đóng gói cụm linh kiện hoàn thiện theo chuẩn an toàn tĩnh điện ESD.',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Tài liệu SOP Line A · Mục 2',
      },
      quantity: {
        value: '2 bộ / lượt kiểm tra',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Chỉ tiêu ca sáng',
      },
      expectedOutput: {
        value: 'Hai bộ linh kiện hoàn chỉnh, có tem kiểm định xanh, đặt thẳng góc.',
        origin: 'ai_structured',
        issueState: 'confirmed',
        sourceRef: 'Tổng hợp từ hướng dẫn trực quan QA',
      },
      destination: {
        value: 'Khay A',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Chỉ dẫn ban đầu của Quản lý An',
      },
      deadline: {
        value: 'Trước 11:30 sáng nay (Giao ca trưa)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Lịch xuất kho thành phẩm',
      },
    },
    initialDestination: 'Khay A',
    updatedDestination: 'Khay B',
    destinationLabel: 'Khay chứa linh kiện',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: 'Kiểm tra độ chắc chắn cụm bo mạch',
        instruction: 'Đảm bảo giắc cắm camera và cáp dẹt không bị xô lệch, khóa lẫy an toàn.',
        visualType: 'inspect',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Đặt vào khay chỉ định',
        instruction: 'Nhẹ nhàng đặt cụm bo mạch vào Khay A theo chiều mũi tên hướng lên.',
        visualType: 'place_tray',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Dán nhãn chứng nhận QA',
        instruction: 'Dán 1 tem xanh lá "QA PASSED" vào góc trên bên phải khung bảo vệ.',
        visualType: 'label',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Di chuyển sang khu vực kế tiếp',
        instruction: 'Chuyển khay hoàn tất sang giá đệm chờ robot AGV lấy hàng.',
        visualType: 'rack',
      },
    ],
    typicalQuestions: [
      'Khay A đã đầy. Có chuyển sang Khay B không?',
      'Thiếu tem dán QA màu xanh lá, lấy thêm ở đâu?',
      'Cáp dẹt hơi bị cấn góc, có tiếp tục đóng gói không?',
    ],
    typicalQuestionsEn: [
      'Tray A is full. Should I switch to Tray B?',
      'Missing green QA pass labels, where do I get more?',
      'Ribbon cable is slightly bent at corner, proceed packing?',
    ],
  },

  fnb: {
    id: 'fnb',
    name: 'F&B & Barista',
    nameVi: '☕ Chuỗi F&B / Pha chế cà phê',
    iconName: 'Coffee',
    tagline: 'Cân định lượng, chiết xuất cà phê & phục vụ chuẩn định lượng.',
    workArea: 'Quầy Barista · Trạm Chiết Xuất 02',
    taskId: 'FNB-204',
    taskTitle: 'Chiết xuất Cold Brew & đóng chai màng seal 250ml',
    difficulty: 'Easy',
    estimatedDuration: '~ 4 phút',
    referenceStandard: 'Quy chuẩn an toàn thực phẩm HACCP & Barista SOP',
    outputDescription: '4 chai Cold Brew đóng nắp seal bạc, gắn thẻ hạn sử dụng trong ngày.',
    quantity: '4 chai 250ml',
    provenance: {
      task: {
        value: 'Chiết xuất cà phê ủ lạnh, rót vào chai thủy tinh tiệt trùng và dán tem hạn dùng.',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Menu tiêu chuẩn quầy Bar',
      },
      quantity: {
        value: '4 chai / đợt chuẩn bị trước giờ cao điểm',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Đơn đặt trước ca sáng',
      },
      expectedOutput: {
        value: 'Chai thủy tinh đầy 250ml (cách miệng 1cm), seal phẳng không rò rỉ.',
        origin: 'ai_structured',
        issueState: 'confirmed',
        sourceRef: 'Tiêu chuẩn định lượng quán',
      },
      destination: {
        value: 'Tủ mát Showcase 01',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Quy định bảo quản F&B',
      },
      deadline: {
        value: 'Trước 08:30 sáng (Mở cửa đón khách)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Giờ mở quầy',
      },
    },
    initialDestination: 'Tủ mát Showcase 01',
    updatedDestination: 'Tủ mát Dự phòng 02',
    destinationLabel: 'Vị trí tủ trữ lạnh',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: 'Cân định lượng và rót vào chai',
        instruction: 'Đặt chai lên cân điện tử, rót đúng 240g nước cốt cà phê ủ lạnh.',
        visualType: 'inspect',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Dán màng seal và vặn nắp',
        instruction: 'Đặt màng seal nhiệt bạc lên miệng chai, vặn chặt nắp nhôm đen.',
        visualType: 'place_tray',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Dán nhãn date & barcode',
        instruction: 'In tem date hôm nay từ máy in nhiệt, dán chính giữa thân chai.',
        visualType: 'label',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Xếp vào tủ mát Showcase 01',
        instruction: 'Xếp các chai ngay ngắn vào hàng thứ 2 trong Tủ mát Showcase 01.',
        visualType: 'rack',
      },
    ],
    typicalQuestions: [
      'Tủ mát 01 đã đầy chỗ. Có chuyển sang Tủ mát Dự phòng 02 không?',
      'Máy in tem date bị kẹt giấy, lấy cuộn giấy mới ở đâu?',
      'Hết nắp nhôm đen, có được dùng nắp nhôm bạc thay thế không?',
    ],
  },

  logistics: {
    id: 'logistics',
    name: 'E-commerce & Logistics',
    nameVi: '📦 Kho vận Logistics / E-Commerce',
    iconName: 'Package',
    tagline: 'Pick & Pack, quét mã barcode, dán nhãn vận đơn & phân luồng.',
    workArea: 'Bàn Đóng gói Hub A · Băng chuyền 03',
    taskId: 'LOG-508',
    taskTitle: 'Đóng gói đơn hàng đồ gia dụng dễ vỡ vào thùng Carton size 3',
    difficulty: 'Medium',
    estimatedDuration: '~ 3 phút',
    referenceStandard: 'Quy trình đóng gói hàng vỡ Shopee / TikTok Shop Express',
    outputDescription: 'Kiện hàng quấn 3 lớp mút xốp chống sốc, dán mã vận đơn AWB phẳng.',
    quantity: '1 kiện hàng',
    provenance: {
      task: {
        value: 'Kiểm đếm sản phẩm, bọc mút xốp 3 lớp và đóng gói theo chuẩn chống sốc.',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Phiếu xuất kho WMS-2026',
      },
      quantity: {
        value: '1 đơn hàng hoàn chỉnh / lượt quét',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Mã đơn #VN94821',
      },
      expectedOutput: {
        value: 'Hộp carton dán băng keo chữ H, mã vận đơn scan rõ nét không nhăn.',
        origin: 'ai_structured',
        issueState: 'confirmed',
        sourceRef: 'Tiêu chuẩn giao hàng nhanh 2H',
      },
      destination: {
        value: 'Băng tải Luồng Miền Bắc (Lane 01)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Điều phối viên kho vận',
      },
      deadline: {
        value: '10:00 sáng (Xe tải chuyến 1 xuất bến)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Lịch xe tải trung chuyển',
      },
    },
    initialDestination: 'Băng tải Luồng Miền Bắc (Lane 01)',
    updatedDestination: 'Băng tải Hàng Dễ Vỡ (Lane 03)',
    destinationLabel: 'Luồng băng tải đích',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: 'Quét mã barcode kiểm tra mặt hàng',
        instruction: 'Dùng máy quét không dây đọc mã vạch trên sản phẩm và màn hình hiển thị tích xanh.',
        visualType: 'inspect',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Bọc mút xốp bóng khí 3 lớp',
        instruction: 'Quấn kín 3 vòng bubble wrap quanh ấm siêu tốc thủy tinh, dán băng keo cố định.',
        visualType: 'place_tray',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Dán nhãn vận đơn & Tem Hàng Dễ Vỡ',
        instruction: 'Dán nhãn AWB lên nắp hộp và tem đỏ "HÀNG DỄ VỠ - XIN NHẸ TAY" ở cạnh bên.',
        visualType: 'label',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Đẩy sang băng tải Lane 01',
        instruction: 'Đặt thùng hàng lên băng tải lăn Lane 01 để phân loại tự động.',
        visualType: 'rack',
      },
    ],
    typicalQuestions: [
      'Lane 01 đang bị tắc hàng. Có chuyển sang Lane 03 (Hàng dễ vỡ) không?',
      'Thùng size 3 hết hàng, có chuyển sang thùng size 4 chèn thêm mút xốp không?',
      'Mã vận đơn in ra bị sọc mờ máy quét không đọc được, cần in lại không?',
    ],
  },

  retail: {
    id: 'retail',
    name: 'Retail & Supermarket',
    nameVi: '🛒 Bán lẻ / Chuỗi siêu thị',
    iconName: 'ShoppingBag',
    tagline: 'Kiểm soát hạn sử dụng (FIFO), xếp kệ trưng bày & gắn tem ưu đãi.',
    workArea: 'Dãy Kệ B2 · Quầy Sữa & Thực Phẩm Sạch',
    taskId: 'RET-302',
    taskTitle: 'Xếp hàng lên kệ theo nguyên tắc FIFO & dán tem khuyến mãi -20%',
    difficulty: 'Easy',
    estimatedDuration: '~ 6 phút',
    referenceStandard: 'Quy chuẩn trưng bày bán lẻ Visual Merchandising',
    outputDescription: 'Toàn bộ 16 lốc sữa date gần xếp phía trước, date xa phía sau, tem giá quay ra ngoài.',
    quantity: '16 lốc sữa tươi',
    provenance: {
      task: {
        value: 'Luân chuyển hàng hóa FIFO (Vào trước ra trước) và kích hoạt bảng giá ưu đãi.',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Sổ tay nhân viên quầy tươi sống',
      },
      quantity: {
        value: '16 lốc sữa / kệ tầng 2',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Kiểm kê đầu ngày',
      },
      expectedOutput: {
        value: 'Mặt trước bao bì thẳng tắp, tem giá điện tử màu vàng hiển thị đúng giá sale.',
        origin: 'ai_structured',
        issueState: 'confirmed',
        sourceRef: 'Quy định cửa hàng trưởng',
      },
      destination: {
        value: 'Kệ B2 - Tầng 2 (Mặt tiền)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Sơ đồ trưng bày quầy',
      },
      deadline: {
        value: 'Trước 09:00 sáng (Giờ mở cửa siêu thị)',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Ca mở cửa',
      },
    },
    initialDestination: 'Kệ B2 - Tầng 2',
    updatedDestination: 'Đầu kệ End-Cap Khuyến Mãi A1',
    destinationLabel: 'Vị trí trưng bày quầy',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: 'Kiểm tra hạn sử dụng trên lốc',
        instruction: 'Đọc ngày in hạn dùng: Lô date tháng sau để phía sau, lô date tuần này để phía trước.',
        visualType: 'inspect',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Xếp thẳng hàng lốc sữa',
        instruction: 'Căn chỉnh logo thương hiệu quay thẳng ra ngoài, mép hộp thẳng với mép kệ 1cm.',
        visualType: 'place_tray',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Gắn tem dán giảm giá màu vàng',
        instruction: 'Dán tem tròn giảm giá -20% vào góc trái trên bao bì cho sản phẩm date gần.',
        visualType: 'label',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Đưa giỏ hàng rỗng về kho',
        instruction: 'Gấp gọn thùng carton vụn và chuyển giỏ nhựa rỗng về kho sau.',
        visualType: 'rack',
      },
    ],
    typicalQuestions: [
      'Kệ B2 hết chỗ bày. Có chuyển tạm ra đầu kệ End-Cap Khuyến Mãi A1 không?',
      'Bảng giá điện tử ESL bị hết pin không hiện số, thay pin ở đâu?',
      'Phát hiện 1 hộp bị móp nhẹ góc, có được bày ra kệ hay chuyển trả kho?',
    ],
  },

  office: {
    id: 'office',
    name: 'Office & Digital Admin',
    nameVi: '💼 Khối văn phòng / Xử lý hồ sơ số',
    iconName: 'Briefcase',
    tagline: 'Số hóa hồ sơ, phân loại hợp đồng, đối soát chứng từ & lưu trữ đám mây.',
    workArea: 'Phòng Hành chính - Nhân sự · Trạm Scan 01',
    taskId: 'OFF-101',
    taskTitle: 'Scan số hóa hợp đồng lao động & phân loại bảo mật',
    difficulty: 'Medium',
    estimatedDuration: '~ 5 phút',
    referenceStandard: 'Tiêu chuẩn bảo mật dữ liệu doanh nghiệp ISO-27001',
    outputDescription: '5 bộ hợp đồng scan chuẩn OCR 300 DPI, lưu đúng thư mục phân quyền.',
    quantity: '5 bộ hồ sơ',
    provenance: {
      task: {
        value: 'Scan tài liệu hai mặt, đặt tên file theo mã nhân viên và lưu trữ đám mây.',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Quy trình văn phòng số hóa 4.0',
      },
      quantity: {
        value: '5 hồ sơ / lượt số hóa',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Đợt onboard nhân sự mới',
      },
      expectedOutput: {
        value: 'File PDF thẳng góc, không dính bóng mờ, dung lượng < 5MB/file.',
        origin: 'ai_structured',
        issueState: 'confirmed',
        sourceRef: 'Quy chuẩn lưu trữ IT',
      },
      destination: {
        value: 'Thư mục HR_Confidential/2026',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Quy định bảo mật hồ sơ',
      },
      deadline: {
        value: 'Trước 16:30 chiều nay',
        origin: 'source',
        issueState: 'confirmed',
        sourceRef: 'Hạn nộp báo cáo nhân sự',
      },
    },
    initialDestination: 'Thư mục HR_Confidential/2026',
    updatedDestination: 'Thư mục Cloud_Archive/Hợp_Đồng_Chính_Thức',
    destinationLabel: 'Thư mục lưu trữ đích',
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: 'Tháo kim bấm và kiểm tra số trang',
        instruction: 'Dùng kìm nhổ ghim chuyên dụng tháo sạch kim sắt, vuốt phẳng mép giấy để tránh kẹt máy.',
        visualType: 'inspect',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Đặt xấp tài liệu vào khay nạp ADF',
        instruction: 'Đặt giấy úp mặt theo chiều mũi tên, chỉnh hai thanh gá vừa khít khổ A4.',
        visualType: 'place_tray',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Bấm nút scan profile OCR 300DPI',
        instruction: 'Chọn chế độ "Duplex Color PDF" trên màn hình cảm ứng máy scan để tự động nhận dạng chữ.',
        visualType: 'label',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Cất hồ sơ gốc vào cặp đựng hồ sơ',
        instruction: 'Cho hợp đồng gốc vào bìa còng màu xanh mã số #HR-A4, cất vào tủ chống cháy Tầng 2.',
        visualType: 'rack',
      },
    ],
    typicalQuestions: [
      'Thư mục HR_Confidential báo đầy dung lượng. Có lưu tạm sang Cloud_Archive không?',
      'Hồ sơ có chữ ký mực xanh bị mờ sau khi scan, cần chỉnh tăng độ tương phản lên không?',
      'Phát hiện 1 bản thiếu chữ ký nháy trang phụ lục, có tiếp tục scan không?',
    ],
  },
};
