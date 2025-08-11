import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { GraduationCap, ExternalLink, Calendar, MapPin } from 'lucide-react';

const EducationSection = () => {
  const { portfolioData } = usePortfolio();
  
  const education = [
    {
      degree: "Software Engineering - Conestoga College",
      description: "Advanced Diploma in Software Engineering Technology (3 years) at Conestoga College, Waterloo",
      link: "#",
      year: "Jan 2023 - April 2025"
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
            <span className="text-terminal-green">$</span> cat /education/degree.txt
          </div>
          <div className="text-terminal-dim text-sm">
            * Found {education.length} educational qualification
          </div>
        </div>
      </GlassContainer>

      {/* Education Timeline */}
      <div className="space-y-6">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <GlassContainer variant="strong" className="p-6 hover:shadow-glow-green transition-all duration-300">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-terminal-green p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-terminal-dark" />
                      </div>
                      <h3 className="text-lg font-semibold text-terminal-text">
                        {edu.degree}
                      </h3>
                    </div>
                    <p className="text-terminal-dim leading-relaxed">
                      {edu.description}
                    </p>
                    <ul className="mt-2 text-sm text-terminal-text list-disc list-inside space-y-1">
                      <li>Concentration: Full‑stack development, distributed systems, databases</li>
                      <li>Activities: Coding club, hackathons, peer tutoring</li>
                      <li>Capstone: End‑to‑end web platform with CI/CD</li>
                    </ul>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center space-x-6 text-sm text-terminal-dim">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-terminal-green">{edu.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Waterloo, ON</span>
                  </div>
                </div>

                {/* Link */}

              </div>
            </GlassContainer>
          </motion.div>
        ))}
      </div>



      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Want to see more? Try: <code className="text-terminal-green">experience</code> or <code className="text-terminal-green">projects</code>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default EducationSection;
