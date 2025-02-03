"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Fetch tasks from the API when the page loads
  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks");
      
      // Handle errors if API call fails
      if (!response.ok) {
        console.error("Failed to fetch tasks");
        return;
      }
      
      const data = await response.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  // Handle form submission to create a new task
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate new task data
    if (!newTask.title || !newTask.dueDate) {
      alert("Title and due date are required!");
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const newTaskData = await response.json();
    
    // Check for errors in response
    if (!newTaskData._id) {
      console.error("Failed to create task");
      return;
    }

    setTasks([...tasks, newTaskData]); // Add the new task to the list
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
    });
  };

  // Handle deleting a task
  const handleDelete = async (id) => {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    // Check if the deletion was successful
    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id)); // Remove task from UI
    } else {
      console.error("Failed to delete task");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="datetime-local"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <div className="tasks">
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
