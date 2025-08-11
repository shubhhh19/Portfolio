import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { 
  Code, Github, Cloud, Edit, Users, Database, 
  BarChart3, Wrench, Shield, Rocket, Palette, 
  Settings, Bug, CheckCircle, ExternalLink 
} from 'lucide-react';

const TechStackSection = () => {
  const { portfolioData } = usePortfolio();
  
  const techStack = [
    {
      category: "Development Tools",
      tools: [
        { name: "VS Code", description: "Code Editor", icon: Edit },
        { name: "VS Code Community", description: "Code Editor", icon: Edit },
        { name: "PyCharm", description: "Python IDE", icon: Code },
        { name: "Github", description: "Version Control", icon: Github },
        { name: "Leetcode", description: "Coding Preparation", icon: Code }
      ]
    },
    {
      category: "Cloud & Deployment",
      tools: [
        { name: "AWS", description: "Cloud Services", icon: Cloud },
        { name: "Google Cloud", description: "Cloud Platform", icon: Cloud },
        { name: "Azure", description: "Microsoft Cloud", icon: Cloud },
        { name: "Vercel", description: "Deployment", icon: Rocket },
        { name: "Heroku", description: "Cloud Platform", icon: Cloud },
        { name: "Netlify", description: "Web Hosting", icon: Rocket }
      ]
    },
    {
      category: "Design & Prototyping",
      tools: [
        { name: "Balsamiq", description: "Mockups", icon: Palette },
        { name: "Draw.io", description: "Diagramming", icon: BarChart3 },
        { name: "MockFlow", description: "Wireframing", icon: Palette },
        { name: "Lucidchart", description: "Diagramming", icon: BarChart3 }
      ]
    },
    {
      category: "Databases",
      tools: [
        { name: "MySQL", description: "Database", icon: Database },
        { name: "SQLite", description: "Database", icon: Database },
        { name: "MongoDB", description: "Database", icon: Database }
      ]
    },
    {
      category: "Testing & Quality",
      tools: [
        { name: "Postman", description: "API Testing", icon: Wrench },
        { name: "Jest", description: "Testing", icon: Bug },
        { name: "NUnit", description: "Testing Framework", icon: Bug },
        { name: "ESLint", description: "JavaScript Linting", icon: CheckCircle },
        { name: "SonarQube", description: "Code Quality", icon: Shield }
      ]
    },
    {
      category: "Project Management",
      tools: [
        { name: "Jira", description: "Issue Tracking", icon: Users }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Terminal Header */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono space-y-1">
          <div className="text-terminal-green">
            <span className="text-terminal-green">$</span> ls -la /tech-stack/
          </div>
          <div className="text-terminal-dim text-sm">
            * Found {techStack.length} categories with {techStack.reduce((acc, cat) => acc + cat.tools.length, 0)} tools
          </div>
        </div>
      </GlassContainer>

      {/* Tech Stack Categories */}
      <div className="space-y-8">
        {techStack.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <GlassContainer variant="strong" className="p-4">
              <h3 className="text-xl font-semibold text-terminal-green mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>{category.category}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {category.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={toolIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: toolIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-terminal-header bg-opacity-30 backdrop-blur-sm border border-white border-opacity-10 rounded-lg p-3 hover:bg-opacity-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-terminal-green p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <tool.icon className="text-terminal-dark text-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-terminal-text font-medium text-sm">{tool.name}</h4>
                        <p className="text-terminal-dim text-xs">{tool.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassContainer>
          </motion.div>
        ))}
      </div>

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Want to see my work? Try: <code className="text-terminal-green">projects</code> or <code className="text-terminal-green">experience</code>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default TechStackSection;
