import React, { useState, useEffect } from 'react'
import { apiRequest } from '../services/api'

const Dashboard = () => {

  const [todos, setTodos] = useState([])
  

  const loadDashboard = async () => {
    try {
      const response = await apiRequest("/get-todos")

      console.log(response)

      setTodos(response.todo || [])

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
  <div>
    <h1>Dashboard</h1>

    <h3>Total Tasks: {todos.length}</h3>

    {todos.map((todo) => (
      <div key={todo.id}>
        <h3>{todo.title}</h3>
        <h3>{todo.description}</h3>
      </div>
    ))}
  </div>
);
}

export default Dashboard