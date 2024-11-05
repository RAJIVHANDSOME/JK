// KanbanContext.js
import React, { createContext, useContext, useState } from 'react';

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [viewOption, setViewOption] = useState(localStorage.getItem('viewOption') || 'status');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority');

  const updateViewOption = (newView) => {
    setViewOption(newView);
    localStorage.setItem('viewOption', newView);
  };

  const updateSortOption = (newSort) => {
    setSortOption(newSort);
    localStorage.setItem('sortOption', newSort);
  };

  return (
    <KanbanContext.Provider value={{ viewOption, sortOption, updateViewOption, updateSortOption }}>
      {children}
    </KanbanContext.Provider>
  );
};

// Custom hook for accessing Kanban context
export const useKanbanContext = () => useContext(KanbanContext);
