import React, { useMemo, useState } from 'react';
import GlassContainer from '../UI/GlassContainer';
import { usePortfolio } from '../../context/PortfolioContext';

const SectionHeader = ({ title, actions }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-terminal-green font-semibold">{title}</h3>
    {actions}
  </div>
);

const AdminPanel = () => {
  const {
    portfolioData,
    skills,
    projects,
    experience,
    isAdminMode,
    toggleAdminMode,
    fetchPortfolioData,
    updatePortfolioSection,
    addSkill,
    deleteSkill,
    addProject,
    deleteProject,
    addExperience,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('about');

  const aboutContent = useMemo(() => ({
    name: portfolioData?.about?.content?.name || '',
    bio: portfolioData?.about?.content?.bio || '',
    education: portfolioData?.about?.content?.education || {},
    location: portfolioData?.about?.content?.location || '',
    email: portfolioData?.about?.content?.email || '',
  }), [portfolioData]);

  const [aboutForm, setAboutForm] = useState(aboutContent);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'languages', proficiency: 3 });
  const [newProject, setNewProject] = useState({ title: '', description: '', tech_stack: '', github_url: '', live_demo_url: '', featured: false });
  const [newExperience, setNewExperience] = useState({ title: '', company: '', start_date: '', description: '' });

  const tabs = [
    { key: 'about', label: 'About' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
  ];

  if (!isAdminMode) {
    return (
      <GlassContainer variant="card" className="p-6 text-center">
        <div className="text-terminal-text mb-3">Admin mode is off.</div>
        <button
          onClick={toggleAdminMode}
          className="px-4 py-2 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/40 hover:bg-terminal-green/30"
        >
          Enable Admin Mode
        </button>
        <div className="mt-3 text-terminal-dim text-sm">
          Or type <span className="font-mono text-terminal-green">sudo admin</span> in the terminal.
        </div>
      </GlassContainer>
    );
  }

  return (
    <div className="space-y-6">
      <GlassContainer variant="card" className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 rounded text-sm font-mono ${activeTab === t.key ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/40' : 'glass-card text-terminal-text'}`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto text-terminal-dim text-sm">Admin mode: <span className="text-terminal-green">enabled</span></div>
        </div>
      </GlassContainer>

      {activeTab === 'about' && (
        <GlassContainer variant="strong" className="p-4">
          <SectionHeader title="About Section" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Name"
              value={aboutForm.name}
              onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Email"
              value={aboutForm.email}
              onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Location"
              value={aboutForm.location}
              onChange={(e) => setAboutForm({ ...aboutForm, location: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2 md:col-span-2"
            />
            <textarea
              placeholder="Bio"
              value={aboutForm.bio}
              onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
              rows={5}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2 md:col-span-2"
            />
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={async () => {
                await updatePortfolioSection('about', aboutForm);
                await fetchPortfolioData();
              }}
              className="px-4 py-2 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/40 hover:bg-terminal-green/30"
            >
              Save About
            </button>
          </div>
        </GlassContainer>
      )}

      {activeTab === 'skills' && (
        <GlassContainer variant="strong" className="p-4">
          <SectionHeader title="Skills" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            >
              <option value="languages">languages</option>
              <option value="frameworks">frameworks</option>
              <option value="databases">databases</option>
              <option value="cloud">cloud</option>
              <option value="tools">tools</option>
            </select>
            <input
              type="number"
              min="1"
              max="5"
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <button
              onClick={async () => { if (!newSkill.name.trim()) return; await addSkill(newSkill); setNewSkill({ name: '', category: 'languages', proficiency: 3 }); await fetchPortfolioData(); }}
              className="px-4 py-2 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/40 hover:bg-terminal-green/30"
            >Add</button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {(skills || []).map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-terminal-header/40 border border-white/10 rounded px-3 py-2">
                <div className="text-sm text-terminal-text">{s.name} <span className="text-terminal-dim">({s.category})</span></div>
                <button onClick={async () => { await deleteSkill(s.id); await fetchPortfolioData(); }} className="text-terminal-dim hover:text-terminal-red">Delete</button>
              </div>
            ))}
          </div>
        </GlassContainer>
      )}

      {activeTab === 'projects' && (
        <GlassContainer variant="strong" className="p-4">
          <SectionHeader title="Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <input
              placeholder="Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="GitHub URL (optional)"
              value={newProject.github_url}
              onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Live Demo URL (optional)"
              value={newProject.live_demo_url}
              onChange={(e) => setNewProject({ ...newProject, live_demo_url: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Tech stack (comma separated)"
              value={newProject.tech_stack}
              onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-terminal-text">
                <input type="checkbox" checked={newProject.featured} onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })} />
                Featured
              </label>
              <button
                onClick={async () => {
                  if (!newProject.title.trim()) return;
                  const payload = { 
                    ...newProject, 
                    tech_stack: newProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
                    github_url: newProject.github_url.trim() || null,
                    live_demo_url: newProject.live_demo_url.trim() || null
                  };
                  await addProject(payload);
                  setNewProject({ title: '', description: '', tech_stack: '', github_url: '', live_demo_url: '', featured: false });
                  await fetchPortfolioData();
                }}
                className="px-4 py-2 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/40 hover:bg-terminal-green/30"
              >Add</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {(projects || []).map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-terminal-header/40 border border-white/10 rounded px-3 py-2">
                <div className="text-sm text-terminal-text truncate pr-3">{p.title}</div>
                <button onClick={async () => { await deleteProject(p.id); await fetchPortfolioData(); }} className="text-terminal-dim hover:text-terminal-red">Delete</button>
              </div>
            ))}
          </div>
        </GlassContainer>
      )}

      {activeTab === 'experience' && (
        <GlassContainer variant="strong" className="p-4">
          <SectionHeader title="Experience" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <input
              placeholder="Title"
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Start (YYYY-MM)"
              value={newExperience.start_date}
              onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2"
            />
            <input
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-terminal-header/70 border border-white/10 rounded px-3 py-2 md:col-span-2"
            />
            <button
              onClick={async () => {
                if (!newExperience.title.trim()) return;
                await addExperience(newExperience);
                setNewExperience({ title: '', company: '', start_date: '', description: '' });
                await fetchPortfolioData();
              }}
              className="px-4 py-2 rounded bg-terminal-green/20 text-terminal-green border border-terminal-green/40 hover:bg-terminal-green/30"
            >Add</button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {(experience || []).map((e) => (
              <div key={e.id} className="flex items-center justify-between bg-terminal-header/40 border border-white/10 rounded px-3 py-2">
                <div className="text-sm text-terminal-text truncate pr-3">{e.title} — {e.company}</div>
              </div>
            ))}
          </div>
        </GlassContainer>
      )}
    </div>
  );
};

export default AdminPanel;


