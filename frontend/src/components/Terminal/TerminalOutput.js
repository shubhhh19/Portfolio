import React from 'react';
import HeroSection from '../Sections/HeroSection';
import AboutSection from '../Sections/AboutSection';
import SkillsSection from '../Sections/SkillsSection';
import ProjectsSection from '../Sections/ProjectsSection';
import ExperienceSection from '../Sections/ExperienceSection';
import ContactSection from '../Sections/ContactSection';
import HelpSection from '../Sections/HelpSection';

const TerminalOutput = ({ item, currentSection }) => {
  const getTextColorClass = () => {
    switch (item.type) {
      case 'error':
        return 'text-terminal-red';
      case 'success':
        return 'text-terminal-green';
      case 'info':
        return 'text-terminal-blue';
      case 'warning':
        return 'text-terminal-yellow';
      case 'command':
        return 'text-terminal-dim';
      case 'section':
        return 'text-terminal-text';
      default:
        return 'text-terminal-text';
    }
  };

  const renderSectionContent = () => {
    switch (item.section) {
      case 'hero':
        return <HeroSection />;
      case 'about':
        return <AboutSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'contact':
        return <ContactSection />;
      case 'help':
        return <HelpSection />;
      default:
        return null;
    }
  };

  if (item.section) {
    return (
      <div className="mb-4">
        {renderSectionContent()}
      </div>
    );
  }

  return (
    <div className={`mb-1 ${getTextColorClass()} leading-relaxed`}>
      {Array.isArray(item.content) ? (
        item.content.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))
      ) : (
        <div>{item.content}</div>
      )}
    </div>
  );
};

export default TerminalOutput;