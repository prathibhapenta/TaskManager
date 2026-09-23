import React, {useState, useEffect } from 'react'
import { apiRequest } from '../services/api'

const AllTasks = () => {
  const [task, setTask] = useState([])

 const displayAllTasks = async() => {
     try{
      const response= await apiRequest("/get-todos")
      console.log(response)
      setTask(response.todo || [])

    }catch(err){
      console.log(err)
    }

 }
    useEffect(() => {
     displayAllTasks()
    },[])

  return (
    <div>
      <h1>All Tasks: {task.length}</h1>

      {task.map((todo) => (
        <div key = {todo.id}>
          <h2>{todo.title}</h2>
          <h2>{todo.description}</h2>
          <h2>{todo.status}</h2>
        </div>
      ))}
    </div>
  )
}

export default AllTasks
