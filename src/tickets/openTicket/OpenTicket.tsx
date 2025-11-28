import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseTickets, type TicketType } from "../hooks/UseTickets";
import { Textarea } from "@/components/ui/textarea";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Check,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectSearch } from "@/components/ui/SelectSearch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faComment,
  faGears,
  faPaperclip,
  faPlus,
  faPlusCircle,
  faRightLong,
  faTriangleExclamation,
  faUsers,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import TicketCommnets from "../IndividualTicketComments/TicketComments";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Progress } from "@/components/ui/progress";
import type {
  TicketCollaboratorsDataType,
  TicketHistoryDetailsType,
  UsersDataType,
} from "../ticketInterfaces/TicketInterfaces";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";

const OpenTicket = () => {
  const [ticketDetails, setTicketDetails] = useState<TicketType | null>(null);
  const [ticketHistoryDetails, setTicketHistoryDetails] = useState<
    TicketHistoryDetailsType[]
  >([]);
  const [createdDateStr, setCreatedDateStr] = useState<String>("");
  const [createdTimeStr, setCreatedTimeStr] = useState<String>("");
  const [open, setOpen] = useState<boolean>(true);
  const [collabsOpen, setCollabsOpen] = useState<boolean>(true);
  const [collaborators, setCollaborators] = useState<
    TicketCollaboratorsDataType[]
  >([]);
  const [showSelectCollabs, setShowSelectCollabs] = useState<boolean>(false);
  const [showSubTaskInput, setShowSubTaskInput] = useState<boolean>(false);
  const [assigneedetails, setAssigneeDetails] = useState<string>("");
  const [usersData, setUsersData] = useState<UsersDataType[]>([]);

  const navigate = useNavigate();
  const {
    GetTicket,
    GetTicketHistory,
    CreateTicketCollaborators,
    GetTicketAllCollaborators,
    RemoveTicketCollaborator
  } = UseTickets();
  const { GetUsers } = BoardWorkflowAPI();
  const params = useParams();

  // const ticketStateData = [
  //   "ToDo",
  //   "InProgress",
  //   "Cancelled",
  //   "Resolved",
  //   "OnHold",
  // ];

  const ticketSeverityData = ["Low", "Medium", "High", "Critical"];

  useEffect(() => {
    if (params.id) {
      const fetch = async () => {
        const response = await GetTicket(String(params.id));
        if (response) {
          setTicketDetails(response);
          const tktHistory = await GetTicketHistory({
            ticket_id: String(response.id),
          });
          if (tktHistory?.status) {
            setTicketHistoryDetails(tktHistory.data.data);
          }
          console.log("tktHistory", tktHistory);

          setAssigneeDetails(response.assignee_id);
          const usersRes = await GetUsers();
          console.log("usersres", usersRes);
          setUsersData(usersRes.data);
          await GetAllCollaborators();
        }
      };
      fetch();
    }
  }, []);
  console.log("ticketdetails", ticketDetails);
  // console.log("tkthistorydetails", ticketHistoryDetails.reverse());

  useEffect(() => {
    if (ticketDetails) {
      const date = new Date(ticketDetails?.created_at);
      const formattedDate = date
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", "");
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        second: undefined,
      });
      setCreatedDateStr(formattedDate);
      setCreatedTimeStr(formattedTime);
    }
  }, [ticketDetails]);

  async function GetAllCollaborators() {
    const collabsres = await GetTicketAllCollaborators({
      ticket_id: String(params.id),
    });
    console.log("collabsres", collabsres);
    setCollaborators(collabsres.data);
  }

  const handleSelect = async (item:UsersDataType) => {
    const isSelected = collaborators.some((c) => c.user_id === item.id);

    if (isSelected) {
      setCollaborators((prev) => prev.filter((c) => c.user_id !== item.id));
    } else {
      setCollaborators((prev: any) => [...prev, { user_id: item.id }]);
    }

    try {
      if (!isSelected) {
        await CreateTicketCollaborators({
          ticket_id: String(params.id),
          user_id: [String(item.id)],
        });
      } else {
        await RemoveTicketCollaborator({
          ticket_id: String(params.id),
          user_id: [String(item.id)],
        });
      }
    } catch (err) {
      console.error('selecting adding or deleting collaborators',err);

      setCollaborators((prev: any) => {
        if (isSelected) {
          return [...prev, { user_id: item.id }];
        } else {
          return prev.filter((c: any) => c.user_id !== item.id);
        }
      });
    }
    console.log("collabs after select",collaborators)
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    // console.log(diff)
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    // console.log(seconds,minutes,hours,days)

    if (days > 7) {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (seconds >= 1) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  function formattedDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        val ? "" : navigate("/tickets");
      }}
    >
      {ticketDetails && (
        <DialogContent className="w-full! sm:w-[90%]! max-w-none! h-[90%]! border-0! shadow-none! focus-visible:outline-none! focus-visible:ring-0 gap-2 p-0 ">
          <DialogHeader className=" gap-0 sticky bg-gray-200 max-w-full py-3 h-fit rounded-md">
            <DialogTitle className="w-full px-2 flex justify-between items-center  ">
              <span className="border-2 border-orange-400 text-orange-400 p-1 text-sm px-2 rounded ">
                {ticketDetails.ticket_status}
              </span>

              <div className="flex gap-2 items-center">
                {/* <div className="">
                  <Popover
                  // open={collabsOpen}
                  // onOpenChange={setCollabsOpen}
                  >
                    <PopoverTrigger asChild>
                      <span className="text-sm border border-black p-1.5 cursor-pointer rounded">
                        Assign Parent
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className={cn("p-0")}>
                      <Command className="text-xs">
                        <CommandInput
                          placeholder="Search Here..."
                          className="h-9 text-xs"
                        />

                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>

                          <CommandGroup>
                            {collaboratorsData.map((item) => {
                              // const isSelected =
                              //   collaborators.includes(item); // <-- MULTI-SELECT LOGIC

                              return (
                                <CommandItem
                                  key={item}
                                  className="text-xs capitalize flex items-center"
                                  onSelect={() => {
                                    let updated;

                                    // if (isSelected) {
                                    //   // remove item
                                    //   updated = collaborators.filter(
                                    //     (val) => val !== item
                                    //   );
                                    // } else {
                                    //   // add item
                                    //   updated = [
                                    //     ...collaborators,
                                    //     item,
                                    //   ];
                                    // }

                                    // setCollaborators(updated); // send updated list
                                  }}
                                >
                                  
                                  <Check
                                    className={cn(
                                      "mr-2"
                                      // isSelected
                                      //   ? "opacity-100"
                                      //   : "opacity-0"
                                    )}
                                  />

                                  {item}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div> */}

                <div className="border border-black rounded p-1 cursor-pointer">
                  <span>
                    <FontAwesomeIcon icon={faPaperclip} size={"xs"} />
                  </span>
                  <span className="capitalize text-sm">Add Attachment</span>
                </div>

                <div
                  className="float-right p-1.5 bg-gray-300 rounded"
                  onClick={() => navigate("/tickets")}
                >
                  <FontAwesomeIcon
                    icon={faX}
                    className="font-bold cursor-pointer"
                    size="sm"
                  />
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription
            asChild
            className="text-black py-0 h-full px-3 overflow-y-auto"
          >
            <div className="grid grid-cols-3 gap-3 h-full  ">
              <div className="col-span-2 h-full">
                <div>
                  <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
                    {/* comments */}
                    <>
                      {/* <div className="w-full h-full grid  p-0">
                      <span className="font-bold text-lg">Description</span>

                      <div className="border-1 border-gray-300 rounded">
                        <ToggleGroup type="multiple">
                          <ToggleGroupItem
                            value="bold"
                            aria-label="Toggle bold"
                            onClick={() => {}}
                          >
                            <Bold className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="italic"
                            aria-label="Toggle italic"
                            onClick={() => {}}
                          >
                            <Italic className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="underline"
                            aria-label="Toggle underline"
                            onClick={() => {}}
                          >
                            <Underline className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="strikethrough"
                            aria-label="Toggle strikethrough"
                            onClick={() => {}}
                          >
                            <Strikethrough className="h-4 w-4" />
                          </ToggleGroupItem>

                          <ToggleGroupItem
                            value="numbering"
                            aria-label="Toggle numbering"
                            onClick={() => {}}
                          >
                            <ListOrdered className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="pointing"
                            aria-label="Toggle pointing"
                            onClick={() => {}}
                          >
                            <List className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <div className="border-x-1 border-b-1 border-gray-300 rounded">
                        <TextareaAutosize
                          placeholder="Add Description..."
                          minRows={4}
                          className={cn(
                            " text-sm resize-none border-0 w-full  outline-0"
                            // bold && "font-bold!",
                            // italic && "italic",
                            // underline && "underline",
                            // strikethrough && "line-through"
                          )}
                          value={ticketDetails.description}
                          name="comment_text"
                          readOnly
                        />
                      </div>
                    </div> */}
                    </>
                    <div>
                      <span className="text-lg font-bold">Description</span>
                      <p>{ticketDetails.description}</p>
                    </div>
                    <div>
                      <span className="text-lg font-bold">Summary</span>
                      <p>{ticketDetails.summary}</p>
                    </div>
                    <div>
                      <span className="text-lg font-bold">Comments</span>
                      <p>{ticketDetails.comment}</p>
                    </div>
                    <div>
                      <div className="">
                        <span className="text-lg font-bold">Activity</span>
                        <div className="w-full ">
                          <Tabs defaultValue="comment" className="w-full">
                            <TabsList className="w-[400px]">
                              <TabsTrigger value="all">All</TabsTrigger>
                              <TabsTrigger value="comment">
                                <FontAwesomeIcon
                                  icon={faComment}
                                  color="gray"
                                />
                                Comments
                              </TabsTrigger>
                              <TabsTrigger value="history">
                                <FontAwesomeIcon icon={faClockRotateLeft} />
                                History
                              </TabsTrigger>
                              <TabsTrigger value="worklogs">
                                <FontAwesomeIcon icon={faGears} />
                                Worklogs
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                             <div className="grid gap-5">
                                {[...ticketHistoryDetails]
                                  .reverse()
                                  .map((obj, idx) => {
                                   const user = usersData.find(u=>String(u.id) === String(obj.changed_by))
                                   console.log("user",user)
                                    return (
                                      <div
                                        className="flex justify-between  gap-2 w-full p-1 pb-3"
                                        key={idx}
                                      >
                                        <div className="flex  w-full gap-2 items-center a">
                                          <div className="flex w-fit gap-3">
                                            <div className="w-fit">
                                              <Avatar className="">
                                                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                                <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                                                  {obj.changed_by[0] || "u"}
                                                </AvatarFallback>
                                              </Avatar>
                                            </div>
                                            {obj.old_value.trim() === "" ? (<div>
                                                {/* {user?.first_name.trim()=== "" ? user.email : `${user?.first_name} ${user?.last_name}`} =====> uncomment this after getting login user  */}
                                                <span> <strong>User</strong> Created the <strong>Card</strong></span>
                                              </div>) :
                                            <div className="flex gap-3 flex-col items-center ">
                                              <div className=" w-full">
                                                <strong className="capitalize">
                                                  {obj.changed_by || "user"}
                                                </strong>{" "}
                                                changed the{" "}
                                                <strong>
                                                  {obj.field_name}
                                                </strong>
                                              </div>
                                              
                                              <div className="w-full flex gap-3 items-center">
                                                <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                                                  {obj.old_value}
                                                </span>
                                                <FontAwesomeIcon
                                                  icon={faRightLong}
                                                />
                                                <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                                                  {obj.new_value}
                                                </span>
                                              </div>
                                            </div>}
                                          </div>
                                        </div>

                                        <div className="w-[50%] flex justify-end ">
                                          {formatTimeAgo(obj.updated_at)}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </TabsContent>
                            <TabsContent value="comment">
                              <TicketCommnets tktid={ticketDetails.id} usersData={usersData} />
                            </TabsContent>
                            <TabsContent value="history">
                              <div className="grid gap-5">
                                {[...ticketHistoryDetails]
                                  .reverse()
                                  .map((obj, idx) => {
                                   const user = usersData.find(u=>String(u.id) === String(obj.changed_by))
                                   console.log("user",user)
                                    return (
                                      <div
                                        className="flex justify-between  gap-2 w-full p-1 pb-3"
                                        key={idx}
                                      >
                                        <div className="flex  w-full gap-2 items-center a">
                                          <div className="flex w-fit gap-3">
                                            <div className="w-fit">
                                              <Avatar className="">
                                                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                                <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                                                  {obj.changed_by[0] || "u"}
                                                </AvatarFallback>
                                              </Avatar>
                                            </div>
                                            {obj.old_value.trim() === "" ? (<div>
                                                {/* {user?.first_name.trim()=== "" ? user.email : `${user?.first_name} ${user?.last_name}`} =====> uncomment this after getting login user  */}
                                                <span> <strong>User</strong> Created the <strong>Card</strong></span>
                                              </div>) :
                                            <div className="flex gap-3 flex-col items-center ">
                                              <div className=" w-full">
                                                <strong className="capitalize">
                                                  {obj.changed_by || "user"}
                                                </strong>{" "}
                                                changed the{" "}
                                                <strong>
                                                  {obj.field_name}
                                                </strong>
                                              </div>
                                              
                                              <div className="w-full flex gap-3 items-center">
                                                <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                                                  {obj.old_value}
                                                </span>
                                                <FontAwesomeIcon
                                                  icon={faRightLong}
                                                />
                                                <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                                                  {obj.new_value}
                                                </span>
                                              </div>
                                            </div>}
                                          </div>
                                        </div>

                                        <div className="w-[50%] flex justify-end ">
                                          {formatTimeAgo(obj.updated_at)}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </TabsContent>
                            <TabsContent value="worklogs">Worklogs</TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" grid gap-5 h-fit ">
                <Card>
                  <CardContent className="grid gap-4 p-2">
                    <div className="flex justify-between text-sm">
                      <p>Details</p>
                      <p className="underline">Add To Watchlist</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <Label>Priority</Label>
                      <SelectSearch
                        SelectSearchData={ticketSeverityData}
                        title={"Select State"}
                        size={"sm"}
                        value={ticketDetails.ticket_severity}
                        onChange={() => {}}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <Label className="flex items-center">
                        Allocated Hours
                      </Label>
                      {/* <span className="border border-gray-500 p-1 rounded">None</span> */}

                      <Input
                        type="time"
                        step={1}
                        className="bg-background cursor-pointer border-black rounded appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>

                    <div className="grid grid-cols-2">
                      <Label>Time Tracking</Label>
                      <span className="grid">
                        <Progress className="w-full" />
                        <span className="flex justify-end text-xs">
                          {" "}
                          0 % Completed
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="flex items-center">Hours Spent</Label>
                      <span className="border border-gray-500  p-1 rounded">
                        None
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label>Due Date</Label>
                      {ticketDetails.end_date ? (
                        <span className="border-2 border-red-500 w-full text-red-500 p-1 rounded">
                          <FontAwesomeIcon icon={faTriangleExclamation} />{" "}
                          {formattedDate(ticketDetails.end_date)}
                        </span>
                      ) : (
                        "NONE"
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <Label>Collaborators</Label>
                      <div className="flex gap-0.5  items-center">
                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                          {collaborators.slice(0, 2).map((item) => {
                            const user = usersData.find(
                              (u) => u.id === item.user_id
                            );
                            if (!user) return;
                            return (
                              <Avatar key={user.id} className="">
                                <AvatarFallback className="uppercase font-bold bg-blue-950 text-white text-[10px]">
                                  {user.first_name.trim() === ""
                                    ? user.email[0]
                                    : user.first_name[0] + user.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}

                          {collaborators.length > 2 && (
                            <Avatar className="">
                              <AvatarFallback className="uppercase font-bold bg-gray-500 text-white text-[10px]">
                                +{collaborators.length - 2}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <Avatar className="">
                          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                          <AvatarFallback className="uppercase font-bold bg-white text-md  ">
                            <FontAwesomeIcon
                              icon={faUsers}
                              className=""
                              size="lg"
                            />
                          </AvatarFallback>
                        </Avatar>
                        {/* <Avatar className="cursor-pointer">
                          <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white " onClick={()=>setShowSelectCollabs(!showSelectCollabs)}>
                            <FontAwesomeIcon icon={faPlus} />
                          </AvatarFallback>
                        </Avatar> */}

                        
                          <div>
                            <Popover
                              open={collabsOpen}
                              onOpenChange={setCollabsOpen}
                            >
                              <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                  <AvatarFallback
                                    className="uppercase font-bold bg-blue-950 text-md text-white"
                                    onClick={() =>
                                      setShowSelectCollabs(!showSelectCollabs)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </AvatarFallback>
                                </Avatar>
                              </PopoverTrigger>

                              <PopoverContent className={cn("p-0 w-fit")}>
                                <Command className="text-xs">
                                  <CommandInput
                                    placeholder="Search Here..."
                                    className="h-9 text-xs"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No results found.
                                    </CommandEmpty>

                                    <CommandGroup>
                                      {usersData.map((item) => {
                                        const isSelected = collaborators.some(
                                          (c) => c.user_id === item.id
                                        );

                                        return (
                                          <CommandItem
                                            key={item.id}
                                            className="text-xs capitalize flex items-center"
                                            onSelect={() => handleSelect(item)}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2",
                                                isSelected
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />

                                            {item.first_name.trim() === ""
                                              ? item.email
                                              : `${item.first_name} ${item.last_name}`}
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <Label className="flex items-center text-black">
                        Label
                      </Label>
                      <span className="border border-gray-500  p-1 rounded">
                        None
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <Label className="flex items-center">Milestone</Label>
                      <span className="border border-gray-500  p-1 rounded">
                        None
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="capitalize">assignee</Label>
                      <span className="flex items-center gap-2 ">
                        {assigneedetails.length > 0 ? (
                          <Avatar>
                            <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white ">
                              {assigneedetails[0]}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <span
                            className="cursor-pointer text-xs underline text-blue-900"
                            onClick={() => setAssigneeDetails("admin")}
                          >
                            Assign to me
                          </span>
                        )}

                        <span className="uppercase">
                          {" "}
                          {ticketDetails.assignee_id || assigneedetails}
                        </span>
                      </span>
                    </div>

                    <Card
                      className="flex justify-between items-center flex-row! p-2 rounded cursor-pointer "
                      onClick={() => setShowSubTaskInput(!showSubTaskInput)}
                    >
                      <span className="uppercase font-bold text-xs">
                        sub Tasks
                      </span>
                      <span className="bg-gray-900 rounded p-1 text-white cursor-pointer ">
                        <FontAwesomeIcon icon={faPlus} size={"1x"} />
                      </span>
                    </Card>
                    {showSubTaskInput && (
                      <motion.div
                        className=" text-gray-900 p-0 rounded-lg shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="bg-white rounded-md border-2 border-blue-500 min-h-20 ">
                          <Textarea
                            className="resize-none border-0 outline-0 min-h-20 max-h-20 overflow-y-auto thin-scrollbar1 "
                            // value={newTodo}
                            // onChange={(e) => setNewTodo(e.target.value)}
                            // onKeyDown={handleKeydown}
                          />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                <div className="flex flex-col items-end">
                  {createdDateStr && createdTimeStr && (
                    <span>
                      Created &nbsp; {createdDateStr} at {createdTimeStr}
                    </span>
                  )}
                  <span>Updated {formatTimeAgo(ticketDetails.updated_at)}</span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default OpenTicket;
