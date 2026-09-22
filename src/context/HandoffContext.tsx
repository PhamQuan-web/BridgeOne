import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  HandoffState,
  LifecycleStage,
  ScreenId,
  TaskStep,
  Contribution,
  FacilitatorResponse,
  ProvenanceField,
  VersionHistoryItem,
} from '../types/handoff';
import { WORKPLACE_TEMPLATES, WorkplaceIndustry } from '../types/workplaces';

const INITIAL_STEPS: TaskStep[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Check unit is complete',
    instruction: 'Make sure all components are securely attached and no parts are loose.',
    visualType: 'inspect',
    origin: 'source',
    sourceSentence: 'Check each unit for physical integrity and connector seating.',
    groundedExplanation: 'Standard check ensures zero defects before placing in buffer.',
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Place in tray',
    instruction: 'Gently place the finished unit in Tray A.',
    previousValue: 'Tray A',
    currentValue: 'Tray A',
    visualType: 'place_tray',
    origin: 'source',
    sourceSentence: 'Place them in Tray A.',
    groundedExplanation: 'Initial standard specified Tray A buffer zone slot 2.',
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'Add label',
    instruction: 'Attach a green "Completed" label to the top of the unit.',
    visualType: 'label',
    origin: 'source',
    sourceSentence: 'Attach the completed label.',
    groundedExplanation: 'Green label signifies station inspection sign-off.',
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'Move to next stage',
    instruction: 'Take Tray A to the staging rack.',
    previousValue: 'Tray A',
    currentValue: 'Tray A',
    visualType: 'rack',
    origin: 'source',
    sourceSentence: 'Move them before the afternoon shift.',
    groundedExplanation: 'Move tray to Line A staging rack buffer.',
  },
];

const INITIAL_PROVENANCE: {
  task: ProvenanceField;
  quantity: ProvenanceField;
  expectedOutput: ProvenanceField;
  destination: ProvenanceField;
  deadline: ProvenanceField;
} = {
  task: {
    value: 'Pack finished units',
    origin: 'source',
    issueState: 'confirmed',
    sourceRef: 'Original briefing · sentence 1',
  },
  quantity: {
    value: '2 units',
    origin: 'source',
    issueState: 'confirmed',
    sourceRef: 'Original briefing · sentence 1',
  },
  expectedOutput: {
    value: 'Two checked, labeled units ready for the next stage.',
    origin: 'ai_structured',
    issueState: 'confirmed',
    sourceRef: 'Synthesized from sentences 1-3',
  },
  destination: {
    value: 'Tray A',
    origin: 'source',
    issueState: 'confirmed',
    sourceRef: 'Original briefing · sentence 2',
  },
  deadline: {
    value: 'before the afternoon shift',
    origin: 'source',
    issueState: 'needs_clarification',
    sourceRef: 'Original briefing · sentence 4',
    issueDescription: 'Specific date/time required before sharing.',
  },
};

const INITIAL_VERSION_HISTORY: VersionHistoryItem[] = [
  {
    version: 'v2.0',
    timestamp: 'Today · 10:24 AM',
    publishedBy: 'An · Team lead',
    changeSummary: 'Updated tray location from Tray A to Tray B based on worker feedback',
    reason: 'Worker clarification: Tray A was full',
    destination: 'Tray B',
    isCurrent: true,
  },
  {
    version: 'v1.0',
    timestamp: '12 Oct 2026 · 08:00 AM',
    publishedBy: 'An · Team lead',
    changeSummary: 'Initial standard work publication',
    reason: 'New assembly line onboarding release',
    destination: 'Tray A',
    isCurrent: false,
  },
];

