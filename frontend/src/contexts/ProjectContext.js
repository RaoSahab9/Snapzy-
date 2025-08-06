import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addProject = (project) => {
    setProjects(prev => [project, ...prev]);
    setCurrentProject(project);
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => 
      prev.map(p => 
        p.projectId === projectId 
          ? { ...p, ...updates }
          : p
      )
    );
    
    if (currentProject?.projectId === projectId) {
      setCurrentProject(prev => ({ ...prev, ...updates }));
    }
  };

  const getProject = (projectId) => {
    return projects.find(p => p.projectId === projectId);
  };

  const clearCurrentProject = () => {
    setCurrentProject(null);
  };

  const value = {
    currentProject,
    projects,
    isGenerating,
    setIsGenerating,
    addProject,
    updateProject,
    getProject,
    clearCurrentProject,
    setCurrentProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};