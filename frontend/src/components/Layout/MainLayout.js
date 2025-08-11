import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MacMenuBar from '../UI/MacMenuBar';
import Background3D from '../3D/Background3D';
import GlassContainer from '../UI/GlassContainer';
import Terminal from '../Terminal/Terminal';
import DashboardView from '../Views/DashboardView';
import HeroSection from '../Sections/HeroSection';
import AboutSection from '../Sections/AboutSection';
import SkillsSection from '../Sections/SkillsSection';
import ProjectsSection from '../Sections/ProjectsSection';
import ExperienceSection from '../Sections/ExperienceSection';
import ContactSection from '../Sections/ContactSection';
import HelpSection from '../Sections/HelpSection';
import EducationSection from '../Sections/EducationSection';
import TechStackSection from '../Sections/TechStackSection';
import FunCommands from '../Terminal/FunCommands';
import ResumeSection from '../Sections/ResumeSection';
import AdminPanel from '../Views/AdminPanel';
import QuickTerminalBar from '../Terminal/QuickTerminalBar';
import { Terminal as TerminalIcon } from 'lucide-react';

const MainLayout = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const funCommandsRef = useRef(null);

  const sectionComponents = {
    dashboard: DashboardView,
    hero: HeroSection,
    about: AboutSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    experience: ExperienceSection,
    contact: ContactSection,
    help: HelpSection,
    education: EducationSection,
    techstack: TechStackSection,
    resume: ResumeSection,
    admin: AdminPanel,
  };

  const sectionLabelMap = {
    dashboard: 'Dashboard',
    hero: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
    help: 'Help',
    education: 'Education',
    techstack: 'Tech Stack',
    resume: 'Resume',
  };

  const CurrentSectionComponent = sectionComponents[currentSection] || DashboardView;

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  const scrollToFunCommands = () => {
    if (funCommandsRef.current) {
      funCommandsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWindowAction = (action) => {
    if (action === 'close') setIsTerminalOpen(false);
    if (action === 'minimize') setIsTerminalOpen(false);
    if (action === 'zoom') setIsTerminalOpen(true);
  };

  // Update document title based on section
  useEffect(() => {
    const suffix = sectionLabelMap[currentSection] || 'Home';
    document.title = `Shubh Soni | ${suffix}`;
  }, [currentSection]);

  return (
    <div className="min-h-screen bg-terminal-dark overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Background3D />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* macOS Menu Bar */}
        <MacMenuBar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onTerminalToggle={toggleTerminal}
          isTerminalOpen={isTerminalOpen}
          onWindowAction={handleWindowAction}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex relative">
          {/* Primary Content */}
          <motion.div className="flex-1 transition-all duration-300">
            {/* Terminal Window Style Header */}
            <div className="p-4 h-full">
              <GlassContainer className="w-full h-full bg-opacity-5 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-terminal-header bg-opacity-90 backdrop-blur-md border-b border-terminal-green border-opacity-30">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setIsTerminalOpen(false)} className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></button>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                    </div>
                      <div className="text-terminal-green text-sm font-mono opacity-80">
                        {sectionLabelMap[currentSection] || 'Dashboard'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleTerminal}
                        className="text-terminal-dim hover:text-terminal-green transition-colors font-mono text-sm"
                        title="Toggle Terminal"
                      >
                        <TerminalIcon className="w-4 h-4" />
                      </button>
                      {isTerminalOpen && (
                        <button
                          onClick={scrollToFunCommands}
                          className="text-terminal-dim hover:text-terminal-green transition-colors font-mono text-xs px-1 py-0.5 rounded border border-terminal-green border-opacity-30"
                          title="Scroll to Fun Commands"
                        >
                          Fun
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-28">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CurrentSectionComponent onSectionChange={handleSectionChange} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </GlassContainer>
            </div>
          </motion.div>

          {/* Terminal Sidebar */}
          <AnimatePresence>
            {isTerminalOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                 className="fixed right-0 top-8 bottom-0 w-full md:w-96 z-[65]"
              >
                <div className="h-full p-2 md:p-4 flex flex-col">
                  {/* Terminal Panel */}
                  <div className="flex-1 mb-2 md:mb-4">
                    <GlassContainer variant="strong" className="h-full">
                      <div className="h-full flex flex-col">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-2 md:px-4 py-2 bg-terminal-header bg-opacity-90 backdrop-blur-md border-b border-terminal-green border-opacity-30">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => setIsTerminalOpen(false)} className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></button>
                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-sm"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
                          </div>
                          <div className="text-terminal-green text-xs font-mono opacity-80">
                            Terminal
                          </div>
                          <div className="w-4" />
                        </div>

                        {/* Terminal Content */}
                        <div className="flex-1 overflow-y-auto">
                          <Terminal />
                        </div>
                      </div>
                    </GlassContainer>
                  </div>

                  {/* Fun Commands Panel */}
                  <div className="h-40 md:h-48" ref={funCommandsRef}>
                    <FunCommands />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Always-visible quick terminal bar */}
      <QuickTerminalBar onHelp={() => setCurrentSection('help')} onNavigate={setCurrentSection} />
    </div>
  );
};

export default MainLayout;