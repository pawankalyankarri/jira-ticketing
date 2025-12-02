// import React, { useEffect, useRef } from "react";
// import { Gantt } from "wx-react-gantt";
// import "@svar-ui/react-gantt/all.css";
// // import { Willow, Gantt } from "@svar-ui/react-gantt";

// const dayStyle = () => {
//   return {};
// };

// const tasks = [
//   {
//     id: 1,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 17),
//     text: "Project planning",
//     progress: 30,
//     parent: 0,
//     type: "summary",
//     open: true,
//     details: "Outline the project's scope and resources.",
//   },
//   {
//     id: 10,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 5),
//     text: "Marketing analysis",
//     progress: 100,
//     parent: 1,
//     type: "task",
//     details: "Analyze market trends and competitors.",
//   },
//   {
//     id: 11,
//     start: new Date(2024, 3, 5),
//     end: new Date(2024, 3, 7),
//     text: "Discussions",
//     progress: 100,
//     parent: 1,
//     type: "task",
//     details: "Team discussions on project strategies.",
//   },
//   {
//     id: 110,
//     start: new Date(2024, 3, 6),
//     end: new Date(2024, 3, 9),
//     text: "Initial design",
//     progress: 60,
//     parent: 11,
//     type: "task",
//     details: "Draft initial design concepts.",
//   },
//   {
//     id: 111,
//     start: new Date(2024, 3, 9),
//     text: "Presentation",
//     progress: 0,
//     parent: 11,
//     type: "milestone",
//     details: "Present initial designs to stakeholders.",
//   },
//   {
//     id: 112,
//     start: new Date(2024, 3, 7),
//     end: new Date(2024, 3, 12),
//     text: "Prototyping",
//     progress: 10,
//     parent: 11,
//     type: "task",
//   },
//   {
//     id: 113,
//     start: new Date(2024, 3, 8),
//     end: new Date(2024, 3, 17),
//     text: "User testing",
//     progress: 0,
//     parent: 11,
//     type: "task",
//   },

//   {
//     id: 12,
//     start: new Date(2024, 3, 8),
//     text: "Approval of strategy",
//     progress: 100,
//     parent: 1,
//     type: "milestone",
//   },

//   {
//     id: 2,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 12),
//     text: "Project management",
//     progress: 10,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 20,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 6),
//     text: "Resource planning",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 21,
//     start: new Date(2024, 3, 6),
//     end: new Date(2024, 3, 8),
//     text: "Getting approval",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 22,
//     start: new Date(2024, 3, 8),
//     end: new Date(2024, 3, 10),
//     text: "Team introduction",
//     progress: 0,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 23,
//     start: new Date(2024, 3, 10),
//     end: new Date(2024, 3, 12),
//     text: "Resource management",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },

//   {
//     id: 3,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 4, 15),
//     text: "Development",
//     progress: 30,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 30,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 3, 15),
//     text: "Prototyping",
//     progress: 3,
//     parent: 3,
//     type: "task",
//   },
//   {
//     id: 31,
//     start: new Date(2024, 3, 15),
//     end: new Date(2024, 3, 30),
//     text: "Basic functionality",
//     progress: 0,
//     parent: 3,
//     type: "task",
//   },
//   {
//     id: 32,
//     start: new Date(2024, 3, 30),
//     end: new Date(2024, 4, 15),
//     text: "Finalizing MVA",
//     progress: 0,
//     parent: 3,
//     type: "task",
//   },

//   {
//     id: 4,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 4, 25),
//     text: "Testing",
//     progress: 3,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 40,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 3, 15),
//     text: "Testing prototype",
//     progress: 3,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 41,
//     start: new Date(2024, 3, 15),
//     end: new Date(2024, 3, 30),
//     text: "Testing basic features",
//     progress: 0,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 42,
//     start: new Date(2024, 3, 30),
//     end: new Date(2024, 4, 15),
//     text: "Testing MVA",
//     progress: 0,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 43,
//     start: new Date(2024, 4, 15),
//     end: new Date(2024, 4, 25),
//     text: "Beta testing",
//     progress: 0,
//     parent: 4,
//     type: "task",
//     details: "Comprehensive testing of the beta version before the final release.",
//   },

//   {
//     id: 5,
//     start: new Date(2024, 4, 25),
//     text: "Release 1.0.0",
//     progress: 0,
//     parent: 0,
//     type: "milestone",
//     details: "Official release of version 1.0.0 to the public.",
//   },
// ];

