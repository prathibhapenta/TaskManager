import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './Layout/Layout'
import Sidebar from './components/Sidebar'
import CompletedTask from './pages/CompletedTask'
import PendingTask from './pages/PendingTask'
import InProgressTask from './pages/InProgressTask'
import AddNewTask from './pages/AddNewTask'
import TaskStatus from './pages/TaskStatus'
import "./App.css"
import AllTasks from './pages/AllTasks'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Login/>}/>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/register" element = {<Register/>}/>
      <Route path = "/dashboard" element = {
        <Layout>
          <Dashboard/>
        </Layout>
      }/>
      <Route path = "/sidebar" element={
        <Layout>
          <Sidebar/>
        </Layout>
      }/>
      <Route path = "/all-tasks" element={
        <Layout>
          <AllTasks/>
        </Layout>
      }/>
      <Route path = "/completed-task" element={
        <Layout>
          <CompletedTask/>
        </Layout>
      }/>
      <Route path = "/pending-task" element={
        <Layout>
          <PendingTask/>
        </Layout>
      }/>
      <Route path = "/in-progress-task" element={
        <Layout>
          <InProgressTask/>
        </Layout>
      }/>
      <Route path = "/add-new-task" element={
        <Layout>
          <AddNewTask/>
        </Layout>
      }/>
      <Route path = "/task-status" element={
        <Layout>
          <TaskStatus/>
        </Layout>
      }/>

    </Routes>
    </BrowserRouter>
  )
}

export default App
