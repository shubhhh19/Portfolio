import React from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../UI/GlassContainer';
import { FileText, Download } from 'lucide-react';

const RESUME_URL = 'https://shubhhh19.github.io/shubhhh19/';

const ResumeSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-green">
          <span className="text-terminal-green">$</span> open resume.pdf
        </div>
      </GlassContainer>

      <GlassContainer variant="strong" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-terminal-green" />
            <div>
              <h2 className="text-lg font-semibold text-terminal-text">Resume / CV</h2>
              <p className="text-terminal-dim text-sm">View or download the latest resume</p>
            </div>
          </div>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="text-terminal-green hover:text-terminal-text transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="font-mono text-sm">Open</span>
          </a>
        </div>
        <div className="mt-4 h-[70vh]">
          <iframe
            title="Resume"
            src={RESUME_URL}
            className="w-full h-full rounded border border-terminal-green border-opacity-30"
          />
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default ResumeSection;