// const links = [
//   { id: 1, source: 10, target: 11, type: "e2s" },
//   { id: 2, source: 11, target: 12, type: "e2s" },
//   { id: 3, source: 110, target: 111, type: "e2s" },
//   { id: 4, source: 20, target: 21, type: "e2s" },
//   { id: 5, source: 21, target: 22, type: "e2s" },
//   { id: 6, source: 22, target: 23, type: "e2s" },
//   { id: 7, source: 42, target: 5, type: "e2s" },
// ];

// const scales = [
//   { unit: "month", step: 1, format: "MMMM yyyy" },
//   { unit: "day", step: 1, format: "d", css: dayStyle },
// ];

// const GanttView = () => {
//    const ganttRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (ganttRef.current) {
//       // @ts-ignore: accessing internal methods
//       const ganttApi = ganttRef.current.gantt;

//       // Example: scroll to task id 10
//       ganttApi?.scrollToTask(10);

//       // Example: zoom in
//       ganttApi?.zoom("day");

//       // Example: subscribe to task click
//       ganttApi?.on("taskclick", (task: any) => {
//         console.log("Clicked task:", task);
//       });
//     }
//   }, []);

//   return (

//       <div ref={ganttRef}>
//         {/* <Gantt tasks={tasks} links={links}  /> */}
//         <Gantt

// 			tasks={tasks}
// 			links={links}
// 			scales={scales}
// 			// api={apiRef}
// 		/>
//       </div>

//   );
// };

// export default GanttView;

// {
//   id: 1,
//   start: new Date(2024, 3, 2),
//   end: new Date(2024, 3, 17),
//   text: "Project planning",
//   progress: 30,
//   parent: 0,
//   type: "summary",
//   open: true,
//   details: "Outline the project's scope and resources.",
// },

// import React, { useEffect, useState } from "react";
// import "@svar-ui/react-gantt/all.css";
// import { Willow, Gantt, WillowDark } from "@svar-ui/react-gantt";
// import {type TicketDetails } from "../ticketInterfaces/TicketInterfaces";
// import { UseTickets } from "../hooks/UseTickets";

// // Initial tasks
// const initialTasks = [
//   {
//     id: 1,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 17),
//     text: "Project planning",
//     progress: 30,
//     parent: 0,
//     type: "summary",
//     open: true,
//     details: "Outline the project's scope and resources.",
//   },
//   {
//     id: 10,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 5),
//     text: "Marketing analysis",
//     progress: 100,
//     parent: 1,
//     type: "task",
//     details: "Analyze market trends and competitors.",
//   },
//   {
//     id: 11,
//     start: new Date(2024, 3, 5),
//     end: new Date(2024, 3, 7),
//     text: "Discussions",
//     progress: 100,
//     parent: 1,
//     type: "task",
//     details: "Team discussions on project strategies.",
//   },
//   {
//     id: 110,
//     start: new Date(2024, 3, 6),
//     end: new Date(2024, 3, 9),
//     text: "Initial design",
//     progress: 60,
//     parent: 11,
//     type: "task",
//     details: "Draft initial design concepts.",
//   },
//   {
//     id: 111,
//     start: new Date(2024, 3, 9),
//     text: "Presentation",
//     progress: 0,
//     parent: 11,
//     type: "milestone",
//     details: "Present initial designs to stakeholders.",
//   },
//   {
//     id: 112,
//     start: new Date(2024, 3, 7),
//     end: new Date(2024, 3, 12),
//     text: "Prototyping",
//     progress: 10,
//     parent: 11,
//     type: "task",
//   },
//   {
//     id: 113,
//     start: new Date(2024, 3, 8),
//     end: new Date(2024, 3, 17),
//     text: "User testing",
//     progress: 0,
//     parent: 11,
//     type: "task",
//   },

//   {
//     id: 12,
//     start: new Date(2024, 3, 8),
//     text: "Approval of strategy",
//     progress: 100,
//     parent: 1,
//     type: "milestone",
//   },

//   {
//     id: 2,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 12),
//     text: "Project management",
//     progress: 10,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 20,
//     start: new Date(2024, 3, 2),
//     end: new Date(2024, 3, 6),
//     text: "Resource planning",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 21,
//     start: new Date(2024, 3, 6),
//     end: new Date(2024, 3, 8),
//     text: "Getting approval",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 22,
//     start: new Date(2024, 3, 8),
//     end: new Date(2024, 3, 10),
//     text: "Team introduction",
//     progress: 0,
//     parent: 2,
//     type: "task",
//   },
//   {
//     id: 23,
//     start: new Date(2024, 3, 10),
//     end: new Date(2024, 3, 12),
//     text: "Resource management",
//     progress: 10,
//     parent: 2,
//     type: "task",
//   },

