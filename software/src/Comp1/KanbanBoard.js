// KanbanBoard.js
import React, { useEffect, useState, useMemo } from 'react';
import { useKanbanContext } from './KanbanContext';
import addIcon from '../icons_FEtask/add.svg';
import bIcon from '../icons_FEtask/Backlog.svg';
import cIcon from '../icons_FEtask/Cancelled.svg';
import dotIcon from '../icons_FEtask/3 dot menu.svg';
import doneIcon from '../icons_FEtask/Done.svg';
import display from '../icons_FEtask/Display.svg';
import hpIcon from '../icons_FEtask/Img - High Priority.svg';
import downIcon from '../icons_FEtask/down.svg';
import lpIcon from '../icons_FEtask/Img - Low Priority.svg';
import mpIcon from '../icons_FEtask/Img - Medium Priority.svg';
import inpIcon from '../icons_FEtask/in-progress.svg';
import nopIcon from '../icons_FEtask/No-priority.svg';
import urpIcon from '../icons_FEtask/SVG - Urgent Priority colour.svg';
import urgIcon from '../icons_FEtask/SVG - Urgent Priority grey.svg';
import todoIcon from '../icons_FEtask/To-do.svg';
import Navbar from './Navbar';
import './KanbanBoard.css';
const KanbanBoard = () => {
  const [tickets, setTickets] = useState(() => JSON.parse(localStorage.getItem('tickets')) || []);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || []);

  const { viewOption, sortOption } = useKanbanContext();
  const statusGroups = ['Todo', 'In progress', 'Backlog', 'Done', 'Cancelled'];
  const priorityGroups = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];
  const statusIcons = {
    "Todo": todoIcon,
    "In progress": inpIcon,
    "Backlog": bIcon,
    "Done": doneIcon,
    "Cancelled": cIcon
  };

  const priorityIcons = {
    "No priority": nopIcon,      
    "Low": lpIcon,       
    "Medium": mpIcon,       
    "High": hpIcon,       
    "Urgent": urpIcon       
  };
  const priorityIcons1 = {
    1: nopIcon,      
    2: lpIcon,      
    3: mpIcon,       
    4: hpIcon,       
    5: urpIcon     
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
        localStorage.setItem('tickets', JSON.stringify(data.tickets));
        localStorage.setItem('users', JSON.stringify(data.users));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    // Fetch data only if not available in localStorage
    if (!tickets.length || !users.length) fetchData();
  }, []); // Only run on mount

  const sortedTickets = useMemo(() => {
    let sorted = [...tickets];
    if (sortOption === 'priority') {
      sorted.sort((a, b) => b.priority - a.priority);
    } else if (sortOption === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [tickets, sortOption]);

  
  const groupedTickets = useMemo(() => {
    const grouped = {};

    if (viewOption === 'status') {
      // Initialize groups with zero count
      statusGroups.forEach(status => {
        grouped[status] = [];
      });

      // Populate groups with tickets
      sortedTickets.forEach(ticket => {
        const key = ticket.status;
        if (!grouped[key]) grouped[key] = [];
        grouped[ticket.status].push(ticket);
      });
    }
   
    else if (viewOption === 'user') {
      const userGroups = {};

      // Initialize groups with zero count
      users.forEach(user => {
        userGroups[user.name] = [];
      });

      // Populate groups with tickets
      sortedTickets.forEach(ticket => {
        const userName = users.find(u => u.id === ticket.userId)?.name || 'Unknown';
        userGroups[userName].push(ticket);
      });

      // Assign user groups to grouped object
      Object.keys(userGroups).forEach(user => {
        grouped[user] = userGroups[user];
      });
    }
    else if (viewOption === 'priority') {
      // Initialize groups with zero count
      priorityGroups.forEach(priority => {
        grouped[priority] = [];
      });

      // Populate groups with tickets
      sortedTickets.forEach(ticket => {
        // const priorityLabel = priorityGroups[ticket.priority] || 'No priority';
        const priorityLabel = ['No priority', 'Low', 'Medium', 'High', 'Urgent'][ticket.priority];
        if (!grouped[priorityLabel]) grouped[priorityLabel] = [];
        grouped[priorityLabel].push(ticket);
      });
    }
    return grouped;
  }, [sortedTickets, viewOption, users]);

  
  
  const Avatar = ({ name }) => {
    const getInitials = (name) => {
      const words = name.split(" ");
      return words.length === 1 ? words[0][0].toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
    };
    
    return (
      <div className="avatar">
        {getInitials(name)}
      </div>
    );
  };
  return (
    <div>
      {/* <Navbar /> */}
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group, index) => (
          <div key={index} className="kanban-column">
            <p style={{ display: "flex" }}>

              <h4 style={{ flex: "1", alignItems: "center", margin: 0, padding: "5px 0", marginBottom: "0px" }}>
                <img src={(viewOption == "status") ? statusIcons[group] : priorityIcons[group]} style={{ flex: "1", marginBottom: "0px", }}></img>
                {group} {groupedTickets[group].length}
              </h4>
              <img src={addIcon} alt="Add Icon" />
              <img src={dotIcon} alt="dotIcon" />
            </p>
            {groupedTickets[group].length > 0 ? (
              groupedTickets[group].map(ticket => (
                <div key={ticket.id} className="kanban-card">
                  <div style={{ display: "flex", alignItems: "center", margin: 0, padding: "5px 0", marginBottom: "0px" }}>
                    <h5 style={{ color: "rgb(113,113,113)", flex: "1", margin: 0 }}>{ticket.id}</h5>
                    <Avatar name={users.find(user => user.id === ticket.userId)?.name} className="avatar-top-right" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", margin: 0, marginBottom: "0px" }}>
                    {!(viewOption == "status") && (<img src={statusIcons[ticket.status]} alt={`${ticket.status} icon`} style={{ marginTop: "0px" }} />)}
                    <h5 style={{ marginTop: "0px" }}>{ticket.title}</h5>
                  </div>
                  <div style={{ display: "flex" , alignItems: "center"}}>
                    {!(viewOption == "priority") && (<img src={priorityIcons1[ticket.priority]} alt={`${ticket.status} icon`} style={{ marginTop: "0px",border: "1px solid rgb(113,113,113)", width: "fit-content", padding: "5px", borderRadius: "5px",marginRight:"2px" }} />)}
                    <div>
                      <p style={{ display: "flex", border: "1px solid rgb(113,113,113)", width: "fit-content", padding: "2px", borderRadius: "5px", color: "rgb(113,113,113)" }}>
                        <i className="icon-park-outline--dot" style={{ flex: "1", margin: 0 }}></i>
                        {ticket.tag[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-column"></div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default KanbanBoard;
