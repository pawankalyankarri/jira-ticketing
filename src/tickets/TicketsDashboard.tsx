import { Card } from "@/components/ui/card";
import TicketsHead from "./ticketsHeader/TicketsHead";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import DisplayTickets from "./DisplayTickets";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { UseTickets, type TicketType } from "./hooks/UseTickets";
import ShowSpecifiedTickets from "./ShowSpecifiedTickets";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import DisplayOrderedTickets from "./displayorderedtickets/DisplayOrderedTickets";
import TicketsHeadTab from "./ticketsHeader/TicketHeadTab";
import GanttView from "./ticketsUiViews/GanttView";
import type {
  TicketDetails,
  UsersDataType,
} from "./ticketInterfaces/TicketInterfaces";
import OpenTicket from "./openTicket/OpenTicket";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";
import { set } from "date-fns";

export interface ColumnsType {
  id: string;
  title: string;
}

const TicketsDashboard = () => {
  const [allTickets, setAllTickets] = useState<TicketDetails[]>([]);
  const [noTkts, setNoTkts] = useState<boolean>(false);
  // const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "gantt">(
    "kanban"
  );
  const [usersData, setUsersData] = useState<UsersDataType[]>([]);
  const [draggedTicket, setDraggedTicket] = useState<TicketDetails | null>(null);

  const mountRef = useRef<boolean>(false);
  const { UpdateTicketStatus, fetchAllTickets, UpdateTicketHistory } =
    UseTickets();

  const { GetUsers } = BoardWorkflowAPI();

  const Columns: string[] = [
    "ToDo",
    "In Progress",
    "On Hold",
    "Resolved",
    "Cancelled",
    "Re Open",
  ];
  // console.log('loc',location.pathname)

  // const { tickets, getTickets } = TicketsStore();

  const GetUsersData = async () => {
    const usersRes = await GetUsers();
    console.log("usersres", usersRes);
    if (usersRes.data) {
      setUsersData(usersRes.data);
    }
  };
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    // console.log("running");
    const fetchingTickets = async () => {
      const response = await fetchAllTickets();
      if (response?.length == 0) setNoTkts(true);

      setAllTickets(response);
    };
    fetchingTickets();
    GetUsersData();
  }, []);

  useEffect(() => {
    const handler = async () => {
      const res = await fetchAllTickets(); // re-fetch tickets
      setAllTickets(res);
    };

    window.addEventListener("ticketsUpdated", handler);

    return () => window.removeEventListener("ticketsUpdated", handler);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12, // only start drag if mouse moves 5px
      },
    })
  );
  // console.log("alltkts", allTickets);

  const kanbanTkts = useMemo(
    () => allTickets.filter((t: TicketDetails) => t.type !== "milestone"),
    [allTickets]
  );

  const ticketsByColumn = useMemo(() => {
  const map: Record<string, TicketDetails[]> = {};
  Columns.forEach(c => (map[c] = []));

  for (const t of kanbanTkts) {
    map[t.ticket_state]?.push(t);
  }

  Object.values(map).forEach(list =>
    list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
  );

  return map;
}, [kanbanTkts]);


  

  const views = {
    table: (
      <div className="w-full sm:min-h-full max-h-[455px] overflow-y-auto">
        {" "}
        <DisplayOrderedTickets allTickets={kanbanTkts} usersData={usersData} />
      </div>
    ),
    gantt: (
      <div className="w-full sm:min-h-full max-h-[455px] overflow-y-auto">
        <GanttView allTickets={allTickets} setAllTickets={setAllTickets} />
      </div>
    ),
    kanban: (
      <div className="flex-1 rounded-xl  w-full flex gap-4 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => {
            const id = String(event.active.id);
            // setActiveId(id);
            const ticket = kanbanTkts.find((t) => String(t.id) === id);
            setDraggedTicket(ticket || null);
          }}
        >
          {/* {Columns.map((column, idx) => {
          const columnTickets = kanbanTkts.filter(
            (ticket: TicketDetails) => ticket.ticket_state === column
          );
          return (
            <DisplayTickets
              key={idx}
              column={column}
              activeId={activeId}
              tickets={columnTickets}
              allTickets={kanbanTkts}
              usersData = {usersData}
            />
          );
        })} */}

          {Columns.map((column, idx) => {
            // const columnTickets = useMemo(
            //   () =>
            //     kanbanTkts.filter(
            //       (ticket: TicketDetails) => ticket.ticket_state === column
            //     ).sort((a,b)=>new Date(b.created_at).getTime()- new Date(a.created_at).getTime()),
            //   [kanbanTkts, column]
            // );
            return (
              <DisplayTickets
                key={column}
                column={column}
                // activeId={activeId}
                tickets={ticketsByColumn[column]}
                allTickets={kanbanTkts}
                usersData={usersData}
              />
            );
          })}
          {/* <DragOverlay dropAnimation={null}>
            {activeId
              ? kanbanTkts.find((t) => String(t.id) === String(activeId)) && (
                  <ShowSpecifiedTickets
                    item={
                      kanbanTkts.find((t) => String(t.id) === String(activeId))!
                    }
                    allTickets={kanbanTkts}
                  />
                )
              : null}
          </DragOverlay> */}

          <DragOverlay dropAnimation={null}>
            { draggedTicket ? (
              <ShowSpecifiedTickets
                itemTkt={draggedTicket}
                allTickets={[]} 
                usersData={usersData}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    ),
  };

  // useEffect(() => {
  //   setRefresh((prev) => !prev);
  // }, [location.pathname]);

  // const todoTickets = tickets.filter(
  //   (obj: any) => obj?.ticket_state === "ToDo"
  // );
  // const inProgressTickets = tickets.filter(
  //   (obj: any) => obj?.ticket_state === "InProgress"
  // );
  // const canceledTickets = tickets.filter(
  //   (obj: any) => obj?.ticket_state === "Cancelled"
  // );
  // const resolvedTickets = tickets.filter(
  //   (obj: any) => obj?.ticket_state === "Resolved"
  // );
  // const onHoldTickets = tickets.filter(
  //   (obj: any) => obj?.ticket_state === "OnHold"
  // );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log('active',active,'over',over)
    if (!over) return;

    const oldTicket = allTickets.find(
      (t) => String(t.id) === String(active.id)
    );
    if (!oldTicket) return;

    const newState = String(over.id);

    if (oldTicket.ticket_state === newState) {
      // setActiveId(null);
      setDraggedTicket(null);
      return;
    }
    if(oldTicket.ticket_state === 'Cancelled' && newState !== 'Re Open'){
      // setActiveId(null)
      setDraggedTicket(null);
      toast.warning("Cancelled ticket will drag to Re Open State only!")
      return
    }

    // Update UI immediately
    setAllTickets((prev) =>
      prev.map((t) =>
        String(t.id) === String(active.id)
          ? { ...t, ticket_state: newState }
          : t
      )
    );

    // setTimeout(() => setActiveId(null), 0);
    // setActiveId(null);
    setDraggedTicket(null);

    // update object
    const updatedTicket = {
      ...oldTicket,
      update_id: Number(oldTicket.id),
      ticket_status: oldTicket.ticket_status,
      ticket_state: newState,
      ticket_severity: oldTicket.ticket_severity,
      summary: oldTicket.summary,
      description: oldTicket.description,
      file_attachment: oldTicket.file_attachment ?? [""],
      comment: oldTicket.comment,
      start_date: oldTicket.start_date,
      due_date: oldTicket.due_date,
      assignee_id: oldTicket.assignee_id,
      reporter_id: oldTicket.reporter_id,
      
    };

    const updatedTicketHistoryData = {
      ticket_id: String(oldTicket.id),
      changed_by: "",
      field_name: "",
      old_value: oldTicket.ticket_state,
      new_value: newState,
    };

    // console.log("sending:", updatedTicket);

    const res = await UpdateTicketStatus(updatedTicket);

    if (res?.status === 200) {
      toast.success(res.data.message);

      const ticketHistoryResponse = await UpdateTicketHistory(
        updatedTicketHistoryData
      );
      console.log("histroyresponse", ticketHistoryResponse);
      const response = await fetchAllTickets(); // re-fetch tickets
      setAllTickets(response);
    } else {
      toast.error("Failed to update ticket");
    }
  }

  return (
    <div className="flex flex-col gap-1 p-4 pt-0 w-full h-full overflow-hidden">
      <div className="w-full h-fit ">
        {/* tickets header filters */}
        <Outlet />
        <TicketsHead
          setTickets={setAllTickets}
          tickets={allTickets}
          setViewMode={setViewMode}
        />
      </div>
      <div className="h-fit w-full ">
        <TicketsHeadTab />
      </div>

      {allTickets.length === 0 ? (
        <div className="flex justify-center pt-20 h-screen">
          {noTkts ? (
            <div className="font-bold">No Tickets</div>
          ) : (
            <Spinner className=" w-9 h-9" />
          )}
        </div>
      ) : (
        <div className={cn("flex-1 rounded-xl  w-full flex gap-4 text-xs ")}>
          {views[viewMode]}

          {/* {gridCols ? (
            <DisplayOrderedTickets allTickets={allTickets} />
          ) : ganttUi ? (
            <GanttView allTickets={allTickets} setAllTickets={setAllTickets} />
          ) : (
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={(event) => setActiveId(String(event.active.id))}
            >
              {Columns.map((column, idx) => {
                const columnTickets = allTickets.filter(
                  (ticket: TicketDetails) => ticket.ticket_state === column
                );
                return (
                  <DisplayTickets
                    key={idx}
                    column={column}
                    activeId={activeId}
                    tickets={columnTickets}
                    gridCols={gridCols}
                  />
                );
              })}
              <DragOverlay dropAnimation={null}>
                {activeId
                  ? allTickets.find(
                      (t) => String(t.id) === String(activeId)
                    ) && (
                      <ShowSpecifiedTickets
                        item={
                          allTickets.find(
                            (t) => String(t.id) === String(activeId)
                          )!
                        }
                      />
                    )
                  : null}
              </DragOverlay>
            </DndContext>
          )} */}
        </div>
      )}
    </div>
  );
};
export default TicketsDashboard;