const INITIAL_STATE: HandoffState = {
  currentScreen: 'home',
  lifecycleStage: 'draft_shared',
  activePersona: 'worker',

  taskId: 'INS-1042',
  taskTitle: 'Pack finished assemblies',
  workArea: 'Assembly Line A',
  difficulty: 'Medium',
  estimatedDuration: '~ 5 minutes',
  referenceStandard: 'Assembly Line A Standard Work',
  outputDescription: 'Two checked, labeled units ready for the next stage.',
  quantity: '2 units',

  provenance: INITIAL_PROVENANCE,

  destination: 'Tray A',
  initialDestination: 'Tray A',
  isDestinationUpdated: false,

  deadline: 'before the afternoon shift (Needs clarification)',
  isDeadlineSupplied: false,

  steps: INITIAL_STEPS,

  workerDraftText: 'Can we use Tray B instead of Tray A for high-volume units?',
  workerDraftTopic: 'Destination',
  activeContribution: null,
  activeResponse: null,

  facilitatorDraftReply: "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction.",
  facilitatorDraftDestination: 'Tray B',
  facilitatorDraftDeadline: '22 Sep 2026 · 13:30 · UTC+07',

  briefingSourceText: 'Pack two completed units for the next stage. Check each unit, place them in Tray A, attach the completed label, and move them before the afternoon shift.',
  aiDraftGenerated: true,
  aiDraftAdopted: true,
  speechTranscript: '',
  isSpeechRecording: false,
  isRecordingSpeech: false,
  ttsPlaying: false,
  workerQuestion: 'Can we use Tray B instead of Tray A for high-volume units?',

  facilitatorCheckedDetails: false,
  facilitatorCheckedAccessibleOpportunity: false,

  publishedVersion: 'v1',
  publishedAt: null,
  publishedBy: null,
  versionHistory: INITIAL_VERSION_HISTORY,

  activeIndustry: 'electronics',
  customQuickOptions: [
    {
      id: 'qo-1',
      icon: '👍',
      label: 'Đã hoàn tất',
      messageText: 'Minh xác nhận: Đã hoàn tất bước này an toàn!',
      speechText: 'Minh đã hoàn tất bước này an toàn!',
      isDefault: true,
    },
    {
      id: 'qo-2',
      icon: '🙋',
      label: 'Cần hỗ trợ',
      messageText: 'Cần quản lý qua hỗ trợ tại vị trí của tôi!',
      speechText: 'Cần quản lý hỗ trợ tại vị trí!',
      isDefault: true,
    },
    {
      id: 'qo-3',
      icon: '📦',
      label: 'Đầy vật tư',
      messageText: 'Khay linh kiện đã đầy, xin chỉ đạo vị trí tiếp theo!',
      speechText: 'Khay linh kiện đã đầy, xin chỉ đạo vị trí tiếp theo!',
      isDefault: true,
    },
    {
      id: 'qo-4',
      icon: '🔄',
      label: 'Xin nhắc lại',
      messageText: 'Xin nhắc lại thao tác này rõ hơn bằng hình ảnh hoặc văn bản!',
      speechText: 'Xin nhắc lại thao tác này rõ hơn!',
      isDefault: true,
    },
    {
      id: 'qo-5',
      icon: '⚙️',
      label: 'Lỗi linh kiện',
      messageText: 'Phôi linh kiện có dấu hiệu bị trầy xước hoặc lỗi cơ khí, xin phép tạm giữ!',
      speechText: 'Phôi linh kiện có dấu hiệu bị trầy xước hoặc lỗi cơ khí, xin phép tạm giữ!',
      isDefault: true,
    },
    {
      id: 'qo-6',
      icon: '🚻',
      label: 'Rời trạm 5p',
      messageText: 'Minh xin phép rời trạm thao tác trong 5 phút!',
      speechText: 'Minh xin phép rời trạm thao tác trong năm phút!',
      isDefault: true,
    },
  ],
  liveTranscriptLog: [
    {
      id: 'tx-1',
      sender: 'An',
      role: 'lead',
      text: 'Chào cả đội ca sáng! Hôm nay chú ý vị trí đặt cụm bo mạch và đối chiếu kỹ mã khay nhé.',
      timestamp: '08:02 AM',
      isAudioPlayed: true,
    },
    {
      id: 'tx-2',
      sender: 'Minh',
      role: 'worker',
      text: 'Minh đã nhận ca tại Trạm 04. Đang kiểm tra cụm camera INS-1042.',
      timestamp: '08:05 AM',
      isAudioPlayed: true,
    },
    {
      id: 'tx-3',
      sender: 'An',
      role: 'lead',
      text: 'Great question, Minh! You\'re right — the units should go to Tray B (not Tray A). I\'ve updated the instruction.',
      timestamp: '10:14 AM',
      isAudioPlayed: true,
    },
  ],
  isLiveMicActive: false,

  isDemoDrawerOpen: false,
  isSafetyAlertActive: false,
  safetyAlertDetails: null,
};

