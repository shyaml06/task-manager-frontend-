import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// --- NEW CALENDAR IMPORTS ---
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "../styles/viewprojectTasks.css";

const API = "http://localhost:8000";

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

// ==========================================
// Helper: Format DB Tasks for Kanban Board
// ==========================================
const formatTasksForBoard = (tasksArray) => {
  const board = {
    pending: { name: "To Do", items: [] },
    in_progress: { name: "In Progress", items: [] },
    completed: { name: "Done", items: [] },
  };

  tasksArray.forEach((task) => {
    const formattedTask = { ...task, id: String(task.id) };
    const status = task.status || "pending";

    if (board[status]) {
      board[status].items.push(formattedTask);
    } else {
      board.pending.items.push(formattedTask);
    }
  });

  return board;
};

export default function ViewProjectTasks() {
  const { project_id } = useParams();
  const navigate = useNavigate();

  // States
  const [columns, setColumns] = useState({});
  const [rawTasks, setRawTasks] = useState([]);
  const [viewMode, setViewMode] = useState("board");
  const [users, setUsers] = useState([]); // NEW: State to hold assignable users

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", due_date: "" });

  // ==========================
  // Handle Task Assignment
  // ==========================
  const handleAssignTask = async (taskId, userId) => {
    try {
      await axios.patch(
        `${API}/projects/task/${taskId}/assign/`,
        { assigned_to: userId ? Number(userId) : null },
        { withCredentials: true }
      );

      // Refresh the board to show the updated data
      fetchTasks();
    } catch (err) {
      console.error("Failed to assign task", err);
      setError("Failed to assign task. Please try again.");
    }
  };

  // ==========================
  // Fetch Assignable Users
  // ==========================
  const fetchUsers = async () => {
    try {
      // Adjust this URL if your endpoint is different!
      const res = await axios.get(`${API}/projects/users/assignable/`, { withCredentials: true });
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  // ==========================
  // Fetch Tasks
  // ==========================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/projects/${project_id}/tasks/`, {
        withCredentials: true,
      });

      const data = res.data.data || res.data;

      setRawTasks(data);
      setColumns(formatTasksForBoard(data));

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers(); // Fetch users when the component mounts
  }, [project_id]);

  // ==========================
  // Handle Drag & Drop (Board)
  // // ==========================
  // const onDragEnd = async (result) => {
  //   const { source, destination } = result;

  //   if (!destination) return;

  //   const sourceColId = source.droppableId;
  //   const destColId = destination.droppableId;

  //   const sourceCol = columns[sourceColId];
  //   const destCol = columns[destColId];

  //   const sourceItems = [...sourceCol.items];
  //   const destItems = [...destCol.items];

  //   if (sourceColId === destColId) {
  //     const [removed] = sourceItems.splice(source.index, 1);
  //     sourceItems.splice(destination.index, 0, removed);
  //     setColumns({ ...columns, [sourceColId]: { ...sourceCol, items: sourceItems } });
  //     return;
  //   }

  //   // "removed" is your entire task object! 
  //   // It contains removed.id, removed.title, removed.assigned_to, etc.
  //   const [removed] = sourceItems.splice(source.index, 1);
  //   destItems.splice(destination.index, 0, removed);

  //   setColumns({
  //     ...columns,
  //     [sourceColId]: { ...sourceCol, items: sourceItems },
  //     [destColId]: { ...destCol, items: destItems },
  //   });

  //   try {
  //     await axios.put(
  //       `${API}/projects/task/${removed.id}/update/`,
  //       {
  //         status: destColId,
  //         assigned_to: removed.assigned_to // <--- Pass it to your backend right here
  //       },
  //       { withCredentials: true }
  //     );
  //     fetchTasks();
  //   } catch (err) {
  //     setError("Failed to save task movement. Please refresh.");
  //   }
  // };
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];

    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    if (sourceColId === destColId) {
      const [removed] = sourceItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, removed);
      setColumns({ ...columns, [sourceColId]: { ...sourceCol, items: sourceItems } });
      return;
    }

    // "removed" is your entire task object! 
    // It contains removed.id, removed.title, removed.assigned_to, etc.
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [sourceColId]: { ...sourceCol, items: sourceItems },
      [destColId]: { ...destCol, items: destItems },
    });

    try {
      const res = await axios.put(
        `${API}/projects/task/${removed.id}/update/`,
        {
          status: destColId,
          assigned_to: removed.assigned_to // <--- Pass it to your backend right here
        },
        { withCredentials: true }
      );
      console.log(res);

      if (res.data.success === false) {
        alert("You are not authorized to perform this action");
      }
      fetchTasks();
    } catch (err) {
      if (err.status === 403) {
        alert("You are not authorized to perform this action");
      }
      else if (err.status === 400) {
        alert("You are not authorized to perform this action");
      }
      else {
        alert("Something went wrong");
      }

      setError("Failed to save task movement. Please refresh.");
    }
  };
  // ==========================
  // Add Task Form Handlers
  // ==========================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.post(
        `${API}/projects/task/add/`,
        { project_id: Number(project_id), ...form },
        { withCredentials: true }
      );
      setForm({ title: "", description: "", due_date: "" });
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // Format Data for Calendar
  // ==========================
  const calendarEvents = rawTasks
    .filter(task => task.due_date)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
      resource: task
    }));
    

  // ==========================
  // Render
  // ==========================
  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <div className="tasks-container">
      <h2>📋 Project Tasks</h2>
      <button onClick={() => navigate("/projects")} className="back-btn">⬅ Back</button>

      {error && <p className="error-message">{error}</p>}

      <div className="tasks-card">
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <input type="text" name="title" placeholder="Task Title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input type="date" name="due_date" value={form.due_date} onChange={handleChange} />
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* ======================
          View Toggles
      ====================== */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => setViewMode("board")}
          style={{ padding: "8px 16px", cursor: "pointer", fontWeight: "bold", background: viewMode === "board" ? "#007bff" : "#e2e8f0", color: viewMode === "board" ? "white" : "black", border: "none", borderRadius: "4px" }}
        >
          Board View
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          style={{ padding: "8px 16px", cursor: "pointer", fontWeight: "bold", background: viewMode === "calendar" ? "#007bff" : "#e2e8f0", color: viewMode === "calendar" ? "white" : "black", border: "none", borderRadius: "4px" }}
        >
          Calendar View
        </button>
      </div>

      {/* ======================
          Dynamic Rendering
      ====================== */}
      {viewMode === "board" ? (

        // KANBAN BOARD
        <div className="tasks-card" style={{ overflowX: "auto" }}>
          {Object.keys(columns).length > 0 && (
            <div style={{ display: "flex", gap: "20px", padding: "10px 0" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(columns).map(([columnId, column]) => (
                  <div key={columnId} style={{ display: "flex", flexDirection: "column", minWidth: "250px", flex: 1 }}>
                    <h4 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
                      {column.name} ({column.items.length})
                    </h4>
                    <Droppable droppableId={columnId}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver ? "#e2e8f0" : "#f4f6f9",
                            padding: "10px",
                            minHeight: "400px",
                            borderRadius: "6px",
                            border: "1px solid #ddd"
                          }}
                        >
                          {column.items.map((item, index) => (
                            <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    padding: "12px",
                                    margin: "0 0 10px 0",
                                    backgroundColor: snapshot.isDragging ? "#eff6ff" : "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    boxShadow: snapshot.isDragging ? "0 4px 8px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <strong>{item.title}</strong>
                                  {item.description && <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>{item.description}</div>}
                                  {item.due_date && <div style={{ fontSize: "12px", color: "#d97706", marginTop: "8px", fontWeight: "bold" }}>📅 Due: {item.due_date}</div>}

                                  {/* --- ASSIGNMENT DROPDOWN --- */}
                                  <div style={{ marginTop: "10px", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                                    <label style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "3px" }}>
                                      Assignee:{ }
                                    </label>
                                    <select
                                      value={item.assigned_to || ""}
                                      onChange={(e) => handleAssignTask(item.id, e.target.value)}
                                      style={{
                                        width: "100%",
                                        padding: "4px",
                                        fontSize: "12px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        cursor: "pointer"
                                      }}
                                    >
                                      <option value="">{item.assigned_to}</option>
                                      {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                          {user.username}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </DragDropContext>
            </div>
          )}
        </div>

      ) : (

        // CALENDAR VIEW
        <div className="tasks-card" style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={['month', 'agenda']}
            defaultView="month"
          />
        </div>

      )}

    </div>
  );
}
