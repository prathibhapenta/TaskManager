import React from 'react'
import {NavLink} from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import "./Sidebar.css"
const Sidebar = () => {

  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <div className='sidebar-bg'>
      <h1>Sidebar</h1>
      <div className='sidebar-items'>
        <NavLink to = "/dashboard">Dashboard
        </NavLink>
        <NavLink to = "/all-tasks">All Tasks</NavLink>
        <NavLink to = "/completed-task">Completed Task</NavLink>
        <NavLink to = "/pending-task">Pending Task</NavLink>
        <NavLink to = "/in-progress-task">InProgress Task</NavLink>
        <NavLink to = "/add-new-task">Add New Task</NavLink>
        <NavLink to = "/task-status">Task Status</NavLink>
            
            <button onClick={handleLogout}> Logout </button>
      </div>
    </div>
  )
}

export default Sidebar