interface HandoffContextType {
  state: HandoffState;
  setScreen: (screen: ScreenId) => void;
  switchPersona: (persona: 'worker' | 'facilitator') => void;
  switchWorkplaceTemplate: (industry: WorkplaceIndustry) => void;
  toggleLiveMic: () => void;
  sendLiveMessage: (text: string, senderName?: string) => void;
  summarizeLiveConversation: () => { summary: string; actionItems: string[]; safetyAlert: string };
  toggleDemoDrawer: () => void;
  setDemoDrawerOpen: (open: boolean) => void;
  startPreparingMessage: () => void;
  cancelPreparingMessage: () => void;
  updateWorkerDraft: (text: string, topic?: string) => void;
  sendWorkerContribution: (topic: string, text: string) => void;
  updateFacilitatorDrafts: (reply: string, destination: string, deadline: string) => void;
  shareFacilitatorUpdateAndReply: (replyText: string, newDestination: string, deadlineText: string) => void;
  generateAIDraft: (rawBriefing: string) => void;
  adoptAIDraft: () => void;
  resolveAmbiguityDeadline: (confirmedTime: string) => void;
  setSpeechRecording: (recording: boolean) => void;
  startSpeechRecording: () => void;
  stopSpeechRecording: () => void;
  setSpeechTranscript: (transcript: string) => void;
  playTextToSpeech: (text: string) => void;
  addCustomQuickOption: (option: { icon: string; label: string; messageText: string; speechText?: string }) => void;
  removeCustomQuickOption: (id: string) => void;
  triggerSafetyAlert: (direction?: 'RIGHT' | 'LEFT' | 'BEHIND', hazardType?: 'trolley' | 'forklift') => void;
  dismissSafetyAlert: () => void;
  closeWorkerQuestion: () => void;
  reopenDiscussion: () => void;
  toggleFacilitatorConfirmation: (field: 'details' | 'accessible') => void;
  publishInstruction: () => void;
  resetDemo: () => void;
  jumpToStage: (stage: LifecycleStage, screen?: ScreenId) => void;
  setGoldenFlowState: (stateNum: 1 | 2 | 3) => void;
  selectStep: (stepId: string | number) => void;
}

const HandoffContext = createContext<HandoffContextType | undefined>(undefined);

const STORAGE_KEY = 'cung_nhip_handoff_state_v2';

