import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TicketType } from "../hooks/UseTickets";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
interface DisplayOrderedTicketsProps {
  allTickets: TicketType[];
}
const DisplayOrderedTickets = ({ allTickets }: DisplayOrderedTicketsProps) => {
  const navigate = useNavigate()
  return (
    <div>
      <Table className="w-full table-fixed text-gray-600">
        <TableHeader>
          <TableRow >
            <TableHead className="">TicketId</TableHead>
            <TableHead className="text-center">Task Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Milestone</TableHead>
            <TableHead className="text-center">Allocated Hours</TableHead>
            <TableHead className=" ">Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTickets.map((tkt, idx) => {
            return (
              <TableRow key={idx} className=" h-auto min-h-[50px]" onClick={()=>navigate(`/tickets/view/${tkt.id}`)}>
                <TableCell className="font-medium underline ">{tkt.ticket_id}</TableCell>
                <TableCell className=" wrap-break-word whitespace-normal">
                  {tkt.summary.length > 40
                    ? `${tkt.summary.slice(0, 40)}...`
                    : tkt.summary}
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-5 py-1.5 bg-orange-100 font-bold outline-1 rounded outline-orange-500 text-orange-500">
                    {tkt.ticket_status}
                  </span>
                </TableCell>
                <TableCell className="text-center">None</TableCell>
                <TableCell className="text-center">None</TableCell>
                <TableCell className=" text-right flex gap-2 items-center">
                  <Avatar>
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white ">
                      {tkt.assignee_id[0]}
                    </AvatarFallback>
                  </Avatar>
                  {tkt.assignee_id}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default DisplayOrderedTickets;