//   {
//     id: 3,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 4, 15),
//     text: "Development",
//     progress: 30,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 30,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 3, 15),
//     text: "Prototyping",
//     progress: 3,
//     parent: 3,
//     type: "task",
//   },
//   {
//     id: 31,
//     start: new Date(2024, 3, 15),
//     end: new Date(2024, 3, 30),
//     text: "Basic functionality",
//     progress: 0,
//     parent: 3,
//     type: "task",
//   },
//   {
//     id: 32,
//     start: new Date(2024, 3, 30),
//     end: new Date(2024, 4, 15),
//     text: "Finalizing MVA",
//     progress: 0,
//     parent: 3,
//     type: "task",
//   },

//   {
//     id: 4,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 4, 25),
//     text: "Testing",
//     progress: 3,
//     parent: 0,
//     type: "summary",
//     open: true,
//   },
//   {
//     id: 40,
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 3, 15),
//     text: "Testing prototype",
//     progress: 3,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 41,
//     start: new Date(2024, 3, 15),
//     end: new Date(2024, 3, 30),
//     text: "Testing basic features",
//     progress: 0,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 42,
//     start: new Date(2024, 3, 30),
//     end: new Date(2024, 4, 15),
//     text: "Testing MVA",
//     progress: 0,
//     parent: 4,
//     type: "task",
//   },
//   {
//     id: 43,
//     start: new Date(2024, 4, 15),
//     end: new Date(2024, 4, 25),
//     text: "Beta testing",
//     progress: 0,
//     parent: 4,
//     type: "task",
//     details: "Comprehensive testing of the beta version before the final release.",
//   },

//   {
//     id: 5,
//     start: new Date(2024, 4, 25),
//     text: "Release 1.0.0",
//     progress: 0,
//     parent: 0,
//     type: "milestone",
//     details: "Official release of version 1.0.0 to the public.",
//   },
// ];

// const links = [
//   { id: 1, source: 10, target: 11, type: "e2s" },
//   { id: 2, source: 11, target: 12, type: "e2s" },
//   { id: 3, source: 110, target: 111, type: "e2s" },
//   { id: 4, source: 20, target: 21, type: "e2s" },
//   { id: 5, source: 21, target: 22, type: "e2s" },
//   { id: 6, source: 22, target: 23, type: "e2s" },
//   { id: 7, source: 42, target: 5, type: "e2s" },
// ];

// const scales = [
//   { unit: "month", step: 1, format: "MMMM yyyy" },
//   { unit: "day", step: 1, format: "d"},
// ];

// interface GanttTicket {
//   id: number,
//   text: string,
//   start: Date,
//   end?: Date,
//   progress?: number,
//   parent?: number,
//   type?: "task" | "summary" | "milestone",
//   open?: boolean,
//   details?: string
// }

// const GanttView = () => {
//   const [tasks, setTasks] = useState(initialTasks);
//   const [allTickets,setAllTickets] = useState<TicketDetails[]>([])
//   const [allGanttTickets,setAllGanttTickets] = useState<GanttTicket[]>([])

//   const {fetchAllTickets} = UseTickets()

// const mapTicketToTask = (ticket: TicketDetails) => {
//   // validate dates
//   // console.log('ticket',ticket)
//   const start = ticket.start_date ? new Date(ticket.start_date) : new Date();
//   const end = ticket.end_date ? new Date(ticket.end_date) : new Date();

//   // if (!start || isNaN(start.getTime()) || !end || isNaN(end.getTime())) {
//   //   console.warn("Invalid ticket dates, skipping:", ticket);
//   //   return null; // skip invalid tickets
//   // }

//   return {
//     id: ticket.id,
//     text: ticket.summary,
//     start,
//     end,
//     progress: 0,
//     parent: ticket.parent_ticket_id ? parseInt(ticket.parent_ticket_id) : 0,
//     type: "task",
//     details: ticket.description,
//   };
// };

// useEffect(() => {
//   const GetTickets = async () => {
//     const res = await fetchAllTickets();
//     const validTasks = res
//       .map(mapTicketToTask)
//       .filter((t:TicketDetails): t is NonNullable<typeof t> => t !== null);
//     setAllGanttTickets(validTasks);
//   };
//   GetTickets();
// }, []);

//   console.log('gantdata',allGanttTickets)
//   console.log('tasks',tasks)

//   // const handleAction = (ev: { action: string; data: any }) => {
//   //   console.log("Action triggered:", ev.action, ev.data);

//   //   if (ev.action === "add") {
//   //     // Create a new task as child of clicked task
//   //     const newTask = {
//   //       id: Date.now(), // unique ID
//   //       text: "New Task",
//   //       start: new Date(),
//   //       end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // +1 day
//   //       progress: 0,
//   //       parent: ev.data.id, // parent is the clicked task
//   //       type: "task",
//   //     };