export const HandoffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HandoffState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_STATE,
            ...parsed,
            isDemoDrawerOpen: false, // keep drawer closed on load
          };
        }
      } catch (e) {
        console.warn('Could not read handoff state from localStorage:', e);
      }
    }
    return INITIAL_STATE;
  });

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Could not save handoff state to localStorage:', e);
      }
    }
  }, [state]);

  const setScreen = (screen: ScreenId) => {
    setState((prev) => {
      const isLeadScreen = screen === 'facilitator' || screen === 'review_publish';
      return {
        ...prev,
        currentScreen: screen,
        activePersona: isLeadScreen ? 'facilitator' : prev.activePersona,
      };
    });
  };

  const switchPersona = (persona: 'worker' | 'facilitator') => {
    setState((prev) => ({
      ...prev,
      activePersona: persona,
      currentScreen: persona === 'facilitator' ? 'facilitator' : 'worker_detail',
    }));
  };

  const toggleDemoDrawer = () => {
    setState((prev) => ({ ...prev, isDemoDrawerOpen: !prev.isDemoDrawerOpen }));
  };

  const setDemoDrawerOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, isDemoDrawerOpen: open }));
  };

  const startPreparingMessage = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'ask_suggest',
      lifecycleStage: prev.lifecycleStage === 'draft_shared' ? 'worker_preparing' : prev.lifecycleStage,
    }));
  };

  const cancelPreparingMessage = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'worker_detail',
      lifecycleStage: prev.lifecycleStage === 'worker_preparing' ? 'draft_shared' : prev.lifecycleStage,
    }));
  };

  const updateWorkerDraft = (text: string, topic?: string) => {
    setState((prev) => ({
      ...prev,
      workerDraftText: text,
      ...(topic ? { workerDraftTopic: topic } : {}),
    }));
  };

  const sendWorkerContribution = (topic: string, text: string) => {
    const contribution: Contribution = {
      id: `c-${Date.now()}`,
      authorName: 'Minh',
      authorRole: 'New team member',
      contextTopic: topic,
      text: text,
      timestamp: 'Today · 10:02 AM',
    };

    setState((prev) => ({
      ...prev,
      activeContribution: contribution,
      lifecycleStage: 'worker_sent',
      currentScreen: 'worker_detail',
    }));
  };

  const updateFacilitatorDrafts = (reply: string, destination: string, deadline: string) => {
    setState((prev) => ({
      ...prev,
      facilitatorDraftReply: reply,
      facilitatorDraftDestination: destination,
      facilitatorDraftDeadline: deadline,
    }));
  };

  const shareFacilitatorUpdateAndReply = (replyText: string, newDestination: string, deadlineText: string) => {
    const response: FacilitatorResponse = {
      id: `r-${Date.now()}`,
      authorName: 'An',
      authorRole: 'Team lead',
      responseText: replyText,
      timestamp: 'Today · 10:14 AM',
      fieldUpdated: 'Destination',
      beforeValue: 'Tray A',
      afterValue: newDestination,
    };

    setState((prev) => {
      const updatedSteps = prev.steps.map((step) => {
        if (step.stepNumber === 2) {
          return {
            ...step,
            title: 'Place in tray',
            instruction: `Gently place the finished unit in ${newDestination}.`,
            isUpdated: true,
            previousValue: prev.initialDestination,
            currentValue: newDestination,
            updateNote: 'Updated from Tray A based on Minh\'s question.',
            origin: 'facilitator' as const,
            sourceSentence: `Lead confirmed: Use ${newDestination} because Tray A buffer is full.`,
            groundedExplanation: `Approved by An · Team lead on Oct 16. Unit goes to ${newDestination}.`,
          };
        }
        if (step.stepNumber === 4) {
          return {
            ...step,
            title: 'Move to next stage',
            instruction: `Take ${newDestination} to the staging rack.`,
            isUpdated: true,
            previousValue: prev.initialDestination,
            currentValue: newDestination,
            origin: 'facilitator' as const,
          };
        }
        return step;
      });

      return {
        ...prev,
        activeResponse: response,
        destination: newDestination,
        isDestinationUpdated: true,
        deadline: deadlineText,
        isDeadlineSupplied: true,
        provenance: {
          ...prev.provenance,
          destination: {
            value: newDestination,
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Facilitator atomic response to Minh',
          },
          deadline: {
            value: deadlineText,
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Lead confirmation (An)',
          },
        },
        steps: updatedSteps,
        lifecycleStage: 'facilitator_replied',
      };
    });
  };

  const generateAIDraft = (rawBriefing: string) => {
    setState((prev) => ({
      ...prev,
      briefingSourceText: rawBriefing,
      aiDraftGenerated: true,
      aiDraftAdopted: false,
    }));
  };

  const adoptAIDraft = () => {
    setState((prev) => ({
      ...prev,
      aiDraftAdopted: true,
    }));
  };

  const resolveAmbiguityDeadline = (confirmedTime: string) => {
    setState((prev) => ({
      ...prev,
      deadline: confirmedTime,
      isDeadlineSupplied: true,
      provenance: {
        ...prev.provenance,
        deadline: {
          value: confirmedTime,
          origin: 'facilitator',
          issueState: 'facilitator_supplied',
          sourceRef: 'Facilitator clarified: shift schedule standard',
        },
      },
    }));
  };

  const setSpeechRecording = (recording: boolean) => {
    setState((prev) => ({
      ...prev,
      isSpeechRecording: recording,
      isRecordingSpeech: recording,
    }));
  };

  const startSpeechRecording = () => {
    setState((prev) => ({
      ...prev,
      isSpeechRecording: true,
      isRecordingSpeech: true,
    }));
  };

  const stopSpeechRecording = () => {
    setState((prev) => ({
      ...prev,
      isSpeechRecording: false,
      isRecordingSpeech: false,
    }));
  };

  const playTextToSpeech = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (state.ttsPlaying) {
        window.speechSynthesis.cancel();
        setState((prev) => ({ ...prev, ttsPlaying: false }));
        return;
      }
      window.speechSynthesis.cancel();
      // Resume in case speech synthesis was paused or restricted
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Pick matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onstart = () => {
        setState((prev) => ({ ...prev, ttsPlaying: true }));
      };
      utterance.onend = () => {
        setState((prev) => ({ ...prev, ttsPlaying: false }));
      };
      utterance.onerror = () => {
        setState((prev) => ({ ...prev, ttsPlaying: false }));
      };

      setState((prev) => ({ ...prev, ttsPlaying: true }));
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation
      setState((prev) => ({ ...prev, ttsPlaying: !prev.ttsPlaying }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, ttsPlaying: false }));
      }, 4000);
    }
  };

  const addCustomQuickOption = (option: {
    icon: string;
    label: string;
    messageText: string;
    speechText?: string;
  }) => {
    const newOpt = {
      id: 'qo-' + Date.now(),
      icon: option.icon || '💬',
      label: option.label.trim(),
      messageText: option.messageText.trim(),
      speechText: (option.speechText || option.messageText).trim(),
      isDefault: false,
    };
    setState((prev) => ({
      ...prev,
      customQuickOptions: [...(prev.customQuickOptions || []), newOpt],
    }));
  };

  const removeCustomQuickOption = (id: string) => {
    setState((prev) => ({
      ...prev,
      customQuickOptions: (prev.customQuickOptions || []).filter((opt) => opt.id !== id),
    }));
  };

  const triggerSafetyAlert = (
    direction: 'RIGHT' | 'LEFT' | 'BEHIND' = 'RIGHT',
    hazardType: 'trolley' | 'forklift' = 'trolley'
  ) => {
    setState((prev) => ({
      ...prev,
      isSafetyAlertActive: true,
      safetyAlertDetails: {
        hazardType,
        direction,
        timeToImpact: 3,
        location: 'Khúc cua ngã tư Chuyền A (Blind Corner Camera 02)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    }));

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 500]);
      }
    } catch {}
  };

  const dismissSafetyAlert = () => {
    setState((prev) => ({
      ...prev,
      isSafetyAlertActive: false,
      safetyAlertDetails: null,
    }));
  };

  const setSpeechTranscript = (transcript: string) => {
    setState((prev) => ({
      ...prev,
      speechTranscript: transcript,
      briefingSourceText: transcript || prev.briefingSourceText,
    }));
  };

  const closeWorkerQuestion = () => {
    setState((prev) => ({
      ...prev,
      lifecycleStage: 'question_closed',
    }));
  };

  const reopenDiscussion = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'ask_suggest',
    }));
  };

  const toggleFacilitatorConfirmation = (field: 'details' | 'accessible') => {
    setState((prev) => {
      if (field === 'details') {
        return { ...prev, facilitatorCheckedDetails: !prev.facilitatorCheckedDetails };
      }
      return {
        ...prev,
        facilitatorCheckedAccessibleOpportunity: !prev.facilitatorCheckedAccessibleOpportunity,
      };
    });
  };

  const publishInstruction = () => {
    setState((prev) => {
      const newVersionHistory: VersionHistoryItem[] = [
        {
          version: 'v2.0',
          timestamp: 'Today · 10:24 AM',
          publishedBy: 'An · Team lead',
          changeSummary: 'Updated tray location from Tray A to Tray B based on worker feedback',
          reason: 'Worker clarification: Tray A was full',
          destination: prev.destination,
          isCurrent: true,
        },
        ...prev.versionHistory.map((item) => ({ ...item, isCurrent: false })),
      ];

      return {
        ...prev,
        lifecycleStage: 'published_v1',
        publishedVersion: 'v2.0',
        publishedAt: 'Today · 10:24 AM',
        publishedBy: 'An · Team lead',
        versionHistory: newVersionHistory,
        currentScreen: 'published',
      };
    });
  };

  const resetDemo = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
    setState(INITIAL_STATE);
  };

  const setGoldenFlowState = (stateNum: 1 | 2 | 3) => {
    if (stateNum === 1) {
      setState({
        ...INITIAL_STATE,
        taskId: 'INS-1042',
        taskTitle: 'Pack finished assemblies',
        currentScreen: 'worker_detail',
        lifecycleStage: 'draft_shared',
        activePersona: 'worker',
        destination: 'Tray A',
        isDestinationUpdated: false,
        activeContribution: null,
        activeResponse: null,
        steps: INITIAL_STEPS,
      });
      return;
    }

    if (stateNum === 2) {
      setState({
        ...INITIAL_STATE,
        taskId: 'INS-1042',
        taskTitle: 'Pack finished assemblies',
        currentScreen: 'worker_detail',
        lifecycleStage: 'worker_sent',
        activePersona: 'worker',
        destination: 'Tray A',
        isDestinationUpdated: false,
        activeContribution: {
          id: 'c-1042',
          authorName: 'Minh',
          authorRole: 'Worker · Assembly Line A',
          contextTopic: 'Step 2: Place in tray',
          text: 'Can we use Tray B instead of Tray A for high-volume units?',
          timestamp: 'Today · 10:02 AM',
        },
        activeResponse: null,
        steps: INITIAL_STEPS,
      });
      return;
    }

    if (stateNum === 3) {
      const updatedSteps = INITIAL_STEPS.map((s) => {
        if (s.stepNumber === 2) {
          return {
            ...s,
            title: 'Place in tray',
            instruction: 'Gently place the finished unit in Tray B.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            updateNote: 'Destination updated based on worker question from Minh.',
            origin: 'facilitator' as const,
            sourceSentence: 'Lead confirmed: Use Tray B because Tray A is full.',
            groundedExplanation: 'Verified by An (Lead) · Provenance: Worker Question Handoff',
          };
        }
        if (s.stepNumber === 4) {
          return {
            ...s,
            title: 'Move to next stage',
            instruction: 'Take Tray B to the staging rack.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            origin: 'facilitator' as const,
          };
        }
        return s;
      });

      setState({
        ...INITIAL_STATE,
        taskId: 'INS-1042',
        taskTitle: 'Pack finished assemblies',
        currentScreen: 'worker_detail',
        lifecycleStage: 'facilitator_replied',
        activePersona: 'worker',
        destination: 'Tray B',
        isDestinationUpdated: true,
        steps: updatedSteps,
        activeContribution: {
          id: 'c-1042',
          authorName: 'Minh',
          authorRole: 'Worker · Assembly Line A',
          contextTopic: 'Step 2: Place in tray',
          text: 'Can we use Tray B instead of Tray A for high-volume units?',
          timestamp: 'Today · 10:02 AM',
        },
        activeResponse: {
          id: 'r-1042',
          authorName: 'An',
          authorRole: 'Team lead',
          responseText: "Great question, Minh! You're right — the units should go to Tray B. I've updated the instruction.",
          timestamp: 'Today · 10:14 AM',
          fieldUpdated: 'Destination',
          beforeValue: 'Tray A',
          afterValue: 'Tray B',
        },
      });
      return;
    }
  };

  const jumpToStage = (stage: LifecycleStage, screen?: ScreenId) => {
    if (stage === 'draft_shared') {
      resetDemo();
      if (screen) setScreen(screen);
      return;
    }

    if (stage === 'worker_preparing') {
      setState((prev) => ({
        ...INITIAL_STATE,
        lifecycleStage: 'worker_preparing',
        currentScreen: screen || 'ask_suggest',
      }));
      return;
    }

    if (stage === 'worker_sent') {
      setState((prev) => ({
        ...INITIAL_STATE,
        lifecycleStage: 'worker_sent',
        activeContribution: {
          id: 'c-demo',
          authorName: 'Minh',
          authorRole: 'New team member',
          contextTopic: 'Destination',
          text: 'Just checking — do we still put the finished units in Tray A? I saw a new tray setup and wasn\'t sure.',
          timestamp: 'Today · 10:02 AM',
        },
        currentScreen: screen || 'facilitator',
      }));
      return;
    }

    if (stage === 'facilitator_replied' || stage === 'question_closed') {
      const updatedSteps = INITIAL_STEPS.map((s) => {
        if (s.stepNumber === 2) {
          return {
            ...s,
            title: 'Place in tray',
            instruction: 'Gently place the finished unit in Tray B.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            updateNote: 'Destination updated based on worker question',
            origin: 'facilitator' as const,
            sourceSentence: 'Lead confirmed: Use Tray B because Tray A is full.',
            groundedExplanation: 'Approved by An · Team lead on Oct 16. Unit goes to Tray B.',
          };
        }
        if (s.stepNumber === 4) {
          return {
            ...s,
            title: 'Move to next stage',
            instruction: 'Take Tray B to the staging rack.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            origin: 'facilitator' as const,
          };
        }
        return s;
      });

      setState((prev) => ({
        ...INITIAL_STATE,
        destination: 'Tray B',
        isDestinationUpdated: true,
        deadline: '22 Sep 2026 · 13:30 · UTC+07',
        isDeadlineSupplied: true,
        steps: updatedSteps,
        provenance: {
          ...INITIAL_PROVENANCE,
          destination: {
            value: 'Tray B',
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Facilitator reply to Minh (Worker)',
          },
          deadline: {
            value: '22 Sep 2026 · 13:30 · UTC+07',
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Shift 1 cut-off standard',
          },
        },
        activeContribution: {
          id: 'c-demo',
          authorName: 'Minh',
          authorRole: 'New team member',
          contextTopic: 'Destination',
          text: 'Just checking — do we still put the finished units in Tray A? I saw a new tray setup and wasn\'t sure.',
          timestamp: 'Today · 10:02 AM',
        },
        activeResponse: {
          id: 'r-demo',
          authorName: 'An',
          authorRole: 'Team lead',
          responseText: 'Great question, Minh! You\'re right — the units should go to Tray B (not Tray A). I\'ve updated the instruction and added a clearer photo. Thanks for helping make this more accurate for everyone! 🙌',
          timestamp: 'Today · 10:14 AM',
          fieldUpdated: 'Destination',
          beforeValue: 'Tray A',
          afterValue: 'Tray B',
        },
        lifecycleStage: stage,
        currentScreen: screen || 'worker_detail',
      }));
      return;
    }

    if (stage === 'published_v1') {
      const updatedSteps = INITIAL_STEPS.map((s) => {
        if (s.stepNumber === 2) {
          return {
            ...s,
            title: 'Place in tray',
            instruction: 'Gently place the finished unit in Tray B.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            updateNote: 'Destination updated based on worker question',
            origin: 'facilitator' as const,
            sourceSentence: 'Lead confirmed: Use Tray B because Tray A is full.',
            groundedExplanation: 'Approved by An · Team lead on Oct 16. Unit goes to Tray B.',
          };
        }
        if (s.stepNumber === 4) {
          return {
            ...s,
            title: 'Move to next stage',
            instruction: 'Take Tray B to the staging rack.',
            isUpdated: true,
            previousValue: 'Tray A',
            currentValue: 'Tray B',
            origin: 'facilitator' as const,
          };
        }
        return s;
      });

      setState((prev) => ({
        ...INITIAL_STATE,
        destination: 'Tray B',
        isDestinationUpdated: true,
        deadline: '22 Sep 2026 · 13:30 · UTC+07',
        isDeadlineSupplied: true,
        steps: updatedSteps,
        provenance: {
          ...INITIAL_PROVENANCE,
          destination: {
            value: 'Tray B',
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Facilitator reply to Minh (Worker)',
          },
          deadline: {
            value: '22 Sep 2026 · 13:30 · UTC+07',
            origin: 'facilitator',
            issueState: 'facilitator_supplied',
            sourceRef: 'Shift 1 cut-off standard',
          },
        },
        activeContribution: {
          id: 'c-demo',
          authorName: 'Minh',
          authorRole: 'New team member',
          contextTopic: 'Destination',
          text: 'Just checking — do we still put the finished units in Tray A? I saw a new tray setup and wasn\'t sure.',
          timestamp: 'Today · 10:02 AM',
        },
        activeResponse: {
          id: 'r-demo',
          authorName: 'An',
          authorRole: 'Team lead',
          responseText: 'Great question, Minh! You\'re right — the units should go to Tray B (not Tray A). I\'ve updated the instruction and added a clearer photo. Thanks for helping make this more accurate for everyone! 🙌',
          timestamp: 'Today · 10:14 AM',
          fieldUpdated: 'Destination',
          beforeValue: 'Tray A',
          afterValue: 'Tray B',
        },
        facilitatorCheckedDetails: true,
        facilitatorCheckedAccessibleOpportunity: true,
        publishedVersion: 'v2.0',
        publishedAt: 'Today · 10:24 AM',
        publishedBy: 'An · Team lead',
        lifecycleStage: 'published_v1',
        currentScreen: screen || 'published',
      }));
    }
  };

  const selectStep = (_stepId: string | number) => {
    // Navigates or highlights step
    setScreen('worker_detail');
  };

  const switchWorkplaceTemplate = (industry: WorkplaceIndustry) => {
    const template = WORKPLACE_TEMPLATES[industry] || WORKPLACE_TEMPLATES.electronics;
    setState((prev) => ({
      ...prev,
      activeIndustry: industry,
      taskId: template.taskId,
      taskTitle: template.taskTitle,
      workArea: template.workArea,
      difficulty: template.difficulty,
      estimatedDuration: template.estimatedDuration,
      referenceStandard: template.referenceStandard,
      outputDescription: template.outputDescription,
      quantity: template.quantity,
      provenance: template.provenance,
      destination: template.initialDestination,
      initialDestination: template.initialDestination,
      isDestinationUpdated: false,
      steps: template.steps,
      workerDraftText: template.typicalQuestions[0] || 'Có thắc mắc tại bước này?',
      facilitatorDraftReply: `Xác nhận thay đổi sang ${template.updatedDestination}. Đã cập nhật chỉ dẫn!`,
      facilitatorDraftDestination: template.updatedDestination,
      lifecycleStage: 'draft_shared',
      activeContribution: null,
      activeResponse: null,
    }));
  };

  const toggleLiveMic = () => {
    setState((prev) => ({
      ...prev,
      isLiveMicActive: !prev.isLiveMicActive,
    }));
  };

  const sendLiveMessage = (text: string, senderName?: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sender: 'Minh' | 'An' | 'System' = senderName
      ? senderName === 'An'
        ? 'An'
        : senderName === 'System'
        ? 'System'
        : 'Minh'
      : state.activePersona === 'facilitator'
      ? 'An'
      : 'Minh';
    const role: 'lead' | 'worker' | 'ai' =
      sender === 'An' ? 'lead' : sender === 'System' ? 'ai' : 'worker';

    const newEntry: HandoffState['liveTranscriptLog'][number] = {
      id: 'tx-' + Date.now(),
      sender,
      role,
      text: text.trim(),
      timestamp: timeStr,
      isAudioPlayed: true,
    };

    setState((prev) => ({
      ...prev,
      liveTranscriptLog: [...prev.liveTranscriptLog, newEntry],
    }));

    // Trigger audio utterance if browser supports TTS
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio speech ignored in headless/restricted environment
    }
  };

  const summarizeLiveConversation = () => {
    const industry = state.activeIndustry || 'electronics';
    const isElec = industry === 'electronics';
    const isFnb = industry === 'fnb';
    const isLog = industry === 'logistics';
    const isRet = industry === 'retail';

    let summary = 'Toàn đội đã thống nhất điều chỉnh điểm đích và giải tỏa tắc nghẽn công đoạn.';
    let actionItems = [
      'Minh: Đã chuyển sang vị trí đích mới theo phê chuẩn của Lead An.',
      'An: Đã cập nhật tài liệu chỉ dẫn trực quan & gắn tem Provenance bảo vệ công nhân.',
    ];
    let safetyAlert = 'Không có rủi ro tai nạn. Hệ thống đèn LED góc chết xưởng (Pillar 3) hoạt động bình thường.';

    if (isFnb) {
      summary = 'Quầy Bar đã hoàn tất cân định lượng Cold Brew; đã chuyển lưu trữ sang Tủ mát dự phòng 02.';
      actionItems = [
        'Minh: Dán nhãn date hôm nay lên 4 chai và đặt vào Tủ 02.',
        'An: Duyệt dùng nắp nhôm bạc thay thế cho lô sáng nay.',
      ];
      safetyAlert = 'Chú ý sàn quầy bar ướt khu vực bồn rửa ly, đã đặt biển cảnh báo trơn trượt.';
    } else if (isLog) {
      summary = 'Phân luồng hàng dễ vỡ sang Băng tải Lane 03 để tránh ùn ứ xe tải chuyến 1.';
      actionItems = [
        'Minh: Quấn 3 lớp mút bóng khí và dán tem Đỏ Cảnh Báo.',
        'An: Điều phối xe tải 10:00 ưu tiên nhận kiện hàng dễ vỡ trước.',
      ];
      safetyAlert = 'Tốc độ băng tải 0.8m/s ổn định; công nhân mang giày bảo hộ chống dập ngón.';
    } else if (isRet) {
      summary = 'Đã áp dụng nguyên tắc FIFO cho dãy kệ B2 và dán tem ưu đãi -20% date gần.';
      actionItems = [
        'Minh: Kéo lốc sữa date gần ra mặt tiền kệ; dán tem giảm giá góc trái.',
        'An: Đổi pin bảng giá điện tử ESL tại quầy sữa tươi.',
      ];
      safetyAlert = 'Lối đi khách hàng thông thoáng; thang xếp lấy hàng đã khóa chốt an toàn.';
    } else if (!isElec) {
      // office
      summary = 'Đã quét OCR 300DPI toàn bộ 5 bộ hồ sơ hợp đồng và lưu vào thư mục đám mây phân quyền.';
      actionItems = [
        'Minh: Đặt tên file chuẩn #HR_2026_[MãNV] và đưa bản gốc vào tủ chống cháy.',
        'An: Cấp quyền truy cập thư mục Cloud_Archive cho phòng Nhân sự.',
      ];
      safetyAlert = 'Bảo mật thông tin nhân sự mức cấp 3 (ISO-27001), không để văn bản lộ thiên.';
    }

    return { summary, actionItems, safetyAlert };
  };

  return (
    <HandoffContext.Provider
      value={{
        state,
        setScreen,
        switchPersona,
        switchWorkplaceTemplate,
        toggleLiveMic,
        sendLiveMessage,
        summarizeLiveConversation,
        toggleDemoDrawer,
        setDemoDrawerOpen,
        startPreparingMessage,
        cancelPreparingMessage,
        updateWorkerDraft,
        sendWorkerContribution,
        updateFacilitatorDrafts,
        shareFacilitatorUpdateAndReply,
        generateAIDraft,
        adoptAIDraft,
        resolveAmbiguityDeadline,
        setSpeechRecording,
        startSpeechRecording,
        stopSpeechRecording,
        setSpeechTranscript,
        playTextToSpeech,
        addCustomQuickOption,
        removeCustomQuickOption,
        triggerSafetyAlert,
        dismissSafetyAlert,
        closeWorkerQuestion,
        reopenDiscussion,
        toggleFacilitatorConfirmation,
        publishInstruction,
        resetDemo,
        jumpToStage,
        setGoldenFlowState,
        selectStep,
      }}
    >
      {children}
    </HandoffContext.Provider>
  );
};

export const useHandoff = (): HandoffContextType => {
  const context = useContext(HandoffContext);
  if (!context) {
    throw new Error('useHandoff must be used within a HandoffProvider');
  }
  return context;
};

