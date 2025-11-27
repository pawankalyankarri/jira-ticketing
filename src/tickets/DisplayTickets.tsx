// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import type { TicketType } from "@/Zustand/TicketsStore";
// import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Calendar } from "lucide-react";

// interface TicketsTypeProps {
//   tickets: TicketType[];
// }

// const DisplayTickets = ({ tickets }: TicketsTypeProps) => {
//   return (
//     <div className="grid gap-3 mt-3 text-xs">
//       {tickets.map((item: TicketType) => {
//         const date = new Date(item.start_date);
//         const options: Intl.DateTimeFormatOptions = {
//           month: "short",
//           day: "2-digit",
//         };
//         const formatted = date.toLocaleDateString("en-US", options);
//         return (
//           <Card key={item.id} className="w-full h-full px-2 text-xs gap-2 ">
//             <div className="w-full h-full flex justify-between">
//               <span
//                 className={cn(
//                   "p-0.5 px-1 rounded-2xl outline-1",
//                   item.ticket_severity === "Low"
//                     ? "bg-green-200"
//                     : item.ticket_severity === "High"
//                     ? "bg-orange-200"
//                     : item.ticket_severity === "Medium"
//                     ? "bg-yellow-200"
//                     : "bg-red-200"
//                 )}
//               >
//                 {item.ticket_severity}
//               </span>

//               <div className="flex gap-1">
//                 <span className="cursor-pointer">
//                   <FontAwesomeIcon icon={faEye} />
//                 </span>
//                 <span className="cursor-pointer">
//                   <FontAwesomeIcon icon={faPen} />
//                 </span>
//                 <span className="cursor-pointer">
//                   <FontAwesomeIcon icon={faTrash} />
//                 </span>
//               </div>
//             </div>
//             <div className=" w-full ">
//                 <span className="cursor-pointer pl-2">{item.ticket_id}</span>
//             </div>
//             <Separator className=""/>
//             <div className="w-full h-full flex gap-2 justify-between">
//               <span className="p-0.5 rounded-2xl outline-1">
//                 {item.ticket_status}
//               </span>
//               <span className="flex gap-1">
//                 <Calendar className="w-[15px] h-[15px]" />
//                 {formatted}
//               </span>
//             </div>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default DisplayTickets;

import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { TicketType } from "./hooks/UseTickets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import { motion } from "motion/react";
import ShowSpecifiedTickets from "./ShowSpecifiedTickets";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

interface ColumnTypeProp {
  column: string;
  tickets: TicketType[];
  activeId?: string | null;
}

const DisplayTicket = ({ column, tickets, activeId }: ColumnTypeProp) => {
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [newTodo, setNewTodo] = useState<string>("");
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });
  const textareaRef = useRef<HTMLDivElement>(null);

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter") {
      return;
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
              onClick={() => setActiveColumn(column)}
            />
          </div>
        </div>
      </Card>
      <div className="flex flex-col h-[calc(100%-60px)] p-1 overflow-auto thin-scrollbar gap-1">
        <div className="w-full px-2">
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

              {/* <div className="w-full flex justify-start gap-3 p-2">
                <span></span>
                <span>
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-500 cursor-pointer"
                    size="xl"
                  />
                </span>
                <span className=" ">
                  <FontAwesomeIcon icon={faCircleUser} className="text-gray-500 cursor-pointer" size="xl" />
                </span>
              </div> */}
            </div>
          )}
        </div>
        {tickets
          .filter((item) => String(item.id) !== String(activeId)) // hide the card being dragged
          .map((item: TicketType) => {
            return (
              <motion.div
                key={item.id}
                layout // this enables smooth position transition
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                // exit={{ opacity: 0 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 25 },
                  // default: { duration: 0.2 },
                }}
              >
                <ShowSpecifiedTickets
                  item={item}

                  // isDragging={activeId === String(item.id)}
                />
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};
export default DisplayTicket;
