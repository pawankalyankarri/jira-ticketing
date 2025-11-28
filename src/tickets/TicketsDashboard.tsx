import { Card } from "@/components/ui/card";
import TicketsHead from "./ticketsHeader/TicketsHead";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DisplayTickets from "./DisplayTickets";
import { motion } from "motion/react";
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
import { Divide } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import DisplayOrderedTickets from "./displayorderedtickets/DisplayOrderedTickets";
import TicketsHeadTab from "./ticketsHeader/TicketHeadTab";

export interface ColumnsType {
  id: string;
  title: string;
}

const TicketsDashboard = () => {
  const [allTickets, setAllTickets] = useState<TicketType[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [noTkts, setNoTkts] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<boolean>(false);
  const location = useLocation();

  const mountRef = useRef<boolean>(false);
  const { UpdateTicketStatus, fetchAllTickets,UpdateTicketHistory,  } =
    UseTickets();

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
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    // console.log("running");
    const fetchingTickets = async () => {
      const response = await fetchAllTickets();
      if (response.length == 0) setNoTkts(true);

      setAllTickets(response);
    };
    fetchingTickets();
  }, []);

  useEffect(() => {
    const handler = async () => {
      const res = await fetchAllTickets(); // re-fetch tickets
      setAllTickets(res);
    };

    window.addEventListener("ticketsUpdated", handler);

    return () => window.removeEventListener("ticketsUpdated", handler);
  }, []);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // only start drag if mouse moves 5px
      },
    })
  );



  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const oldTicket = allTickets.find(
      (t) => String(t.id) === String(active.id)
    );
    if (!oldTicket) return;

    const newState = String(over.id);

    if (oldTicket.ticket_state === newState) {
      setActiveId(null);
      return;
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
    setActiveId(null)

    // update object
    const updatedTicket = {
      update_id: String(oldTicket.id),
      ticket_status: oldTicket.ticket_status,
      ticket_state: newState,
      ticket_severity: oldTicket.ticket_severity,
      summary: oldTicket.summary,
      description: oldTicket.description,
      file_attachment: oldTicket.file_attachment ?? [""],
      comment: oldTicket.comment,
      start_date: oldTicket.start_date,
      end_date: oldTicket.end_date,
      assignee_id: oldTicket.assignee_id,
      reporter_id: oldTicket.reporter_id,
    };

    const updatedTicketHistoryData = {
      ticket_id: String(oldTicket.id),
      changed_by: "",
      field_name: "",
      old_value: oldTicket.ticket_state,
      new_value: newState,
    }

    // console.log("sending:", updatedTicket);

    const res = await UpdateTicketStatus(updatedTicket);

    if (res?.status === 200) {
      toast.success(res.data.message);

      const ticketHistoryResponse = await UpdateTicketHistory(updatedTicketHistoryData)
      console.log('histroyresponse',ticketHistoryResponse)
      const response = await fetchAllTickets(); // re-fetch tickets
      setAllTickets(response);
    } else {
      toast.error("Failed to update ticket");
    }
  }

  return (
    <div className="flex flex-col gap-1 p-4 pt-0 w-full h-full overflow-hidden">
      <div className="w-full h-fit">
        {/* tickets header filters */}
        <Outlet />
        <TicketsHead
          setTickets={setAllTickets}
          tickets={allTickets}
          gridCols={gridCols}
          setGridCols={setGridCols}
        />

      </div>
          <div className="h-fit w-full"><TicketsHeadTab/></div>

      {/* <div className="grid auto-rows-min  gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl h-20 w-full" />
        <div className="bg-muted/50 aspect-video rounded-xl  h-20 w-full" />
        <div className="bg-muted/50 aspect-video rounded-xl h-20 w-full " />
      </div> */}
      {allTickets.length === 0 ? (
        <div className="flex justify-center pt-20 h-screen">
          {noTkts ? (
            <div className="font-bold">No Tickets</div>
          ) : (
            <Spinner className=" w-9 h-9" />
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 rounded-xl  w-full flex gap-4 text-xs overflow-x-auto"
          )}
        >
          {gridCols ? (
            <DisplayOrderedTickets allTickets={allTickets}  />
          ) : (
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={(event) => setActiveId(String(event.active.id))}
            >
              {Columns.map((column, idx) => {
                const columnTickets = allTickets.filter(
                  (ticket: TicketType) => ticket.ticket_state === column
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
          )}
        </div>
      )}
      {/* <div className=" min-h-screen flex-1 rounded-xl md:min-h-min grid grid-cols-5 gap-4 text-xs">
        <div className="bg-gray-50/20 aspect-video rounded-xl h-full w-full ">
          <Card className="p-1.5 rounded-sm bg-gray-50">
            <div className="w-full h-full flex justify-between">
              <span className="uppercase font-bold text-gray-500">todo</span>
              <span className="outline-1 px-1 bg-white font-bold rounded-full">
                {todoTickets.length > 0 ? todoTickets.length : "0"}
              </span>
            </div>
          </Card>
          <div className="w-full h-full  hover:overflow-auto">
            <DisplayTickets tickets={todoTickets} />
          </div>
        </div>
        <div className="bg-blue-50/20 aspect-video rounded-xl h-full w-full">
          <Card className="p-1.5 rounded-sm bg-blue-100">
            <div className="w-full h-full flex justify-between">
              <span className="uppercase font-bold text-blue-500">
                inprocess
              </span>
              <span className="outline-1 px-1 bg-white font-bold rounded-full">
                {inProgressTickets.length > 0 ? inProgressTickets.length : "0"}
              </span>
            </div>
          </Card>
          <div className="w-full h-full hover:overflow-auto">
            <DisplayTickets tickets={inProgressTickets} />
          </div>
        </div>
        <div className="bg-red-50/20 aspect-video rounded-xl h-full w-full ">
          <Card className="p-1.5 rounded-sm bg-red-100">
            <div className="w-full h-full flex justify-between">
              <span className="uppercase font-bold text-red-500">canceled</span>
              <span className="outline-1 px-1 bg-white font-bold rounded-full">
                {canceledTickets.length > 0 ? canceledTickets.length : "0"}
              </span>
            </div>
          </Card>
          <div className="w-full h-full hover:overflow-auto">
            <DisplayTickets tickets={canceledTickets} />
          </div>
        </div>
        <div className="bg-green-50/20 aspect-video rounded-xl h-full w-full ">
          <Card className="p-1.5 rounded-sm bg-green-100">
            <div className="w-full h-full flex justify-between">
              <span className="uppercase font-bold text-green-500">
                resolved
              </span>
              <span className="outline-1 px-1 bg-white font-bold rounded-full">
                {resolvedTickets.length > 0 ? resolvedTickets.length : "0"}
              </span>
            </div>
          </Card>
          <div className="w-full h-full hover:overflow-auto">
            <DisplayTickets tickets={resolvedTickets} />
          </div>
        </div>
        <div className=" bg-orange-50/20 aspect-video rounded-xl h-full w-full ">
          <Card className="p-1.5 rounded-sm bg-orange-100">
            <div className="w-full h-full flex justify-between">
              <span className="uppercase font-bold text-orange-500">
                onhold
              </span>
              <span className="outline-1 px-1 bg-white font-bold rounded-full">
                {onHoldTickets.length > 0 ? onHoldTickets.length : "0"}
              </span>
            </div>
          </Card>
          <div className="w-full h-full hover:overflow-auto">
            <DisplayTickets tickets={onHoldTickets} />
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default TicketsDashboard;
