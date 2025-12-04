import {
  useEffect,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import "@svar-ui/react-gantt/all.css";
import {
  WillowDark,
  Gantt,
  type IApi,
  type ITask,
  Fullscreen,
  Willow,
} from "@svar-ui/react-gantt";
import { Form } from "./CutomForm";
import { type TicketDetails } from "../ticketInterfaces/TicketInterfaces";
import { UseTickets, type TicketType } from "../hooks/UseTickets";
import type { TicketUpdateFormDataType } from "../updateTicket/UpdateTicket";
import { toast } from "sonner";
import { motion } from "motion/react";

interface GanttTicket {
  id: number;
  text: string;
  start: Date;
  end?: Date;
  progress?: number;
  parent?: number;
  type?: "task" | "summary" | "milestone" | string;
  open?: boolean;
  details?: string;
}

interface LinksType {
  id: number;
  source: number;
  target: number;
  type: string;
}
interface GanttViewPropsType {
  allTickets: TicketDetails[];
  setAllTickets: Dispatch<SetStateAction<TicketDetails[]>>;
}

const GanttView = ({ allTickets, setAllTickets }: GanttViewPropsType) => {
  const [allGanttTickets, setAllGanttTickets] = useState<GanttTicket[]>([]);
  const [links, setLinks] = useState<LinksType[]>([]);
  const scales = [
    {
      unit: "month",
      step: 1,
      format: "MMMM yyyy",
      start: new Date(),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      unit: "day",
      step: 1,
      format: "d",
    },
  ];

  const [task, setTask] = useState<ITask | null>(null);

  const apiRef = useRef<IApi | null>(null);
  const { EditTicket, GetTicket, CreateTicket, fetchAllTickets } = UseTickets();

  const StateData = [
    "All States",
    "ToDo",
    "In Progress",
    "On Hold",
    "Re Open",
    "Resolved",
    "Cancelled",
  ];

  const mapTicketsToTasks = (tickets: TicketDetails[]): GanttTicket[] => {
    const mappedTasks = tickets.map((ticket) => ({
      id: ticket.id,
      text: ticket.summary,
      start: ticket.start_date ? new Date(ticket.start_date) : new Date(),
      end: ticket.end_date ? new Date(ticket.end_date) : new Date(),
      progress: 0,
      parent: ticket.parent_ticket_id ? Number(ticket.parent_ticket_id) : 0,
      type: "task",
      details: ticket.description,
      state: ticket.ticket_state,
    }));
    return mappedTasks;
  };

  //   const mapTicketsToTasks = (tickets: TicketDetails[]): GanttTicket[] => {
  //   const mappedTasks = tickets.map((ticket) => {
  //     // Convert parent_ticket_id properly
  //     let parentId = 0;
  //     if (ticket.parent_ticket_id) {
  //       const parsed = Number(ticket.parent_ticket_id);
  //       parentId = isNaN(parsed) || parsed === 0 ? 0 : parsed;
  //     }

  //     return {
  //       id: ticket.id,
  //       text: ticket.summary,
  //       start: ticket.start_date ? new Date(ticket.start_date) : new Date(),
  //       end: ticket.end_date ? new Date(ticket.end_date) : new Date(),
  //       progress: 0,
  //       parent: parentId, // Only set parent if it's a valid non-zero number
  //       type: "task" as const,
  //       details: ticket.description,
  //     };
  //   });

  //   return mappedTasks;
  // };

  // const generateSubtaskLinks = (tickets: GanttTicket[]) => {
  //   const links: LinksType[] = [];
  //   let linkCounter = 1;

  //   // Get all parents that have children
  //   const parentIds = Array.from(
  //     new Set(tickets.map(t => t.parent).filter(pid => pid && pid !== 0))
  //   );

  //   parentIds.forEach(parentId => {
  //     const children = tickets
  //       .filter(t => t.parent === parentId)
  //       // .sort((a, b) => a.start.getTime() - b.start.getTime()); // sort by start date

  //     for (let i = 0; i < children.length - 1; i++) {
  //       links.push({
  //         id: linkCounter++, // unique link id
  //         source: children[i].id,
  //         target: children[i + 1].id,
  //         type: "e2s", // end-to-start
  //       });
  //     }
  //   });

  //   return links;
  // };

  const generateSubtaskLinks = (tickets: GanttTicket[]): LinksType[] => {
    const links: LinksType[] = [];
    let linkCounter = 1;

    const addLinksRecursively = (parentId: number) => {
      const children = tickets.filter((t) => t.parent === parentId);

      for (let i = 0; i < children.length - 1; i++) {
        links.push({
          id: linkCounter++,
          source: children[i].id,
          target: children[i + 1].id,
          type: "e2s",
        });
      }

      // if (children.length > 0) {
      //   links.push({
      //     id: linkCounter++,
      //     source: parentId,
      //     target: children[0].id,
      //     type: "e2s",
      //   });
      // }

      children.forEach((child) => addLinksRecursively(child.id));
    };

    // Start recursion from root tasks (parent = 0 or null)
    const rootTasks = tickets.filter((t) => !t.parent || t.parent === 0);
    rootTasks.forEach((root) => addLinksRecursively(root.id));

    return links;
  };

  // const generateSubtaskLinks = (tickets: GanttTicket[]) => {
  //   const links: LinksType[] = [];
  //   // console.log('ticket',tickets)

  //   const parentIds = Array.from(
  //     new Set(tickets.map((t) => t.parent).filter((pid) => pid && pid !== 0))
  //   );
  //   // console.log('parentIds',parentIds)

  //   parentIds.forEach((pid) => {
  //     const children = tickets.filter((t) => t.parent === pid);
  //     // .sort((a, b) => a.id - b.id);

  //     // console.log('children',children)

  //     for (let i = 0; i < children.length - 1; i++) {
  //       // console.log('link',links)
  //       // console.log('i',i)
  //       links.push({
  //         id: children[i].id,
  //         source: children[i].id,
  //         target: children[i + 1].id,
  //         type: "e2s",
  //       });
  //     }
  //   });
  //   // console.log('links',links)

  //   return links;
  // };

  const GetTickets = async () => {
    // const validTasks = allTickets.map(mapTicketToTask);
    const validTasks = mapTicketsToTasks(allTickets);
    setLinks(generateSubtaskLinks(validTasks));
    setAllGanttTickets(validTasks);
    // console.log('after create it is runnnig')
  };

  useEffect(() => {
    GetTickets();
  }, [allTickets]); //alltickets

  const taskTypes = [
    { id: "task", label: "Task" },
    { id: "milestone", label: "Milestone" },
    { id: "summary", label: "Project" },
  ];

  const formAction = async (ev: {
    action:
      | "update-task"
      | "delete-task"
      | "close-form"
      | "add-task"
      | "drag-task";
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
        console.log("data", data);
        try {
          // const res = await GetTicket(data.id);

          const originalTicket = allTickets.find((t) => t.id === data.id);
          if (!originalTicket) return;

          const updatedTicket = {
            ...originalTicket,
            summary: data.text ?? originalTicket.summary,
            start_date: data.start?.toISOString() ?? null,
            end_date: data.end?.toISOString() ?? null,
            description: data.details ?? "",
            ticket_state: data.state,
            parent_ticket_id: String(data.parent ?? 0),
            update_id: String(data.id),
          };

          await EditTicket(updatedTicket, [], data.id);

          apiRef.current?.exec("update-task", { id: data.id, task: data });
          const response = await fetchAllTickets();
          setAllTickets(response);
          setTask(null);
          console.log("Updated:", data);
          toast.success("ticket Updated");
          break;
        } catch (error) {
          console.error("Update error:", error);
        }

        break;
      }
      case "drag-task": {
        console.log("drag", data);
        break;
      }

      case "delete-task": {
        try {
          apiRef.current?.exec("delete-task", { id: data.id });
          setTask(null);
          return;
        } catch (e) {
          console.error("Delete failed:", e);
        }
        break;
      }

      case "close-form":
        setTask(null);
        break;

      case "add-task": {
        console.log("addtask", data);
        if (typeof data.parent === "string" && data.parent.startsWith("temp")) {
          toast.warning(
            "You cannot create a child task before the parent ticket is created!"
          );
          setTask(null);
          return;
        }

        try {
          const newTicket = {
            project_id: "",
            board_id: "",
            workflow_id: "",
            status_id: "",
            ticket_status: "Open",
            ticket_state: data.state,
            ticket_severity: "Medium",
            summary: data.text,
            description: data.details,
            file_attachment: [""],
            comment: "",
            start_date: data.start || new Date(),
            end_date: data.end || new Date(Date.now() + 24 * 60 * 60 * 1000),
            assignee_id: "",
            reporter_id: "",
            parent_ticket_id: String(data.parent ?? "0"),
          };

          const res = await CreateTicket({ data: newTicket, files: [] });
          console.log("ticket created", res);

          if (!res || !res.data.id) {
            console.error("CreateTicket response", res);

            // await GetTickets()
            return;
          }

          const createdId = res.data.id;

          const createdTask: ITask = {
            id: createdId,
            text: newTicket.summary,
            start: new Date(newTicket.start_date),
            end: new Date(newTicket.end_date),
            progress: 0,
            parent: data.parent || 0,
            type: "task",
            details: newTicket.description,
          };

          apiRef.current?.exec("add-task", { task: createdTask });

          setAllGanttTickets((prev: any) => [...prev, createdTask]);
          setTask(null);
          const response = await fetchAllTickets();
          setAllTickets(response);
          // await GetTickets()
          return;
        } catch (err) {
          console.error("Error creating ticket", err);
        }

        break;
      }
    }
  };

  const init = async (api: IApi) => {
    apiRef.current = api;

    // api.on("move-task", async (task) => {
    //   console.log("Task moved (possibly re-parented):", task);

    api.on("move-task", async (event) => {
      if (event.inProgress) return;

      console.log("Move event:", event);

      const movedId = event.id;
      const siblingId = event.target;

      const moved = api.getTask(movedId);
      if (!moved) return;

      const sibling = siblingId ? api.getTask(siblingId) : null;

      const newParentId =
        sibling && sibling.parent !== undefined ? sibling.parent : 0;

      console.log("new parent:", newParentId);

      moved.parent = newParentId;

      const original = allTickets.find((t) => t.id === movedId);
      if (!original) return;

      try {
        await EditTicket(
          {
            ...original,
            summary: moved.text ?? original.summary,
            start_date: moved.start?.toISOString() ?? null,
            end_date: moved.end?.toISOString() ?? null,
            parent_ticket_id: String(newParentId),
            update_id: String(original.id),
            ticket_status: original.ticket_status,
            ticket_state: original.ticket_state,
            ticket_severity: original.ticket_severity,
            file_attachment: original.file_attachment,
            comment: original.comment,
            assignee_id: original.assignee_id,
            reporter_id: original.reporter_id,
          },
          [],
          movedId
        );
        const response = await fetchAllTickets();
        setAllTickets(response);
      } catch (err) {
        console.error("Backend update failed:", err);
      }
    });

    api.on("update-task", async (event) => {
      // if (!event.fromMove && !event.inProgress) {
      //   // Not drag → ignore
      //   console.log("Skipping form update event");
      //   return;
      // }
      console.log('eventmode date drag ',event)
      
      if (!event.diff) {
        console.log("Skipping non-drag event:", event.mode);
        return;
      }

      const task = event.task;
      console.log("Task updated after drag:", task);

      // convert dates to string for backend
      const start = task.start ? new Date(task.start).toISOString() : "";
      const end = task.end ? new Date(task.end).toISOString() : "";

      const originalTicket = allTickets.find((t) => t.id === task.id);
      if (!originalTicket) return;
      console.log("start and edn", start, end);

      await EditTicket(
        {
          ...originalTicket,
          description: task.details ?? "",
          summary: task.text ?? "",
          start_date: start,
          end_date: end,
          parent_ticket_id: String(task.parent),
          update_id: String(originalTicket.id),
        },
        [],
        task.id
      );
      const response = await fetchAllTickets();
      setAllTickets(response);
      // await GetTickets()

      // setAllGanttTickets((prev) =>
      //   prev.map((t) =>
      //     t.id === task.id ? { ...t, ...task } : t
      //   )
      // );
    });

    api.intercept("show-editor", (data: { id?: number }) => {
      if (data.id) {
        // Editing ticket
        console.log("data edit", data);
        // const tkt = all
        const task = api.getTask(data.id);
        console.log("task", task);
        if (task) setTask(task);
      } else {
        // creating new ticket
        const today = new Date(); // current date
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const newTask: ITask = {
          text: "",
          start: today,
          end: tomorrow,
          progress: 0,
          parent: 0,
          // type: "task",
        };
        setTask(newTask);
        console.log("new task added");
      }

      return false;
    });
  };

  const handleAction = async (event: any) => {
    console.log("ACTION FIRED:", event);
  };
  // console.log("allgt", allGanttTickets);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full w-full overflow-x-hidden overflow-y-auto "
      // className="flex flex-col h-full min-h-0"
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Willow>
          {/* <div className="flex-1 w-full min-h-0"> */}
          <Fullscreen>
            <div className="w-full sm:min-h-122  lg:h-full  flex flex-col">
              <Gantt
                tasks={allGanttTickets}
                links={links}
                scales={scales}
                readonly={false}
                init={init}
                onaction={handleAction}
                onRowDoubleClick={(taskId: number) => {
                  const clickedTask = apiRef.current?.getTask(taskId);
                  if (clickedTask) setTask(clickedTask);
                }}
                onBarDoubleClick={(taskId: number) => {
                  const clickedTask = apiRef.current?.getTask(taskId);
                  if (clickedTask) setTask(clickedTask);
                }}
              />
            </div>
            {task && (
              <Form
                task={task}
                taskTypes={taskTypes}
                taskState={StateData}
                onAction={formAction}
              />
            )}
          </Fullscreen>

          {/* </div> */}
        </Willow>
      </div>
    </motion.div>
  );
};

export default GanttView;
