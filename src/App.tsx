import React from 'react';
import { HandoffProvider, useHandoff } from './context/HandoffContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { DemoToolbar } from './components/common/DemoToolbar';
import { BlindCornerAlertModal } from './components/common/BlindCornerAlertModal';
import { StationCallAlertModal } from './components/common/StationCallAlertModal';
import { AppWindowLayout } from './components/common/AppWindowLayout';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorkerTaskDetailScreen } from './components/screens/WorkerTaskDetailScreen';
import { AskSuggestPanel } from './components/screens/AskSuggestPanel';
import { FacilitatorWorkspaceScreen } from './components/screens/FacilitatorWorkspaceScreen';
import { ReviewPublishScreen } from './components/screens/ReviewPublishScreen';
import { PublishedInstructionScreen } from './components/screens/PublishedInstructionScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { TeamScreen } from './components/screens/TeamScreen';
import { ResourcesScreen } from './components/screens/ResourcesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TasksHubScreen } from './components/screens/TasksHubScreen';
import { AccountabilityScreen } from './components/screens/AccountabilityScreen';

const MainApp: React.FC = () => {
  const { state } = useHandoff();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <AppWindowLayout>
        {state.currentScreen === 'home' && <HomeScreen />}
        {state.currentScreen === 'tasks' && <TasksHubScreen />}
        {state.currentScreen === 'worker_detail' && <WorkerTaskDetailScreen />}
        {state.currentScreen === 'ask_suggest' && <AskSuggestPanel />}
        {state.currentScreen === 'facilitator' && <FacilitatorWorkspaceScreen />}
        {state.currentScreen === 'review_publish' && <ReviewPublishScreen />}
        {state.currentScreen === 'published' && <PublishedInstructionScreen />}
        {state.currentScreen === 'messages' && <MessagesScreen />}
        {state.currentScreen === 'learning' && <LearningScreen />}
        {state.currentScreen === 'team' && <TeamScreen />}
        {state.currentScreen === 'resources' && <ResourcesScreen />}
        {state.currentScreen === 'settings' && <SettingsScreen />}
        {state.currentScreen === 'accountability' && <AccountabilityScreen />}
      </AppWindowLayout>

      {/* Discreet Demo Assistant Helper & Drawer (Shortcut: Alt + D) */}
      <DemoToolbar />

      {/* Module 2: Accessible Blind-Corner Safety Alert Modal */}
      <BlindCornerAlertModal />

      {/* Stage 5 Operations: Station Call Visual Alert Modal */}
      <StationCallAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <HandoffProvider>
        <MainApp />
      </HandoffProvider>
    </LanguageProvider>
  );
}
