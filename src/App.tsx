import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
import { JournalPage } from './components/JournalPage';
import { CalendarPage } from './components/CalendarPage';
import { InsightsPage } from './components/InsightsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ToolsPage } from './components/ToolsPage';
import { SettingsPage } from './components/SettingsPage';
import { CommunityPage } from './components/CommunityPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { ChallengesPage } from './components/ChallengesPage';
import { PricingPage } from './components/PricingPage';
import { ResourcesPage } from './components/ResourcesPage';
import { ChaptersPage } from './components/ChaptersPage';
import { CaregiverPage } from './components/CaregiverPage';
import { TherapistSupportPage } from './components/TherapistSupportPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GoalsPage } from './components/GoalsPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'journal' | 'calendar' | 'insights' | 'tools' | 'favorites' | 'settings' | 'community' | 'profile' | 'history' | 'challenges' | 'pricing' | 'resources' | 'chapters' | 'caregiver' | 'therapist-support' | 'analytics' | 'goals'>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage onStartJournal={() => setCurrentPage('journal')} onNavigate={setCurrentPage} />
      ) : currentPage === 'journal' ? (
        <JournalPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'calendar' ? (
        <CalendarPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'insights' ? (
        <InsightsPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'favorites' ? (
        <FavoritesPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'tools' ? (
        <ToolsPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'settings' ? (
        <SettingsPage onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page as any)} />
      ) : currentPage === 'community' ? (
        <CommunityPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'profile' ? (
        <ProfilePage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'history' ? (
        <HistoryPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'challenges' ? (
        <ChallengesPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'pricing' ? (
        <PricingPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'resources' ? (
        <ResourcesPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'chapters' ? (
        <ChaptersPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'caregiver' ? (
        <CaregiverPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'therapist-support' ? (
        <TherapistSupportPage onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'analytics' ? (
        <AnalyticsDashboard onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'goals' ? (
        <GoalsPage onBack={() => setCurrentPage('home')} />
      ) : (
        <div>Feature coming soon</div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
