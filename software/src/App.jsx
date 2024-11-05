import React from 'react';
import KanbanBoard from './Comp1/KanbanBoard';
import { KanbanProvider } from './Comp1/KanbanContext';
import Navbar from './Comp1/Navbar'
const App = () => {
  return (
    <div style={{backgroundColor:"rgba(245, 245, 241, 0.495)"}}>
      <KanbanProvider>
        <Navbar />
        <KanbanBoard />
      </KanbanProvider>
    </div>
  );
};

export default App;