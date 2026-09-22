# BridgeOne 🌉

> **Accessible workplace task handoff, visual SOP alignment, and workplace justice platform for inclusive employment.**  
> Project for **ADC HACKATHON**.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+ (tested on Node.js v24)
- npm or yarn

### 2. Installation & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

App will run at **`http://localhost:3000`** (and open automatically in your browser).

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Architecture
- `src/App.tsx` - Main layout and screen router
- `src/components/common/` - Shared layouts, toolbar, headers, brand graphics, live conversation widget
- `src/components/screens/` - Major screens:
  - `HomeScreen`: Dashboard & status overview
  - `TasksHubScreen` & `WorkerTaskDetailScreen`: Accessible task workflow & handoff SOPs
  - `AskSuggestPanel`: Worker-facilitator voice/text suggestions
  - `FacilitatorWorkspaceScreen`: Supervisor / Facilitator review & task assignment
  - `AccountabilityScreen`: Dispute resolution & workplace justice tracking
  - `LearningScreen` & `AILearningMentor`: Micro-learning & training modules
  - `MessagesScreen`, `TeamScreen`, `ResourcesScreen`, `SettingsScreen`
- `src/context/HandoffContext.tsx` - Global state management for handoffs, live audio, task updates
- `src/i18n/` - Bilingual support (English & Vietnamese translations)
