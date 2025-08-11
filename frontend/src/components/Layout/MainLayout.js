import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

// Import sections
import HeroSection from '../Sections/HeroSection';
import AboutSection from '../Sections/AboutSection';
import SkillsSection from '../Sections/SkillsSection';
import ProjectsSection from '../Sections/ProjectsSection';
import ExperienceSection from '../Sections/ExperienceSection';
import ContactSection from '../Sections/ContactSection';
import HelpSection from '../Sections/HelpSection';
import DashboardView from '../Views/DashboardView';
import AdminPanel from '../Views/AdminPanel';
import AdminLogin from '../UI/AdminLogin';

// Import components
import Background3D from '../3D/Background3D';
import MacMenuBar from '../UI/MacMenuBar';
import Terminal from '../Terminal/Terminal';
import QuickTerminalBar from '../Terminal/QuickTerminalBar';

const MainLayout = () => {
  const { currentSection, setCurrentSection, isAdminMode, showAdminLogin, setShowAdminLogin } = usePortfolio();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const sections = {
    home: HeroSection,
    about: AboutSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    experience: ExperienceSection,
    contact: ContactSection,
    help: HelpSection,
    dashboard: DashboardView,
    admin: isAdminMode ? AdminPanel : null,
  };

  const CurrentSection = sections[currentSection];

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text relative overflow-hidden">
      {/* 3D Background */}
      <Background3D />
      
      {/* Mac Menu Bar */}
      <MacMenuBar 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          {CurrentSection && (
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Terminal */}
      <Terminal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Quick Terminal Bar */}
      <QuickTerminalBar 
        onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)}
      />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={handleCloseAdminLogin} />
      )}
    </div>
  );
};

export default MainLayout;