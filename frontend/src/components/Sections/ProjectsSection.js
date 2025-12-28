import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { ExternalLink, Github, Star, Calendar, Code2, Layers } from 'lucide-react';

const ProjectsSection = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All Projects', count: projects.length },
    { key: 'featured', label: 'Featured', count: projects.filter(p => p.featured).length },
    { key: 'web', label: 'Web Apps', count: projects.filter(p => p.tech_stack?.includes('React')).length },
    { key: 'fullstack', label: 'Full Stack', count: projects.filter(p => p.tech_stack?.some(tech => ['FastAPI', 'Node.js', 'Express'].includes(tech))).length },
  ];

  const filteredProjects = projects.filter(project => {
    switch (filter) {
      case 'featured':
        return project.featured;
      case 'web':
        return project.tech_stack?.includes('React');
      case 'fullstack':
        return project.tech_stack?.some(tech => ['FastAPI', 'Node.js', 'Express'].includes(tech));
      default:
        return true;
    }
  });

  const ProjectCard = ({ project, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <GlassContainer
        variant="card"
        className="h-full p-6 cursor-pointer transition-all duration-300 hover:shadow-glow-green"
        onClick={() => setSelectedProject(project)}
      >
        <div className="space-y-4">
          {/* Project Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-terminal-text group-hover:text-terminal-green transition-colors">
                  {project.title}
                </h3>
                {project.featured && (
                  <Star className="w-4 h-4 text-terminal-yellow fill-current" />
                )}
              </div>
              <p className="text-sm text-terminal-dim line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-terminal-blue">
              <Layers className="w-3 h-3" />
              <span>Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.slice(0, 4).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="tech-badge text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack?.length > 4 && (
                <span className="text-xs text-terminal-dim">
                  +{project.tech_stack.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4 pt-2 border-t border-white border-opacity-10">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-terminal-text hover:text-terminal-green transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
                <span className="text-xs">Code</span>
              </motion.a>
            )}
            {project.live_demo_url && (
              <motion.a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-terminal-text hover:text-terminal-blue transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">Live</span>
              </motion.a>
            )}
            <div className="flex-1"></div>
            <div className="text-xs text-terminal-dim flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(project.created_at).getFullYear()}
            </div>
          </div>

          {/* Hover Effect Indicator */}
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-terminal-green rounded-full opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </GlassContainer>
    </motion.div>
  );

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
            <span className="text-terminal-green">$</span> ls -la /projects/
          </div>
          <div className="text-terminal-dim text-sm">
            {/* Project stats moved to dedicated section */}
          </div>
        </div>
      </GlassContainer>



      {/* Filter Tabs */}
      <GlassContainer variant="strong" className="p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {filters.map((filterOption, index) => (
            <motion.button
              key={filterOption.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setFilter(filterOption.key)}
              className={`
                px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center space-x-2
                ${filter === filterOption.key
                  ? 'bg-terminal-green bg-opacity-20 border border-terminal-green text-terminal-green shadow-glow-green'
                  : 'glass-card hover:bg-opacity-10 text-terminal-text hover:text-terminal-green'
                }
              `}
            >
              <span>{filterOption.label}</span>
              <span className="text-xs bg-terminal-header px-2 py-1 rounded">
                {filterOption.count}
              </span>
            </motion.button>
          ))}
        </div>
      </GlassContainer>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>



      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassContainer variant="strong" className="p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-terminal-text flex items-center space-x-2">
                        <span>{selectedProject.title}</span>
                        {selectedProject.featured && (
                          <Star className="w-5 h-5 text-terminal-yellow fill-current" />
                        )}
                      </h2>
                      <p className="text-terminal-dim mt-2">
                        {selectedProject.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-terminal-dim hover:text-terminal-red transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h3 className="text-lg font-semibold text-terminal-green mb-3 flex items-center">
                      <Code2 className="w-5 h-5 mr-2" />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech_stack?.map((tech, index) => (
                        <span key={index} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex space-x-4">
                    {selectedProject.github_url && (
                      <motion.a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-terminal-green bg-opacity-20 text-terminal-green rounded-lg hover:bg-opacity-30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                      </motion.a>
                    )}
                    {selectedProject.live_demo_url && (
                      <motion.a
                        href={selectedProject.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-terminal-blue bg-opacity-20 text-terminal-blue rounded-lg hover:bg-opacity-30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </GlassContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Want to collaborate? Try: <code className="text-terminal-green">contact</code> or check my <code className="text-terminal-green">experience</code>
        </div>
      </GlassContainer>

      {/* Floating Code Icons */}
      <div className="relative">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 opacity-10 text-terminal-blue"
            style={{
              left: `${10 + i * 25}%`,
              top: `${-30 - i * 15}px`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
            }}
          >
            <Code2 className="w-full h-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;