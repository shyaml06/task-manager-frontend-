import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 1. Initial Mock Data mapped into columns
const initialData = {
  todo: {
    name: "To Do",
    items: [
      { id: "1", content: "Design database schema" },
      { id: "2", content: "Create login page" },
    ],
  },
  inProgress: {
    name: "In Progress",
    items: [
      { id: "3", content: "Build Kanban Board" },
    ],
  },
  done: {
    name: "Done",
    items: [
      { id: "4", content: "Set up React Router" },
    ],
  },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  // 2. The Drag End Logic (What happens when you drop an item)
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside a valid column, do nothing
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    // Case A: Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const [removed] = sourceItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
      });
      return;
    }

    // Case B: Moving to a different column
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems },
    });

    // TODO: Send Axios PUT request here to update the task's status in the database!
    // Example: updateTaskStatus(removed.id, destination.droppableId);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%", gap: "20px", padding: "20px" }}>
      {/* 3. The DragDropContext wraps the entire board */}
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div key={columnId} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2>{column.name}</h2>
              
              {/* 4. Droppable Area (The Column) */}
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver ? "#e2e8f0" : "#f8fafc",
                      padding: "10px",
                      width: "250px",
                      minHeight: "400px",
                      borderRadius: "8px",
                      boxShadow: "0 0 5px rgba(0,0,0,0.1)"
                    }}
                  >
                   {column.items.map((item, index) => (
  <Draggable key={item.id} draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: "none",
          padding: "16px",
          margin: "0 0 8px 0",
          minHeight: "50px",
          backgroundColor: snapshot.isDragging ? "#eff6ff" : "white",
          color: "#333",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          ...provided.draggableProps.style,
        }}
      >
        {item.content}
      </div>
    )}
  </Draggable>
))}
                    {/* Placeholder prevents the column from collapsing when empty */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}