import React from "react";
import { Gantt, Task, EventOption } from "svar-gantt";
import "svar-gantt/dist/style.css";

const GanttView: React.FC = () => {
  // Example tasks
  const tasks: Task[] = [
    {
      id: "1",
      name: "Design",
      start: new Date("2025-01-01"),
      end: new Date("2025-01-05"),
      progress: 40,
      type: "task",
    },
    {
      id: "2",
      name: "Development",
      start: new Date("2025-01-06"),
      end: new Date("2025-01-14"),
      progress: 20,
      type: "task",
    },
    {
      id: "3",
      name: "Testing",
      start: new Date("2025-01-15"),
      end: new Date("2025-01-20"),
      progress: 0,
      type: "task",
    }
  ];

  // Handle task events
  const handleEvent: EventOption = {
    onClick: (task) => {
      console.log("Task clicked:", task);
    },
    onDateChange: (task, start, end) => {
      console.log("Date changed:", { task, start, end });
    },
    onProgressChange: (task, progress) => {
      console.log("Progress changed:", { task, progress });
    }
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Gantt
        tasks={tasks}
        eventOptions={handleEvent}
        viewMode="day"             // day | week | month
        locale="en"
      />
    </div>
  );
};

export default GanttView;
