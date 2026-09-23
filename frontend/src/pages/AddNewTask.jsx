
import React, { useState } from "react";
import { apiRequest } from "../services/api";

const AddNewTask = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState("MEDIUM");

  const addNewTask = async (e) => {
    e.preventDefault();

    try {

      const response = await apiRequest("/insert-todo", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          status,
          priority
        })
      });

      console.log(response);

      if (response.success) {
        alert("Task added successfully");

        // Clear form
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setPriority("MEDIUM");
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      <h1>Add New Task</h1>

      <form onSubmit={addNewTask}>

        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            placeholder="Enter task title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <button type="submit">
          Add Task
        </button>

      </form>

    </div>
  );
};

export default AddNewTask;

