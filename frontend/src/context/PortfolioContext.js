import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    hero: null,
    about: null,
    contact: null,
  });
  
  // Default skills used when backend is unavailable
  const defaultSkills = [
    // Languages
    { id: 'lang-python', name: 'Python', category: 'languages', proficiency: 5 },
    { id: 'lang-javascript', name: 'JavaScript', category: 'languages', proficiency: 5 },
    { id: 'lang-typescript', name: 'TypeScript', category: 'languages', proficiency: 4 },
    { id: 'lang-java', name: 'Java', category: 'languages', proficiency: 4 },
    { id: 'lang-c', name: 'C', category: 'languages', proficiency: 3 },
    { id: 'lang-cpp', name: 'C++', category: 'languages', proficiency: 3 },
    { id: 'lang-php', name: 'PHP', category: 'languages', proficiency: 3 },
    { id: 'lang-html', name: 'HTML5', category: 'languages', proficiency: 5 },
    { id: 'lang-css', name: 'CSS3', category: 'languages', proficiency: 5 },
    { id: 'lang-kotlin', name: 'Kotlin', category: 'languages', proficiency: 2 },
    { id: 'lang-csharp', name: 'C#', category: 'languages', proficiency: 3 },
    { id: 'lang-assembly', name: 'Assembly Script', category: 'languages', proficiency: 2 },
    { id: 'lang-latex', name: 'LaTeX', category: 'languages', proficiency: 4 },
    { id: 'lang-markdown', name: 'Markdown', category: 'languages', proficiency: 5 },

    // Frameworks & Libraries
    { id: 'fw-dotnet', name: '.NET', category: 'frameworks', proficiency: 3 },
    { id: 'fw-bootstrap', name: 'Bootstrap', category: 'frameworks', proficiency: 5 },
    { id: 'fw-django', name: 'Django', category: 'frameworks', proficiency: 3 },
    { id: 'fw-express', name: 'Express.js', category: 'frameworks', proficiency: 4 },
    { id: 'fw-flask', name: 'Flask', category: 'frameworks', proficiency: 4 },
    { id: 'fw-jwt', name: 'JWT', category: 'frameworks', proficiency: 4 },
    { id: 'fw-npm', name: 'npm', category: 'frameworks', proficiency: 5 },
    { id: 'fw-next', name: 'Next.js', category: 'frameworks', proficiency: 3 },
    { id: 'fw-node', name: 'Node.js', category: 'frameworks', proficiency: 5 },
    { id: 'fw-opencv', name: 'OpenCV', category: 'frameworks', proficiency: 3 },
    { id: 'fw-opengl', name: 'OpenGL', category: 'frameworks', proficiency: 2 },
    { id: 'fw-rabbitmq', name: 'RabbitMQ', category: 'frameworks', proficiency: 2 },
    { id: 'fw-react', name: 'React', category: 'frameworks', proficiency: 5 },
    { id: 'fw-jquery', name: 'jQuery', category: 'frameworks', proficiency: 4 },
    { id: 'fw-socketio', name: 'Socket.io', category: 'frameworks', proficiency: 3 },

    // Databases & Version Control
    { id: 'db-mysql', name: 'MySQL', category: 'databases', proficiency: 4 },
    { id: 'db-sqlite', name: 'SQLite', category: 'databases', proficiency: 4 },
    { id: 'db-mongodb', name: 'MongoDB', category: 'databases', proficiency: 4 },
    { id: 'db-postgresql', name: 'PostgreSQL', category: 'databases', proficiency: 3 },
    { id: 'tool-git', name: 'Git', category: 'tools', proficiency: 5 },
    { id: 'tool-github', name: 'GitHub', category: 'tools', proficiency: 5 },

    // Cloud & APIs
    { id: 'cloud-aws', name: 'AWS', category: 'cloud', proficiency: 3 },
    { id: 'cloud-gcp', name: 'Google Cloud', category: 'cloud', proficiency: 3 },
    { id: 'cloud-azure', name: 'Azure', category: 'cloud', proficiency: 3 },
    { id: 'cloud-heroku', name: 'Heroku', category: 'cloud', proficiency: 4 },
    { id: 'cloud-netlify', name: 'Netlify', category: 'cloud', proficiency: 4 },
    { id: 'cloud-vercel', name: 'Vercel', category: 'cloud', proficiency: 4 },
    { id: 'cloud-docker', name: 'Docker', category: 'cloud', proficiency: 3 },

    // Design & Media
    { id: 'tool-adobe', name: 'Adobe Creative Cloud', category: 'tools', proficiency: 3 },
    { id: 'tool-figma', name: 'Figma', category: 'tools', proficiency: 4 },
    { id: 'tool-canva', name: 'Canva', category: 'tools', proficiency: 4 },
    { id: 'tool-framer', name: 'Framer', category: 'tools', proficiency: 3 },

    // IDEs & Tools
    { id: 'tool-androidstudio', name: 'Android Studio', category: 'tools', proficiency: 3 },
    { id: 'tool-vscode', name: 'VS Code', category: 'tools', proficiency: 5 },
    { id: 'tool-visualstudio', name: 'Visual Studio', category: 'tools', proficiency: 3 },
    { id: 'tool-xcode', name: 'Xcode', category: 'tools', proficiency: 2 },
    { id: 'tool-pycharm', name: 'PyCharm', category: 'tools', proficiency: 4 },
    { id: 'tool-doxygen', name: 'Doxygen', category: 'tools', proficiency: 2 },
    { id: 'tool-jira', name: 'Jira', category: 'tools', proficiency: 3 },
    { id: 'tool-postman', name: 'Postman', category: 'tools', proficiency: 5 },
    { id: 'tool-jest', name: 'Jest', category: 'tools', proficiency: 4 },
    { id: 'tool-eslint', name: 'ESLint', category: 'tools', proficiency: 4 },
    { id: 'tool-sonarqube', name: 'SonarQube', category: 'tools', proficiency: 3 },
    { id: 'tool-nunit', name: 'NUnit', category: 'tools', proficiency: 3 },
    { id: 'tool-drawio', name: 'Draw.io', category: 'tools', proficiency: 4 },
    { id: 'tool-lucidchart', name: 'Lucidchart', category: 'tools', proficiency: 4 },
    { id: 'tool-mockflow', name: 'MockFlow', category: 'tools', proficiency: 3 },
    { id: 'tool-balsamiq', name: 'Balsamiq', category: 'tools', proficiency: 3 },

    // Operating Systems
    { id: 'os-android', name: 'Android', category: 'tools', proficiency: 4 },
    { id: 'os-ios', name: 'iOS', category: 'tools', proficiency: 3 },
    { id: 'os-kali', name: 'Kali', category: 'tools', proficiency: 2 },
    { id: 'os-linux', name: 'Linux', category: 'tools', proficiency: 4 },
    { id: 'os-macos', name: 'macOS', category: 'tools', proficiency: 4 },
    { id: 'os-ubuntu', name: 'Ubuntu', category: 'tools', proficiency: 4 },
    { id: 'os-windows', name: 'Windows', category: 'tools', proficiency: 5 },

    // Learning interests
    { id: 'learn-ruby', name: 'Ruby', category: 'tools', proficiency: 1 },
    { id: 'learn-go', name: 'Go', category: 'tools', proficiency: 1 },
    { id: 'learn-graphql', name: 'GraphQL', category: 'tools', proficiency: 2 },
  ];

  const [skills, setSkills] = useState(defaultSkills);
  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'Handwritten Text Recognition',
      description: 'Handwritten Text Recognition Website',
      tech_stack: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'HTML/CSS'],
      github_url: 'https://github.com/shubhhh19/Handwritten-Text-Recognition',
      live_demo_url: null,
      featured: true,
      created_at: '2024-01-01'
    },
    {
      id: '2',
      title: 'CodeSniff',
      description: 'AI Code Reviewer',
      tech_stack: ['React', 'Node.js', 'OpenAI API', 'TypeScript', 'Tailwind CSS'],
      github_url: null,
      live_demo_url: 'https://ai-code-reviewer-navy.vercel.app/',
      featured: true,
      created_at: '2024-02-01'
    },
    {
      id: '3',
      title: 'Cyphex',
      description: 'Check Data Breach',
      tech_stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
      github_url: null,
      live_demo_url: 'https://cyphex.vercel.app/',
      featured: true,
      created_at: '2024-03-01'
    },
    {
      id: '4',
      title: 'Emergency Health QR',
      description: 'A web application designed to help users create and manage digital health cards containing critical medical information.',
      tech_stack: ['React', 'Node.js', 'MongoDB', 'Express', 'QR Code API'],
      github_url: null,
      live_demo_url: 'https://emergency-health-card.vercel.app/',
      featured: false,
      created_at: '2023-12-01'
    },
    {
      id: '5',
      title: 'Kindle Library',
      description: 'A Book Buying App',
      tech_stack: ['React Native', 'Firebase', 'Redux', 'Stripe API'],
      github_url: 'https://github.com/shubhhh19/Kindle-Library',
      live_demo_url: 'https://kindle-library.vercel.app',
      featured: false,
      created_at: '2023-11-01'
    },
    {
      id: '6',
      title: 'Expense Tracker',
      description: 'Expense Tracking Android App',
      tech_stack: ['Android', 'Java', 'SQLite', 'Room Database', 'Material Design'],
      github_url: null,
      live_demo_url: 'https://bestestexpensetracker.netlify.app/login',
      featured: false,
      created_at: '2023-10-01'
    },
    {
      id: '7',
      title: 'Text Editor',
      description: 'Text Editing App',
      tech_stack: ['Python', 'Tkinter', 'File I/O', 'Regular Expressions'],
      github_url: 'https://github.com/shubhhh19/Text-Editor',
      live_demo_url: null,
      featured: false,
      created_at: '2023-09-01'
    },
    {
      id: '8',
      title: 'Hi Lo Game',
      description: 'Guess Number Game',
      tech_stack: ['Python', 'Random Module', 'User Input', 'Conditional Logic'],
      github_url: 'https://github.com/shubhhh19/Hi-Lo-Game',
      live_demo_url: null,
      featured: false,
      created_at: '2023-08-01'
    },
    {
      id: '9',
      title: 'Logging Service',
      description: 'A logging service',
      tech_stack: ['Node.js', 'Express', 'Winston', 'MongoDB', 'Docker'],
      github_url: 'https://github.com/shubhhh19/Logging-Service',
      live_demo_url: null,
      featured: false,
      created_at: '2023-07-01'
    }
  ]);
  const [experience, setExperience] = useState([
    {
      id: '1',
      title: 'Software Developer',
      company: 'Freelance',
      location: 'Remote',
      start_date: 'Jan 2023',
      end_date: null,
      is_current: true,
      description: 'Full-stack web development for various clients, specializing in React, Node.js, and modern web technologies. Built scalable applications and delivered high-quality solutions.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
    },
    {
      id: '2',
      title: 'Software Engineering Tutor',
      company: 'Private Tutoring',
      location: 'Remote/In-Person',
      start_date: 'May 2023',
      end_date: 'Dec 2023',
      is_current: false,
      description: 'Provided personalized coding instruction and mentorship to students learning programming fundamentals and advanced concepts.',
      technologies: ['Python', 'JavaScript', 'Java', 'Data Structures']
    },
    {
      id: '3',
      title: 'Discord Server Developer',
      company: 'EsportsHub',
      location: 'Remote',
      start_date: 'Jan 2021',
      end_date: 'Dec 2021',
      is_current: false,
      description: 'Developed and maintained Discord bot applications and server automation tools for gaming communities.',
      technologies: ['Discord.js', 'Node.js', 'MongoDB']
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Admin authentication
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Login as admin
  const loginAsAdmin = async (password) => {
    try {
      // In a real app, you'd verify against backend
      // For now, we'll use a simple check
      const adminToken = process.env.REACT_APP_ADMIN_TOKEN || 'portfolio1919';
      
      if (password === adminToken) {
        setIsAdminMode(true);
        localStorage.setItem('admin_mode', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  // Logout from admin
  const logoutAdmin = () => {
    setIsAdminMode(false);
    localStorage.removeItem('admin_mode');
  };

  // Toggle admin mode (for backward compatibility)
  const toggleAdminMode = () => {
    if (isAdminMode) {
      logoutAdmin();
    } else {
      setShowAdminLogin(true);
    }
  };

  // Fetch all portfolio data
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch portfolio sections
      const sectionsResponse = await axios.get(`${API}/portfolio`);
      const sections = sectionsResponse.data;
      
      const portfolioSections = {};
      sections.forEach(section => {
        portfolioSections[section.section_type] = section;
      });
      setPortfolioData(portfolioSections);

      // Fetch skills, projects, experience in parallel
      const [skillsRes, projectsRes, experienceRes] = await Promise.all([
        axios.get(`${API}/skills`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/experience`)
      ]);

      if (Array.isArray(skillsRes.data) && skillsRes.data.length > 0) {
        setSkills(skillsRes.data);
      } // else keep defaultSkills
      setProjects(projectsRes.data);
      setExperience(experienceRes.data);
      
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update portfolio section
  const updatePortfolioSection = async (sectionType, content) => {
    try {
      const response = await axios.put(`${API}/portfolio/${sectionType}`, {
        content,
        is_active: true
      });
      
      setPortfolioData(prev => ({
        ...prev,
        [sectionType]: response.data
      }));
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error updating ${sectionType}:`, err);
      return { success: false, error: err.message };
    }
  };

  // Skills management
  const addSkill = async (skillData) => {
    try {
      const response = await axios.post(`${API}/skills`, skillData);
      setSkills(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding skill:', err);
      return { success: false, error: err.message };
    }
  };

  const updateSkill = async (skillId, skillData) => {
    try {
      const response = await axios.put(`${API}/skills/${skillId}`, skillData);
      setSkills(prev => prev.map(skill => 
        skill.id === skillId ? response.data : skill
      ));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating skill:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await axios.delete(`${API}/skills/${skillId}`);
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting skill:', err);
      return { success: false, error: err.message };
    }
  };

  // Projects management
  const addProject = async (projectData) => {
    try {
      const response = await axios.post(`${API}/projects`, projectData);
      setProjects(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding project:', err);
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.put(`${API}/projects/${projectId}`, projectData);
      setProjects(prev => prev.map(project => 
        project.id === projectId ? response.data : project
      ));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating project:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${API}/projects/${projectId}`);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting project:', err);
      return { success: false, error: err.message };
    }
  };

  // Experience management
  const addExperience = async (experienceData) => {
    try {
      const response = await axios.post(`${API}/experience`, experienceData);
      setExperience(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding experience:', err);
      return { success: false, error: err.message };
    }
  };

  // Get terminal commands
  const getTerminalCommands = async () => {
    try {
      const response = await axios.get(`${API}/terminal/commands`);
      return response.data;
    } catch (err) {
      console.error('Error fetching terminal commands:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const contextValue = {
    // Data
    portfolioData,
    skills,
    projects,
    experience,
    loading,
    error,
    isAdminMode,
    showAdminLogin,
    setShowAdminLogin,

    // Actions
    fetchPortfolioData,
    updatePortfolioSection,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    toggleAdminMode,
    loginAsAdmin,
    logoutAdmin,
    getTerminalCommands,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;