//   //     setTasks((prev) => [...prev, newTask]); // update state to re-render
//   //   }
//   // };

// return (

//   <div className="w-full h-screen">
//     <div className="w-full h-full">
//       <WillowDark>
//         <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
//           <Gantt
//             tasks={allGanttTickets}
//             links={links}
//             scales={scales}
//           />
//         </div>
//       </WillowDark>
//     </div>
//   </div>

// );

// };

// export default GanttView;

import { useEffect, useState, useRef } from "react";
import "@svar-ui/react-gantt/all.css";
import {
  WillowDark,
  Gantt,
  type IApi,
  type ITask,
  Fullscreen,
} from "@svar-ui/react-gantt";
import { Form } from "./CutomForm";
import { type TicketDetails } from "../ticketInterfaces/TicketInterfaces";
import { UseTickets } from "../hooks/UseTickets";

interface GanttTicket {
  id: number;
  text: string;
  start: Date;
  end?: Date;
  progress?: number;
  parent?: number;
  type?: "task" | "summary" | "milestone";
  open?: boolean;
  details?: string;
}

const GanttView = () => {
  const [allGanttTickets, setAllGanttTickets] = useState<GanttTicket[]>([]);
  const [links, setLinks] = useState([
    { id: 1, source: 1, target: 2, type: "e2e" },
  ]);
  const scales = [
    {
      unit: "month",
      step: 1,
      format: "MMMM yyyy",
      start: new Date(), // today
      end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
    },
    {
      unit: "day",
      step: 1,
      format: "d",
    },
  ];

  const [task, setTask] = useState<ITask | null>(null);

  const apiRef = useRef<IApi | null>(null);
  const { fetchAllTickets, EditTicket, GetTicket, CreateTicket } = UseTickets();

  const mapTicketToTask = (ticket: TicketDetails) => {
    const start = ticket.start_date ? new Date(ticket.start_date) : new Date();
    const end = ticket.end_date ? new Date(ticket.end_date) : new Date();
    return {
      id: ticket.id,
      text: ticket.summary,
      start,
      end,
      progress: 0,
      parent: ticket.parent_ticket_id ? parseInt(ticket.parent_ticket_id) : 0,
      type: "task",
      details: ticket.description,
    };
  };

  const GetTickets = async () => {
    const res = await fetchAllTickets();
    const validTasks = res.map(mapTicketToTask);
    setAllGanttTickets(validTasks);
  };

  useEffect(() => {
    GetTickets();
  }, []);

  const taskTypes = [
    { id: "task", label: "Task" },
    { id: "milestone", label: "Milestone" },
    { id: "summary", label: "Project" },
  ];


  const formAction = async (ev: {
    action: "update-task" | "delete-task" | "close-form" | "add-task";
    data: ITask | null;
  }) => {
    // console.log("ev", ev);

    const { action, data } = ev;

    if (!data) {
      setTask(null);
      return;
    }

    switch (action) {
      case "update-task": {
        try {
          const res = await GetTicket(data.id);

          const updatedTicket = {
            ...res,
            summary: data.text ?? res.summary,
            start_date: data.start,
            end_date: data.end,
            description: data.details,
            parent_ticket_id: String(data.parent ?? 0),
            update_id: String(data.id),
          };

          await EditTicket(updatedTicket, [], data.id);

          apiRef.current?.exec("update-task", { id: data.id, task: data });
          await GetTickets();
          setTask(null);
          console.log("Updated:", data);
          break;
        } catch (error) {
          console.error("Update error:", error);
        }

        break;
      }

//       case "update-task": {
//   if ((data as any).isNew) {
//     // CREATE NEW TICKET IN BACKEND
//     const newTicket = {
//       project_id: "",
//       board_id: "",
//       workflow_id: "",
//       status_id: "",
//       ticket_status: "Open",
//       ticket_state: "ToDo", // Kanban state
//       ticket_severity: "Medium",
//       summary: data.text || "New Task",
//       description: data.details || "",
//       file_attachment: [],
//       comment: "",
//       start_date: data.start ?? new Date(),
//       end_date: data.end ?? new Date(Date.now() + 24*60*60*1000),
//       assignee_id: "",
//       reporter_id: "",
//       parent_ticket_id: String(data.parent ?? 0),
//     };

//     const res = await CreateTicket({ data: newTicket, files: [] });

//     if (!res?.data?.id) {
//       console.error("CreateTicket failed", res);
//       return;
//     }

//     // Replace temp task with backend ID
//     const createdTask: ITask = {
//       ...data,
//       id: res.data.id,
//     };

//     apiRef.current?.exec("add-task", { task: createdTask });
//     setAllGanttTickets((prev:any) => [...prev, createdTask]);
//     setTask(null);
//     console.log("Ticket created:", createdTask);
//     return;
//   }

//   // Otherwise, normal update logic
//   try {
//     const res = await GetTicket(data.id);
//     const updatedTicket = {
//       ...res,
//       summary: data.text ?? res.summary,
//       start_date: data.start,
//       end_date: data.end,
//       description: data.details,
//       parent_ticket_id: String(data.parent ?? 0),
//       update_id: String(data.id),
//     };

//     await EditTicket(updatedTicket, [], data.id);
//     apiRef.current?.exec("update-task", { id: data.id, task: data });
//     await GetTickets();
//     setTask(null);
//     console.log("Updated:", data);
//   } catch (error) {
//     console.error("Update error:", error);
//   }

//   break;
// }


      case "delete-task": {
        try {
          // await DeleteTicket(data.id); // call your API
          apiRef.current?.exec("delete-task", { id: data.id });
        } catch (e) {
          console.error("Delete failed:", e);
        }
        break;
      }

      case "close-form":
        setTask(null);
        break;

      // case "add-task": {
      //   try {
      //     // 1️⃣ CREATE NEW TICKET PAYLOAD
      //     const newTicket = {
      //       project_id: "",
      //       board_id: "",
      //       workflow_id: "",
      //       status_id: "",
      //       ticket_status: "Open",
      //       ticket_state: "ToDo", // from your kanban state
      //       ticket_severity: "Medium",
      //       summary: data.text || "New Task",
      //       description: "",
      //       file_attachment: [],
      //       comment: "",
      //       start_date: data.start || new Date(),
      //       end_date: data.end || new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
      //       assignee_id: "",
      //       reporter_id: "",
      //       parent_ticket_id: String(data.parent ?? "0"),
      //     };

      //     // 2️⃣ SEND TO BACKEND
      //     const res = await CreateTicket({ data: newTicket, files: [] });
      //     console.log("ticket created", res);

      //     if (!res || !res.data.id) {
      //       console.error("CreateTicket response", res);
      //       return;
      //     }
      //     // Backend returns the created ticket with ID:
      //     const createdId = res.data.id;

      //     // 3️⃣ CREATE THE TASK FOR GANTT USING BACKEND ID
      //     const createdTask: ITask = {
      //       id: createdId,
      //       text: newTicket.summary,
      //       start: new Date(newTicket.start_date),
      //       end: new Date(newTicket.end_date),
      //       progress: 0,
      //       parent: data.parent || 0,
      //       type: "task",
      //       details: newTicket.description,
      //     };

      //     // 4️⃣ ADD TASK TO GANTT
      //     apiRef.current?.exec("add-task", { task: createdTask });

      //     // 5️⃣ OPTIONAL: update your state list
      //     setAllGanttTickets((prev: any) => [...prev, createdTask]);

      //   } catch (err) {
      //     console.error("Error creating ticket", err);
      //   }

      //   break;
      // }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col flex-1 min-h-0">
        <WillowDark>
          <div className="flex-1 w-full min-h-0">
            <Fullscreen>
              <Gantt
                tasks={allGanttTickets}
                links={links}
                scales={scales}
                readonly={false}
                init={(api: IApi) => {
                  apiRef.current = api;

                  api.intercept("show-editor", (data: { id?: number }) => {
                    if (data.id) {
                      // Editing an existing task
                      console.log("dataid", data.id);
                      const task = api.getTask(data.id);
                      if (task) setTask(task);
                    } else {
                      // Plus icon clicked  create new task
                      console.log("data");
                      const newTask: ITask = {
                        
                        text: "",
                        start: new Date(),
                        end: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        progress: 0,
                        parent: 0,
                        type: "task",
                      };
                      setTask(newTask); // open custom form
                      console.log("new task added");
                    }

                    return false; // prevent default editor
                  });
                }}
                onRowDoubleClick={(taskId: number) => {
                  const clickedTask = apiRef.current?.getTask(taskId);
                  if (clickedTask) setTask(clickedTask);
                }}
                onBarDoubleClick={(taskId: number) => {
                  const clickedTask = apiRef.current?.getTask(taskId);
                  if (clickedTask) setTask(clickedTask);
                }}
              />
            </Fullscreen>
          </div>
        </WillowDark>
      </div>
      {task && <Form task={task} taskTypes={taskTypes} onAction={formAction} />}
    </div>
  );
};

export default GanttView;
