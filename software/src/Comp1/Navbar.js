


import React, { useState,useRef ,useEffect} from 'react';
import { useKanbanContext } from './KanbanContext';

import doneIcon from '../icons_FEtask/Done.svg';
import display from '../icons_FEtask/Display.svg';

import downIcon from '../icons_FEtask/down.svg';
import './navbar.css';
const Navbar = () => {
    const { viewOption, sortOption, updateViewOption, updateSortOption } = useKanbanContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <nav className="navbar">
            <div ref={dropdownRef} className="dropdown">
                <label className='dropbut' onClick={toggleDropdown}>
                <img src={display}></img>
                Display
                <img src={downIcon}></img>
                </label>
                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <div className='dropone'>
                            <label style={{ flex: 1 }} >Group By:</label>
                            <select value={viewOption} onChange={(e) => updateViewOption(e.target.value)} className='group dropbut'>
                                <option value="status">Status</option>
                                <option value="user">User</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                        <div className='dropone'>
                            <label style={{ flex: 1 }}>Sort By:</label>
                            <select value={sortOption} onChange={(e) => updateSortOption(e.target.value)} className='group dropbut'>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
