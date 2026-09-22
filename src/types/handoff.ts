export type ScreenId =
  | 'home'
  | 'tasks'
  | 'worker_detail'
  | 'ask_suggest'
  | 'facilitator'
  | 'review_publish'
  | 'published'
  | 'messages'
  | 'learning'
  | 'team'
  | 'resources'
  | 'settings'
  | 'accountability';

export type LifecycleStage =
  | 'draft_shared'          // Facilitator shared draft d1, worker reviewing
  | 'worker_preparing'      // Worker opened "Ask or suggest", facilitator sees pending signal
  | 'worker_sent'           // Worker submitted question: "Tray A is full. Can I use Tray B?"
  | 'facilitator_replied'   // Facilitator sent reply + atomically updated Tray A -> Tray B
  | 'question_closed'       // Worker closed question thread (ready for lead review)
  | 'published_v1';         // Facilitator confirmed checklist & published official v1

export type FieldIssueState = 'confirmed' | 'needs_clarification' | 'missing' | 'facilitator_supplied';
export type FieldOrigin = 'source' | 'facilitator' | 'ai_structured';

export interface ProvenanceField {
  value: string;
  origin: FieldOrigin;
  issueState: FieldIssueState;
  sourceRef: string;
  issueDescription?: string;
}

export interface TaskStep {
  id: number;
  stepNumber: number;
  title: string;
  instruction: string;
  isUpdated?: boolean;
  previousValue?: string;
  currentValue?: string;
  updateNote?: string;
  visualType: 'inspect' | 'place_tray' | 'label' | 'rack';
  origin?: FieldOrigin;
  sourceSentence?: string;
  groundedExplanation?: string;
}

export interface Contribution {
  id: string;
  authorName: string;
  authorRole: string;
  contextTopic: string;
  text: string;
  timestamp: string;
}

export interface FacilitatorResponse {
  id: string;
  authorName: string;
  authorRole: string;
  responseText: string;
  timestamp: string;
  fieldUpdated: string;
  beforeValue: string;
  afterValue: string;
}

export interface VersionHistoryItem {
  version: string;
  timestamp: string;
  publishedBy: string;
  changeSummary: string;
  reason: string;
  destination: string;
  isCurrent?: boolean;
}

export interface HandoffState {
  // Navigation & Lifecycle
  currentScreen: ScreenId;
  lifecycleStage: LifecycleStage;
  activePersona: 'worker' | 'facilitator';

  // Task Details
  taskId: string;
  taskTitle: string;
  workArea: string;
  difficulty: string;
  estimatedDuration: string;
  referenceStandard: string;
  outputDescription: string;
  quantity: string;

  // Provenance Fields
  provenance: {
    task: ProvenanceField;
    quantity: ProvenanceField;
    expectedOutput: ProvenanceField;
    destination: ProvenanceField;
    deadline: ProvenanceField;
  };

  // Key Fields (origin & change status)
  destination: string;
  initialDestination: string;
  isDestinationUpdated: boolean;

  deadline: string;
  isDeadlineSupplied: boolean;

  // Steps
  steps: TaskStep[];

  // Conversation & Contribution
  workerDraftText: string;
  workerDraftTopic: string;
  activeContribution: Contribution | null;
  activeResponse: FacilitatorResponse | null;

  // Facilitator form state (while drafting reply)
  facilitatorDraftReply: string;
  facilitatorDraftDestination: string;
  facilitatorDraftDeadline: string;

  // AI Assistant Briefing Capture & Generation State
  briefingSourceText: string;
  aiDraftGenerated: boolean;
  aiDraftAdopted: boolean;
  speechTranscript: string;
  isSpeechRecording: boolean;
  isRecordingSpeech?: boolean;
  ttsPlaying?: boolean;
  workerQuestion?: string;

  // Review & Confirmation
  facilitatorCheckedDetails: boolean;
  facilitatorCheckedAccessibleOpportunity: boolean;

  // Publication & Version History
  publishedVersion: string;
  publishedAt: string | null;
  publishedBy: string | null;
  versionHistory: VersionHistoryItem[];

  // Industry Template (Universal Design for all workplaces)
  activeIndustry: 'electronics' | 'fnb' | 'logistics' | 'retail' | 'office';

  // Customizable Quick Communication Options for Deaf / Hard of Hearing Workers
  customQuickOptions: Array<{
    id: string;
    icon: string;
    label: string;
    messageText: string;
    speechText: string;
    isDefault?: boolean;
  }>;

  // Live Persistent Conversation Transcript (STT/TTS stream)
  liveTranscriptLog: Array<{
    id: string;
    sender: 'Minh' | 'An' | 'System';
    role: 'worker' | 'lead' | 'ai';
    text: string;
    timestamp: string;
    isAudioPlayed?: boolean;
  }>;
  isLiveMicActive: boolean;

  // Demo assistant drawer
  isDemoDrawerOpen: boolean;
}

