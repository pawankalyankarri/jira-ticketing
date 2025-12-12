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
import type { TicketDetails, UsersDataType } from "../ticketInterfaces/TicketInterfaces";
import { faUser } from "@fortawesome/free-solid-svg-icons";
interface DisplayOrderedTicketsProps {
  allTickets: TicketDetails[];
  usersData : UsersDataType[]
}
const DisplayOrderedTickets = ({ allTickets,usersData }: DisplayOrderedTicketsProps) => {
  const navigate = useNavigate()
  return (
    <div className="h-full overflow-y-auto">
      <Table className="w-full table-fixed text-gray-600 ">
        <TableHeader>
          <TableRow >
            <TableHead className="">TicketId</TableHead>
            <TableHead className="text-center">Task Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Milestone</TableHead>
            <TableHead className="text-center">Allocated Hours</TableHead>
            <TableHead className=" ">Reporter</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTickets.map((tkt, idx) => {
            const user = usersData.find(u=>String(u.id) === String(tkt.assignee_id))
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
                      {tkt.assignee_id ?  `${user?.first_name} ${user?.last_name}`.split(" ").map(w=>w[0]).join(""):<FontAwesomeIcon icon={faUser} />}
                    </AvatarFallback>
                  </Avatar>
                  {tkt.assignee_id && `${user?.first_name} ${user?.last_name}`}
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
