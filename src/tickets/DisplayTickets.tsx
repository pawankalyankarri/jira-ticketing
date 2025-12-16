
import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { UseTickets, type TicketType } from "./hooks/UseTickets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import { motion } from "motion/react";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { TicketDetails, UsersDataType } from "./ticketInterfaces/TicketInterfaces";
import ShowSpecifiedTickets from "./ShowSpecifiedTickets";

interface ColumnTypeProp {
  column: string;
  tickets: TicketDetails[];
  activeId?: string | null;
  allTickets : TicketDetails[]
  usersData : UsersDataType[]
}

const DisplayTicket = ({ column, tickets, activeId,allTickets,usersData }: ColumnTypeProp) => {
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [newTodo, setNewTodo] = useState<string>("");
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });
  const textareaRef = useRef<HTMLDivElement>(null);

  const { CreateTicket } = UseTickets();
  //  console.log('grid cols',gridCols)
  async function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter") {
      return;
    }
    const newTicket = {
      project_id: "",
      board_id: "",
      workflow_id: "",
      status_id: "",
      ticket_status: "Open",
      ticket_state: activeColumn,
      ticket_severity: "Medium",
      summary: newTodo,
      description: "",
      file_attachment: [],
      comment: "",
      // start_date: new Date(),
      // end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      assignee_id: "",
      reporter_id: "",
      // parent_ticket_id : "0"
    };
    const res = await CreateTicket({ data: newTicket, files: null });
    console.log("ticket created", res);
    if (res?.response?.status === 200) {
      window.dispatchEvent(new Event("ticketsUpdated"));
    }

    console.log(newTodo, activeColumn);
    setActiveColumn("");
    setNewTodo("");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setActiveColumn(""); // close
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeColumn]);

  // const columnTextColors: Record<string, string> = {
  //   ToDo: "text-gray-500 ",
  //   InProgress: "text-blue-500",
  //   Cancelled: "text-red-500",
  //   Resolved: "text-green-500",
  //   OnHold: "text-orange-500",
  // };
  // const columBgColors: Record<string, string> = {
  //   ToDo: "bg-gray-500 outline-gray-100 ",
  //   InProgress: "bg-blue-500 outline-blue-100",
  //   Cancelled: "bg-red-500",
  //   Resolved: "bg-green-500",
  //   OnHold: "bg-orange-500",
  // };
  // const columnColors: Record<string, string> = {
  //   ToDo: "bg-gray-50/20",
  //   InProgress: "bg-blue-50/20",
  //   Cancelled: "bg-red-50/20",
  //   Resolved: "bg-green-50/20",
  //   OnHold: "bg-orange-50/20",
  // };
  return (
    <div
      className={cn(
        " aspect-video rounded-xl h-full min-w-[300px] overflow-hidden bg-gray-200",
        isOver ? "bg-blue-100 border-dashed border-2 border-black" : ""
      )}
      ref={setNodeRef}
    >
      <Card className={cn("p-1.5 rounded-sm bg-transparent", "bg-gray-200")}>
        <div className={cn("w-full h-full flex justify-between py-2")}>
          <div className="flex gap-3 px-1 items-center">
            <span className="outline-1 px-2 py-1 bg-white font-bold rounded-full text-sm">
              {tickets.length > 0 ? tickets.length : "0"}
            </span>
            <span className={cn("uppercase font-bold text-gray-900 text-sm")}>
              {column}
            </span>
          </div>
          <div className=" px-1 flex items-center">
            <FontAwesomeIcon
              icon={faPlus}
              className="font-bold text-gray-800 cursor-pointer"
              size="xl"
              onClick={() =>
                setActiveColumn((prev) => (prev === column ? "" : column))
              }
            />
          </div>
        </div>
      </Card>
      <div className="flex flex-col h-[calc(100%-60px)] p-1 overflow-auto thin-scrollbar gap-1">
        {/* <div className="w-full px-2">
          {activeColumn === column && (
            <div
              className="bg-white rounded-md border-2 border-blue-500 min-h-28 "
              ref={textareaRef}
            >
              <Textarea
                className="resize-none border-0 outline-0 min-h-28 max-h-28 overflow-y-auto thin-scrollbar1 "
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeydown}
              />

              
            </div>
          )}
        </div> */}

        <div className="w-full px-2" ref={textareaRef}>
          {activeColumn === column && (
            <div className="bg-white rounded-md border-2 border-blue-500 min-h-28">
              <Textarea
                className="resize-none border-0 outline-0 min-h-28 max-h-28 overflow-y-auto thin-scrollbar1"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeydown}
              />
            </div>
          )}
        </div>

        {tickets
          .filter((item) => String(item.id) !== String(activeId)) // hide the card being dragged
          .map((item: TicketDetails) => {
            return (
              // <motion.div
              //   key={item.id}
              //   //layout // this enables smooth position transition
              //   initial={{ opacity: 1, scale: 1 }}
              //   animate={{ opacity: 1, scale: 1 }}
              //   // exit={{ opacity: 0 }}
              //   transition={{
              //     layout: { type: "spring", stiffness: 300, damping: 25 },
              //     // default: { duration: 0.2 },
              //   }}
              // >
                <ShowSpecifiedTickets
                key={item.id}
                  item={item}
                  allTickets={allTickets}
                  usersData = {usersData}
                  // isDragging={activeId === String(item.id)}
                />
              // </motion.div>
            );
          })}
      </div>
    </div>
  );
};
export default DisplayTicket;
