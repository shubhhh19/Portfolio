import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Github, 
  Linkedin, 
  Phone, 
  Send, 
  Check, 
  AlertCircle,
  ExternalLink,
  MessageSquare,
  User,
  AtSign
} from 'lucide-react';

const ContactSection = () => {
  const { portfolioData } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [terminalMode] = useState(true);
  const formRef = useRef();

  const contactData = portfolioData.contact?.content || {};

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/shubhhh19',
      color: 'text-terminal-text hover:text-white',
      description: 'Check out my code'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/shubhsoni',
      color: 'text-terminal-text hover:text-blue-400',
      description: 'Professional network'
    },
    {
      name: 'LeetCode',
      icon: AtSign,
      url: 'https://leetcode.com/u/shubhhh19/',
      color: 'text-terminal-text hover:text-yellow-300',
      description: 'Daily coding practice'
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration
      const result = await emailjs.sendForm(
        'service_portfolio', // Your EmailJS service ID
        'template_nqun0gd', // Your EmailJS template ID
        formRef.current,
        '8tBRcPUYgVH_7NKua' // Your EmailJS public key
      );
      
      console.log('Email sent successfully:', result.text);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const TerminalContactForm = () => (
    <GlassContainer variant="strong" className="p-6">
      <div className="space-y-4">
        {/* Terminal Header */}
        <div className="font-mono space-y-1 mb-6">
          <div className="text-terminal-green">
            <span className="text-terminal-green">$</span> ./contact.sh
          </div>
          <div className="text-terminal-dim text-sm">
            Initiating secure contact protocol...
          </div>
        </div>

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-terminal-green font-mono text-sm mb-2">
              $ contact --name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full bg-transparent border border-terminal-green border-opacity-30 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-terminal-green font-mono text-sm mb-2">
              $ contact --email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full bg-transparent border border-terminal-green border-opacity-30 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-terminal-green font-mono text-sm mb-2">
              $ contact --message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message here..."
              rows={4}
              className="w-full bg-transparent border border-terminal-green border-opacity-30 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none resize-none font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-terminal-green">
              $ send
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-6 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center space-x-2
                ${isSubmitting || submitStatus === 'success'
                  ? 'bg-terminal-green bg-opacity-20 text-terminal-green cursor-not-allowed'
                  : 'bg-terminal-green bg-opacity-10 border border-terminal-green text-terminal-green hover:bg-opacity-20 hover:shadow-glow-green'
                }
              `}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-terminal-green border-t-transparent rounded-full"></div>
                  <span>Sending...</span>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded font-mono text-sm flex items-center space-x-2 ${
                submitStatus === 'success' 
                  ? 'bg-terminal-green bg-opacity-20 text-terminal-green border border-terminal-green border-opacity-30'
                  : 'bg-terminal-red bg-opacity-20 text-terminal-red border border-terminal-red border-opacity-30'
              }`}
            >
              {submitStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Failed to send message. Please try again.</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassContainer>
  );

  const TraditionalContactForm = () => (
    <GlassContainer variant="strong" className="p-6">
      <h2 className="text-xl font-semibold text-terminal-green mb-6 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2" />
        Send a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-terminal-text text-sm font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-terminal-blue" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-white border-opacity-20 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-terminal-text text-sm font-medium mb-2 flex items-center">
              <AtSign className="w-4 h-4 mr-2 text-terminal-blue" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-white border-opacity-20 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-terminal-text text-sm font-medium mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-terminal-blue" />
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full bg-transparent border border-white border-opacity-20 rounded px-3 py-2 text-terminal-text placeholder-terminal-dim focus:border-terminal-green focus:outline-none resize-none"
            placeholder="Your message..."
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-terminal-green bg-opacity-10 border border-terminal-green text-terminal-green rounded-lg hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-terminal-green border-t-transparent rounded-full"></div>
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </motion.button>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded flex items-center space-x-2 ${
                submitStatus === 'success' 
                  ? 'bg-terminal-green bg-opacity-20 text-terminal-green'
                  : 'bg-terminal-red bg-opacity-20 text-terminal-red'
              }`}
            >
              {submitStatus === 'success' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to send message. Please try again.</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </GlassContainer>
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
        <div className="font-mono">
          <div className="text-terminal-green">
            <span className="text-terminal-green">$</span> contact --help
          </div>
          <div className="text-terminal-dim text-sm">
            Terminal-based contact form
          </div>
        </div>
      </GlassContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div>
          <TerminalContactForm />
        </div>

        {/* Contact Info & Social Links */}
        <div className="space-y-6">
          {/* Direct Contact */}
          <GlassContainer variant="card" className="p-6">
            <h2 className="text-lg font-semibold text-terminal-green mb-4">
              📫 Get In Touch
            </h2>
            
            <div className="space-y-4">
              <motion.a
                href="mailto:sonishubh2004@gmail.com"
                className="flex items-center space-x-3 p-3 glass-card rounded hover:bg-opacity-10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5 text-terminal-blue" />
                <div>
                  <div className="text-terminal-text font-medium">Email</div>
                  <div className="text-terminal-dim text-sm">sonishubh2004@gmail.com</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-terminal-dim" />
              </motion.a>

              {contactData.phone && (
                <motion.a
                  href={`tel:${contactData.phone}`}
                  className="flex items-center space-x-3 p-3 glass-card rounded hover:bg-opacity-10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-5 h-5 text-terminal-green" />
                  <div>
                    <div className="text-terminal-text font-medium">Phone</div>
                    <div className="text-terminal-dim text-sm">{contactData.phone}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-terminal-dim" />
                </motion.a>
              )}
            </div>
          </GlassContainer>

          {/* Social Links */}
          <GlassContainer variant="card" className="p-6">
            <h2 className="text-lg font-semibold text-terminal-green mb-4">
              🌐 Connect Online
            </h2>
            
            <div className="space-y-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 p-3 glass-card rounded transition-all ${social.color}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{social.name}</div>
                      <div className="text-terminal-dim text-sm">{social.description}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto text-terminal-dim" />
                  </motion.a>
                );
              })}
            </div>
          </GlassContainer>

          {/* Response Time */}
          <GlassContainer variant="card" className="p-4">
            <div className="text-center">
              <div className="text-terminal-green text-2xl font-bold">&lt; 24h</div>
              <div className="text-terminal-text text-sm">Average Response Time</div>
              <div className="text-terminal-dim text-xs mt-1">Usually much faster! ⚡</div>
            </div>
          </GlassContainer>
        </div>
      </div>

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Looking for my work? Try: <code className="text-terminal-green">projects</code> or <code className="text-terminal-green">skills</code>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default ContactSection;