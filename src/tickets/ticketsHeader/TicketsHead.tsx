import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCodeMerge,
  faFileLines,
  faGears,
  faGrip,
  faListUl,
  faPaperclip,
  faPlus,
  faRefresh,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { SelectSearch } from "@/components/ui/SelectSearch";
import { useNavigate } from "react-router-dom";
import { UseTickets, type TicketType } from "../hooks/UseTickets";
import {
  useEffect,
  useState,
  type Dispatch,
  type InputEvent,
  type SetStateAction,
} from "react";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import type { TicketDetails } from "../ticketInterfaces/TicketInterfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TicketHeadProps {
  tickets: TicketDetails[];
  setTickets: Dispatch<SetStateAction<TicketDetails[]>>;
  setViewMode: Dispatch<SetStateAction<"table" | "gantt" | "kanban">>;
}

const TicketsHead = ({ setTickets, setViewMode }: TicketHeadProps) => {
  const [ticketId, setTicketId] = useState<string>("");
  // const [allTickets, setAllTickets] = useState<TicketType[]>([])
  const [severity, setSeverity] = useState<string>("All Severity");
  const [tktState, setTktState] = useState<string>("All States");
  const [tStatus, setTStatus] = useState<string>("All Status");
  const { fetchAllTickets, loading } = UseTickets();
  // const { tickets, setTickets } = TicketsStore();
  const navigate = useNavigate();

  const severityData = ["All Severity", "Low", "Medium", "High", "Critical"];
  const StatusData = ["All Status", "Open", "Close", "Pending"];
  const StateData = [
    "All States",
    "ToDo",
    "In Progress",
    "On Hold",
    "Re Open",
    "Resolved",
    "Cancelled",
  ];

  // useEffect(()=>{
  //   setTickets(tickets)
  // },[])

  // console.log('alltic',allTickets)
  // console.log('tkts',tickets)

  async function ticketIdSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTicketId(value);
    console.log(value);
    const res = await fetchAllTickets();

    const filteredTickets = res.filter(
      (item: TicketType) =>
        item.ticket_id.toLowerCase().includes(value.toLowerCase()) ||
        item.summary.toLowerCase().includes(value.toLowerCase())
    );
    setTickets(filteredTickets);
  }
  const refreshTickets = async () => {
    const res = await fetchAllTickets();
    setTickets(res);
    setSeverity("All Severity");
    setTStatus("All Status");
    setTicketId("");
    setTktState("All States");
  };

  async function handleSeverityChange(val: string) {
    setSeverity(val);
    console.log("val", val);
    const res = await fetchAllTickets();
    if (val === "" || val === "All Severity") {
      setTickets(res);
      return;
    }
    const tkts = res.filter(
      (t: TicketType) => t.ticket_severity.toUpperCase() === val.toUpperCase()
    );
    setTickets(tkts);
  }

  async function handleStateChange(val: string) {
    setTktState(val);
    console.log("val", val);
    const res = await fetchAllTickets();
    if (val === "" || val === "All States") {
      setTickets(res);
      return;
    }
    const tkts = res.filter(
      (t: TicketType) => t.ticket_state.toUpperCase() === val.toUpperCase()
    );
    console.log("filtered tkts", tkts);
    setTickets(tkts);
  }
  async function handleStatusChange(val: string) {
    setTStatus(val);
    console.log("val", val);
    const res = await fetchAllTickets();
    if (val === "" || val === "All Status") {
      setTickets(res);
      return;
    }
    const tkts = res.filter(
      (t: TicketType) => t.ticket_status.toUpperCase() === val.toUpperCase()
    );
    setTickets(tkts);
  }

  return (
    <div className="p-1.5 rounded grid grid-cols-3 text-sm w-full h-full text-gray-900 bg-white">
      <div></div>
      <div className="flex justify-end gap-2 col-span-2 items-center">
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full">
                <SelectSearch
                  SelectSearchData={severityData}
                  title={"All Severity"}
                  size={"xs"}
                  value={severity}
                  onChange={handleSeverityChange}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold font-serif">Severity filter </p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full">
                <SelectSearch
                  SelectSearchData={StateData}
                  title={"All States"}
                  size={"xs"}
                  value={tktState}
                  onChange={handleStateChange}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold font-serif">States filter </p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full">
                <SelectSearch
                  SelectSearchData={StatusData}
                  title={"All Status"}
                  size={"xs"}
                  value={tStatus}
                  onChange={handleStatusChange}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold font-serif">Status filter </p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span className="relative flex justify-center items-center ">
          <FontAwesomeIcon icon={faSearch} className="absolute left-2" />
          <Input
            className="pl-8 text-xs w-[100px]"
            value={ticketId}
            onChange={(e) => ticketIdSearchChange(e)}
          />
        </span>
        <span
          className="p-1.5 outline-1 rounded shadow cursor-pointer"
          onClick={refreshTickets}
        >
          <FontAwesomeIcon
            icon={faRefresh}
            className={cn(loading ? "animate-spin" : "")}
          />
        </span>
        {/* <span className="p-1.5 outline-1 rounded shadow cursor-pointer">
          <FontAwesomeIcon icon={faCodeMerge} />
        </span> */}
        <span
          onClick={() => {
            // setGanttUi(false);
            // setGridCols(false);
            setViewMode("kanban");
          }}
          className="p-1.5 outline-1 rounded cursor-pointer"
        >
          <FontAwesomeIcon icon={faGrip} />
        </span>
        <span
          onClick={() => {
            setViewMode("table");
          }}
          className="p-1.5 outline-1 rounded cursor-pointer"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <FontAwesomeIcon icon={faListUl} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold capitalize font-serif">Listwise Tickets</p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span
          onClick={() => {
            setViewMode("gantt");
          }}
          className="p-1.5 outline-1 rounded cursor-pointer"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <FontAwesomeIcon icon={faChartBar} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold capitalize font-serif">chartwise tickets</p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span className="p-1.5 outline-1 rounded shadow cursor-pointer text-gray-900">
          <FontAwesomeIcon icon={faFileLines} />
        </span>
        <span className="p-1.5 outline-1 rounded shadow cursor-pointer">
          <FontAwesomeIcon
            icon={faGears}
            className="text-gray-900"
            color="gray"
          />
        </span>
        <span className="p-1.5 outline-1 rounded shadow cursor-pointer">
          <FontAwesomeIcon
            icon={faPaperclip}
            className="text-gray-900"
            color="gray"
          />
        </span>
        <Button
          className="p-0 bg-blue-500 hover:bg-blue-800 cursor-pointer"
          onClick={() => navigate("/tickets/createTicket")}
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          Create
        </Button>
      </div>
    </div>
  );
};

export default TicketsHead;
