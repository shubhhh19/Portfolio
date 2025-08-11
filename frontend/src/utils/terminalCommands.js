// Terminal command processing utilities

export const processCommand = async (command, context) => {
  const { 
    portfolioData, 
    skills, 
    projects, 
    experience, 
    isAdminMode, 
    toggleAdminMode,
    setCurrentSection 
  } = context;

  const parts = command.split(' ');
  const mainCommand = parts[0];
  const args = parts.slice(1);

  switch (mainCommand) {
    case 'help':
      if (typeof setCurrentSection === 'function') setCurrentSection('help');
      return {
        type: 'section',
        section: 'help',
        content: ''
      };

    case 'whoami':
      if (typeof setCurrentSection === 'function') setCurrentSection('hero');
      return {
        type: 'section',
        section: 'hero',
        content: ''
      };

    case 'about':
      if (typeof setCurrentSection === 'function') setCurrentSection('about');
      return {
        type: 'section',
        section: 'about',
        content: ''
      };

    case 'skills':
      if (typeof setCurrentSection === 'function') setCurrentSection('skills');
      return {
        type: 'section',
        section: 'skills',
        content: ''
      };

    case 'projects':
      if (typeof setCurrentSection === 'function') setCurrentSection('projects');
      return {
        type: 'section',
        section: 'projects',
        content: ''
      };

    case 'experience':
      if (typeof setCurrentSection === 'function') setCurrentSection('experience');
      return {
        type: 'section',
        section: 'experience',
        content: ''
      };

    case 'contact':
      if (typeof setCurrentSection === 'function') setCurrentSection('contact');
      return {
        type: 'section',
        section: 'contact',
        content: ''
      };

    case 'clear':
    case 'cls':
      return {
        type: 'system',
        content: 'clear',
        section: null
      };

    case 'ls':
      const directories = [
        'about.txt',
        'skills/',
        'projects/',
        'experience/',
        'contact/',
        isAdminMode ? 'admin/' : null
      ].filter(Boolean);
      
      return {
        type: 'info',
        content: [
          'Available sections:',
          '',
          ...directories.map(dir => `  ${dir}`)
        ]
      };

    case 'pwd':
      return {
        type: 'info',
        content: '/home/portfolio'
      };

    case 'cat':
      if (args[0] === 'about.txt' || args[0] === 'about') {
        if (typeof setCurrentSection === 'function') setCurrentSection('about');
        return {
          type: 'section',
          section: 'about',
          content: ''
        };
      }
      return {
        type: 'error',
        content: `cat: ${args[0] || 'filename'}: No such file or directory`
      };

    case 'echo':
      return {
        type: 'info',
        content: args.join(' ')
      };

    case 'date':
      return {
        type: 'info',
        content: new Date().toString()
      };

    case 'uptime':
      const uptimeHours = Math.floor(Date.now() / (1000 * 60 * 60)) % 24;
      return {
        type: 'info',
        content: `Portfolio has been running for ${uptimeHours} hours`
      };

    case 'theme':
      if (args[0] === 'dark' || args[0] === 'light') {
        return {
          type: 'warning',
          content: `Theme switching to ${args[0]} mode is not yet implemented`
        };
      }
      return {
        type: 'info',
        content: 'Current theme: Dark Terminal\nAvailable: dark, light'
      };

    case 'sudo':
      if (args[0] === 'admin' || args[0] === 'su') {
        toggleAdminMode();
        return {
          type: 'success',
          content: isAdminMode 
            ? 'Admin mode deactivated. Switched to guest mode.'
            : 'Admin mode activated. You can now edit portfolio content.'
        };
      }
      return {
        type: 'error',
        content: 'sudo: command not found. Try "sudo admin" to toggle admin mode.'
      };

    case 'edit':
      if (!isAdminMode) {
        return {
          type: 'error',
          content: 'Permission denied. Enable admin mode with "sudo admin" first.'
        };
      }
      if (typeof setCurrentSection === 'function') setCurrentSection('admin');
      return {
        type: 'section',
        section: 'admin',
        content: ''
      };

    case 'git':
      if (args[0] === 'status') {
        return {
          type: 'info',
          content: [
            'On branch main',
            'Your portfolio is up to date.',
            '',
            'Portfolio sections:',
            '  modified:   about.txt',
            '  new file:   projects/terminal-portfolio.md'
          ]
        };
      } else if (args[0] === 'log') {
        if (typeof setCurrentSection === 'function') setCurrentSection('experience');
        return {
          type: 'section',
          section: 'experience',
          content: ''
        };
      }
      return {
        type: 'info',
        content: 'Available git commands: status, log'
      };

    // Fun Commands
    case 'matrix':
      return {
        type: 'success',
        content: [
          'Wake up, Neo... 🕶️',
          'The Matrix has you...',
          'But this portfolio is more stylish!'
        ]
      };

    case 'coffee':
      return {
        type: 'info',
        content: '☕ Brewing coffee... This developer runs on caffeine!'
      };

    case 'konami':
      return {
        type: 'success',
        content: '🎮 ↑↑↓↓←→←→BA - Cheat mode activated! All skills now level 5!'
      };

    case 'love':
      return {
        type: 'success',
        content: '❤️ Made with love and lots of code!'
      };

    case 'magic':
      return {
        type: 'success',
        content: '✨ Abracadabra! Your code is now bug-free!'
      };

    case 'rocket':
      return {
        type: 'success',
        content: '🚀 To infinity and beyond!'
      };

    case 'history':
      return {
        type: 'info',
        content: 'Command history is maintained in your current session.'
      };

    case 'man':
      const helpTopic = args[0];
      if (helpTopic) {
        return {
          type: 'info',
          content: [
            `Manual page for: ${helpTopic}`,
            '',
            getManualPage(helpTopic)
          ]
        };
      }
      return {
        type: 'info',
        content: 'What manual page do you want? Try "man help"'
      };

    case 'exit':
    case 'quit':
      return {
        type: 'warning',
        content: 'There is no escape from the terminal portfolio! 😄 Try the menu bar above for easier navigation.'
      };

    case 'ping':
      const target = args[0] || 'localhost';
      return {
        type: 'success',
        content: `PING ${target}: 64 bytes from ${target}: time=1ms`
      };

    case 'dashboard':
      if (typeof setCurrentSection === 'function') setCurrentSection('dashboard');
      return {
        type: 'success',
        content: 'Returning to dashboard view...'
      };

    default:
      return {
        type: 'error',
        content: [
          `Command '${command}' not found.`,
          'Type "help" to see available commands.',
          'Or use the menu bar above for easy navigation!'
        ]
      };
  }
};

const getManualPage = (topic) => {
  const manPages = {
    help: 'Display available commands and their descriptions.',
    whoami: 'Display information about the developer.',
    about: 'Show detailed information about background and education.',
    skills: 'List technical skills and proficiencies.',
    projects: 'Display portfolio projects with demos and code links.',
    experience: 'Show work experience and professional timeline.',
    contact: 'Display contact information and social links.',
    clear: 'Clear the terminal screen.',
    ls: 'List available sections and files.',
    cat: 'Display contents of a file (try "cat about.txt").',
    git: 'Git-style commands for portfolio navigation.',
    sudo: 'Switch between guest and admin modes.',
    matrix: 'Enter the Matrix... if you dare.',
    coffee: 'Virtual coffee break for developers.',
    dashboard: 'Return to the main dashboard view.',
  };

  return manPages[topic] || `No manual entry for ${topic}`;
};