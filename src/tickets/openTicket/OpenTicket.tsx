import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type WheelEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseTickets, type TicketType } from "../hooks/UseTickets";
import { Textarea } from "@/components/ui/textarea";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowDown,
  AtSign,
  Bold,
  Check,
  ChevronDown,
  CornerDownLeft,
  CornerDownRight,
  CornerRightDown,
  Image,
  Italic,
  List,
  ListOrdered,
  Smile,
  Strikethrough,
  Underline as ULine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectSearch } from "@/components/ui/SelectSearch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTurnDown,
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
  TicketDetails,
  TicketHistoryDetailsType,
  UsersDataType,
} from "../ticketInterfaces/TicketInterfaces";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { keymap } from "@tiptap/pm/keymap";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TicketUpdateFormDataType } from "../updateTicket/UpdateTicket";
import { AttachFileDialog } from "./AttachFileDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface openTicketPropsType {
  openedTicket: TicketDetails;
  setOpenedTicket: Dispatch<SetStateAction<TicketDetails | null>>;
}

const OpenTicket = () => {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails>();
  const [ticketHistoryDetails, setTicketHistoryDetails] = useState<
    TicketHistoryDetailsType[]
  >([]);
  const [createdDateStr, setCreatedDateStr] = useState<string>("");
  const [createdTimeStr, setCreatedTimeStr] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [collabsOpen, setCollabsOpen] = useState<boolean>(true);
  const [collaborators, setCollaborators] = useState<
    TicketCollaboratorsDataType[]
  >([]);
  const [showSelectCollabs, setShowSelectCollabs] = useState<boolean>(false);
  const [showSubTaskInput, setShowSubTaskInput] = useState<boolean>(false);
  const [assigneedetails, setAssigneeDetails] = useState<string>("");
  const [usersData, setUsersData] = useState<UsersDataType[]>([]);
  const [allTickets, setAllTickets] = useState<TicketDetails[]>([]);
  const [subtickets, setSubTickets] = useState<TicketDetails[]>([]);
  const [parentTicket, setParentTicket] = useState<TicketDetails>();
  const [newTodo, setNewTodo] = useState<string>("");
  const [attachDialog, setAttachDialog] = useState<boolean>(false);

  const navigate = useNavigate();
  const {
    GetTicket,
    GetTicketHistory,
    CreateTicketCollaborators,
    GetTicketAllCollaborators,
    EditTicket,
    RemoveTicketCollaborator,
    fetchAllTickets,
    CreateTicket,
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

  console.log("ticket History===>", ticketHistoryDetails);

  useEffect(() => {
    if (params.id) {
      const fetch = async () => {
        // const response = await GetTicket(String(params.id));
        const res = await fetchAllTickets();
        setAllTickets(res);
        const response = res.find(
          (tkt: TicketDetails) => String(tkt.id) === params.id
        );
        if (!response) return;

        if (response) {
          const subtkts = res.filter(
            (t: TicketDetails) =>
              String(t.parent_ticket_id) === String(params.id)
          );

          const parent_tkt = res.find(
            (tkt: TicketDetails) =>
              String(tkt.id) === String(response.parent_ticket_id)
          );
          // console.log("res",res)
          // console.log('respones',response)
          console.log("subtkts", subtkts);
          console.log("parent tkt ====>", parent_tkt);
          setParentTicket(parent_tkt);
          setSubTickets(subtkts);
          setTicketDetails(response);
          const tktHistory = await GetTicketHistory({
            ticket_id: String(response.id),
          });
          if (tktHistory?.status) {
            setTicketHistoryDetails(tktHistory.data.data);
          }
          console.log("tktHistory", tktHistory);

          // setAssigneeDetails(response.assignee_id);
          const usersRes = await GetUsers();
          console.log("usersres", usersRes);
          setUsersData(usersRes.data);
          if (response.assignee_id) {
            // console.log('userdata',usersRes.data,response.assignee_id)
            const assignee = usersRes.data.find(
              (user:any) => Number(user.id) === Number(response.assignee_id)
            );
            // console.log('assingee=============================>',assignee)
            setAssigneeDetails(
              `${assignee?.first_name} ${assignee?.last_name}`
            );
          }
          await GetAllCollaborators();
        }
      };
      fetch();
    }
  }, [params.id]);
  console.log("ticketdetails", ticketDetails);
  // console.log(allTickets)
  console.log("subtickets", subtickets);
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

  async function handleKeydown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    tkt: TicketDetails
  ) {
    if (e.key !== "Enter") {
      return;
    }
    const newTicket = {
      project_id: "",
      board_id: "",
      workflow_id: "",
      status_id: "",
      ticket_status: tkt.ticket_status,
      ticket_state: tkt.ticket_state,
      ticket_severity: tkt.ticket_severity,
      summary: newTodo,
      description: "",
      file_attachment: [],
      comment: "",
      // start_date: new Date(),
      // end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      assignee_id: "",
      reporter_id: "",
      parent_ticket_id: String(tkt.id),
    };
    console.log("newtickt", newTicket);
    const res = await CreateTicket({ data: newTicket, files: null });
    console.log("ticket created", res);
    if (res?.response?.status === 200) {
      window.dispatchEvent(new Event("ticketsUpdated"));
    }

    console.log(newTodo, tkt.ticket_state);
    const tkts = await fetchAllTickets();
    const subtkts = tkts.filter(
      (t: TicketDetails) => String(t.parent_ticket_id) === String(params.id)
    );
    setSubTickets(subtkts);

    setNewTodo("");
    setShowSubTaskInput(false);
  }

  async function GetAllCollaborators() {
    const collabsres = await GetTicketAllCollaborators({
      ticket_id: String(params.id),
    });
    console.log("collabsres", collabsres);
    setCollaborators(collabsres.data);
  }

  const handleSelect = async (item: UsersDataType) => {
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
          user_id: Number(item.id),
        });
      } else {
        await RemoveTicketCollaborator({
          ticket_id: String(params.id),
          user_id: Number(item.id),
        });
      }
    } catch (err) {
      console.error("selecting adding or deleting collaborators", err);

      setCollaborators((prev: any) => {
        if (isSelected) {
          return [...prev, { user_id: item.id }];
        } else {
          return prev.filter((c: any) => c.user_id !== item.id);
        }
      });
    }
    console.log("collabs after select", collaborators);
  };

  const handleDescriptionUpdate = async () => {
    console.log(ticketDetails);
    if (!editor) return;
    const html = editor.getHTML(); // get formatted content as HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editor.getHTML();
    const textContent = tempDiv.textContent || "";
    if (!textContent) {
      return;
    }
    if (!ticketDetails) return;
    await handleEnter(ticketDetails, "description", html);
    // const updatedData = {
    //   ticket_status: ticketDetails?.ticket_status,
    //   ticket_state: ticketDetails?.ticket_state,
    //   ticket_severity: ticketDetails?.ticket_severity,
    //   summary: ticketDetails?.summary,
    //   description: html,
    //   file_attachment: ticketDetails?.file_attachment,
    //   comment: ticketDetails?.comment,
    //   start_date: ticketDetails?.start_date,
    //   end_date: ticketDetails?.end_date,
    //   assignee_id: ticketDetails?.assignee_id,
    //   reporter_id: ticketDetails?.reporter_id,
    //   update_id: String(ticketDetails.id),
    // };

    // console.log(updatedData);
    // const res = await EditTicket(updatedData, [], String(ticketDetails?.id));
    // console.log("res", res);
  };

  const handleEnter = async (
    tktDetails: TicketDetails,
    name?: string,
    value?: string
  ) => {
    if (!tktDetails) return;
    const updatedData: TicketUpdateFormDataType & { [key: string]: any } = {
      ticket_status: tktDetails?.ticket_status,
      ticket_state: tktDetails?.ticket_state,
      ticket_severity: tktDetails?.ticket_severity,
      summary: tktDetails?.summary,
      description: tktDetails.description,
      file_attachment: tktDetails?.file_attachment,
      comment: tktDetails?.comment,
      start_date: tktDetails?.start_date,
      due_date: tktDetails?.due_date,
      assignee_id: tktDetails?.assignee_id,
      reporter_id: tktDetails?.reporter_id,
      update_id: Number(tktDetails.id),
      parent_ticket_id: String(tktDetails.parent_ticket_id),
    };
    if (name && value !== undefined) {
      updatedData[name] = value;
    }
    console.log(updatedData);
    const res = await EditTicket(updatedData, [], String(tktDetails?.id));
    console.log("res", res);
    // setAllTickets(res?.tickets)
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

  const BrowserShortcuts = Extension.create({
    name: "browserShortcuts",

    addProseMirrorPlugins() {
      return [
        keymap({
          "Shift-Alt-i": () => false,
          "Shift-Alt-I": () => false,
        }),
      ];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Add comments" }),
      BrowserShortcuts,
    ],
    content: ticketDetails?.description || "",
  });

  useEffect(() => {
    if (editor && ticketDetails?.description) {
      editor.commands.setContent(ticketDetails.description);
    }
  }, [editor, ticketDetails]);


  // console.log('userdetas',usersData)
  // console.log('ticket',ticketDetails?.assignee_id)
  // console.log('assigndetals',assigneedetails)

  return (
    <Dialog
      open
      defaultOpen={true}
      onOpenChange={(val) => {
        setOpen(val);
        console.log("value", val);
        if (!val) navigate("/tickets");
      }}
    >
      {ticketDetails && (
        <DialogContent className="w-full! sm:w-[90%]! max-w-none! h-[90%]! border-0! shadow-none! focus-visible:outline-none! focus-visible:ring-0 gap-2 p-0 ">
          <DialogHeader className=" gap-0 sticky bg-gray-200 max-w-full py-3 h-fit rounded-md">
            <DialogTitle className="w-full px-2 flex justify-between items-center  ">
              <div className="flex gap-4 items-center">
                <div>
                  {parentTicket && (
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1">
                            <span
                              className="text-gray-500 text-[10px] cursor-pointer"
                              onClick={() => {
                                navigate(`/tickets/view/${parentTicket?.id}`);
                              }}
                            >
                              {parentTicket?.ticket_id}
                            </span>
                            <CornerRightDown size={"14px"} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className=" bg-gray-800 ">
                          <p className="text-[10px] font-bold">
                            Open parent task detail
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                  <span className="text-md font-bold text-blue-950">
                    {ticketDetails.ticket_id}
                  </span>
                </div>
                <span className="border-2 border-orange-400 text-orange-400 p-1 text-sm px-2 rounded ">
                  {ticketDetails.ticket_status}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <div className="">
                  <Popover
                  // open={collabsOpen}
                  // onOpenChange={setCollabsOpen}
                  >
                    <PopoverTrigger asChild>
                      <div className="border border-black p-1.5 px-2 cursor-pointer rounded flex items-center">
                        <span className="text-sm ">Change Parent</span>
                        <ChevronDown size={"18px"} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className={cn("p-0")}>
                      <Command className="text-xs">
                        <CommandInput
                          placeholder="Search Here..."
                          className="h-9 text-xs "
                        />

                        <CommandList
                          className=" p-0 max-h-40 overflow-y-auto"
                          onWheel={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (el.scrollHeight > el.clientHeight) {
                              el.scrollTop += (e as WheelEvent).deltaY;
                              e.preventDefault();
                            }
                          }}
                        >
                          <CommandEmpty>No results found.</CommandEmpty>

                          <CommandGroup>
                            {allTickets.map((tkt: TicketDetails) => {
                              const isSelected =
                                ticketDetails.parent_ticket_id !== "0" &&
                                ticketDetails.parent_ticket_id ===
                                  String(tkt.id);

                              return (
                                <CommandItem
                                  key={tkt.id}
                                  className="text-xs capitalize flex items-center"
                                  onSelect={async () => {
                                    const updated = isSelected
                                      ? {
                                          ...ticketDetails,
                                          parent_ticket_id: "0",
                                        }
                                      : {
                                          ...ticketDetails,
                                          parent_ticket_id: String(tkt.id),
                                        };

                                    console.log("update", updated);
                                    setTicketDetails(updated);
                                    await handleEnter(updated);
                                    // const res = await fetchAllTickets()
                                    // setAllTickets(res)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />

                                  {tkt.ticket_id}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div
                  className="border border-black rounded p-1 cursor-pointer"
                  onClick={() => setAttachDialog(!attachDialog)}
                >
                  <span>
                    <FontAwesomeIcon icon={faPaperclip} size={"xs"} />
                  </span>
                  <span className="capitalize text-sm">Add Attachment</span>
                </div>

                <div
                  className="float-right p-1.5 bg-gray-300 rounded"
                  onClick={() => {
                    setOpen(false);
                    navigate("/tickets");
                  }}
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
          {attachDialog && (
            <AttachFileDialog
              attachDialog
              setAttachDialog={setAttachDialog}
              ticket_id={ticketDetails.id}
            />
          )}
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
                    <div className="font-bold text-blue-950 text-lg">
                      {/* <span className="text-lg font-bold">Summary</span> */}
                      <Textarea
                        value={ticketDetails.summary}
                        onChange={(e) =>
                          setTicketDetails((prev) => ({
                            ...prev!,
                            summary: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEnter(
                              ticketDetails,
                              "summary",
                              ticketDetails.summary
                            );
                          }
                        }}
                        className=" resize-none min-h-10 border-0 outline-0 focus:outline-0 focus:border-0 font-bold text-blue-950 text-lg! px-0  focus:ring-0 shadow-none"
                      />
                      {/* <p className="font-bold text-blue-950 text-lg">
                        {ticketDetails.summary}
                      </p> */}
                    </div>
                    <div>
                      <span className="text-lg font-bold"> Description</span>

                      <div className="border-2 rounded">
                        <div className="flex border-b-2 bg-gray-200 ">
                          <ToggleGroup type="single" className="flex gap-2">
                            {/* Bold */}
                            <ToggleGroupItem
                              value="bold"
                              className={`p-2 rounded cursor-pointer ${
                                editor?.isActive("bold")
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                editor?.chain().focus().toggleBold().run()
                              }
                            >
                              <Bold className="h-4 w-4" />
                            </ToggleGroupItem>

                            {/* Italic */}
                            <ToggleGroupItem
                              value="italic"
                              className={`p-2 rounded cursor-pointer ${
                                editor?.isActive("italic")
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                editor?.chain().focus().toggleItalic().run()
                              }
                            >
                              <Italic className="h-4 w-4" />
                            </ToggleGroupItem>

                            {/* Underline */}
                            <ToggleGroupItem
                              value="underline"
                              className={`p-2 rounded cursor-pointer ${
                                editor?.isActive("underline")
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                editor?.chain().focus().toggleUnderline().run()
                              }
                            >
                              <ULine className="h-4 w-4" />
                            </ToggleGroupItem>

                            {/* Ordered List */}
                            {/* <ToggleGroupItem
                              value="listOrdered"
                              className={`p-2 rounded cursor-pointer ${
                                editor?.isActive("orderedList")
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleOrderedList()
                                  .run()
                              }
                            >
                              <ListOrdered className="h-4 w-4" />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                              value="list"
                              className={`p-2 rounded cursor-pointer ${
                                editor?.isActive("bulletList")
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                editor?.chain().focus().toggleBulletList().run()
                              }
                            >
                              <List className="h-4 w-4" />
                            </ToggleGroupItem> */}

                            {/* <ToggleGroupItem
                              value="strikeThrough"
                              className="cursor-pointer"
                            >
                              <Strikethrough className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="image"
                              className="cursor-pointer"
                            >
                              <Image className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="atSign"
                              className="cursor-pointer"
                            >
                              <AtSign className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="smile"
                              className="cursor-pointer"
                            >
                              <Smile className="h-4 w-4" />
                            </ToggleGroupItem> */}
                          </ToggleGroup>
                        </div>
                        <div className="">
                          <EditorContent
                            editor={editor}
                            // onFocus={() => setIsFocused(true)}
                            // ref={textareaRef}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                console.log("enter", editor.getHTML());
                            }}
                            className={cn(`tiptap-editor
                                          border-0 rounded-md cursor-pointer outline-none focus:outline-none focus:ring-0
                                          [&_p]:min-h-30 [&_p]:rounded-md [&_p]:p-2`)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="bg-blue-950 hover:bg-blue-950 px-8 cursor-pointer"
                        onClick={handleDescriptionUpdate}
                      >
                        Save
                      </Button>
                      <Button
                        variant={"outline"}
                        className="px-8"
                        onClick={() =>
                          editor?.commands.setContent(ticketDetails.description)
                        }
                      >
                        Cancel
                      </Button>
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
                                    const user = usersData.find(
                                      (u) =>
                                        String(u.id) === String(obj.changed_by)
                                    );
                                    console.log("user", user);
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
                                              </div>
                                           
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
                              <TicketCommnets
                                tktid={String(ticketDetails.id)}
                                usersData={usersData}
                              />
                            </TabsContent>
                            <TabsContent value="history">
                              <div className="grid gap-5">
                                {[...ticketHistoryDetails]
                                  .reverse()
                                  .map((obj, idx) => {
                                    const user = usersData.find(
                                      (u) =>
                                        String(u.id) === String(obj.changed_by)
                                    );
                                    console.log("user", user);
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
                                            {/* {obj.old_value.trim() === "" ? (
                                              <div>
                                                <span>
                                                  
                                                 {obj.new_value}
                                                </span>
                                              </div>
                                            ) : ( */}
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
                                              </div>
                                             {/* )} */}
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
                <Card className="pt-0">
                  <div className="flex justify-between text-sm bg-gray-200 p-3 text-blue-950 rounded-t-xl">
                    <p className="font-bold">Details</p>
                    <p className="underline font-bold">Add To Watchlist</p>
                  </div>
                  <CardContent className="grid gap-4 px-2">
                    <div className="grid grid-cols-2">
                      <Label>Priority</Label>
                      <SelectSearch
                        SelectSearchData={ticketSeverityData}
                        title={"Select State"}
                        size={"sm"}
                        value={ticketDetails.ticket_severity}
                        onChange={async (val) => {
                          setTicketDetails((prev) =>
                            prev
                              ? { ...prev, ticket_severity: val }
                              : ({ ticket_severity: val } as TicketDetails)
                          );
                          const updated = {
                            ...ticketDetails,
                            ticket_severity: val,
                          };
                          handleEnter(updated, "ticket_severity", val);
                        }}
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

                    {/* <div className="grid grid-cols-2">
                      <Label className="capitalize">assignee</Label>
                      <div className="flex items-center gap-2 ">
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
                          {ticketDetails.assignee_id && assigneedetails}
                        </span>

                        {!ticketDetails.assignee_id && (
                          <Select onValueChange={(val)=>{
                             handleEnter(ticketDetails, "assignee_id", val);
                          }}>
                            <SelectTrigger className="w-full text-xs">
                              <SelectValue placeholder=" select Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {usersData.map((user) => {
                                return (
                                  <SelectItem value={String(user.id)}>{`${user.first_name} ${user.last_name}`}</SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div> */}

                    <div className="grid grid-cols-2">
                      <Label className="capitalize">Assignee</Label>

                      <div className="flex items-center gap-2">
                        {/* Avatar */}
                        {assigneedetails ? (
                          <Avatar>
                            <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white">
                              {assigneedetails.split(" ").map(word=>word[0]).join("")} 
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

                        {/* Name display */}
                        <span className="uppercase">
                          {assigneedetails || ticketDetails.assignee_id}
                        </span>

                        {/* Select only when no assignee */}
                        {!ticketDetails.assignee_id && !assigneedetails && (
                          <Select
                            onValueChange={(val) => {
                              handleEnter(ticketDetails, "assignee_id", val);
                            }}
                          >
                            <SelectTrigger className="w-full text-xs">
                              <SelectValue placeholder="Select Assignee" />
                            </SelectTrigger>

                            <SelectContent>
                              {usersData.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={String(user.id)}
                                >
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
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
                                  <CommandEmpty>No results found.</CommandEmpty>

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
                      <Label>Due Date</Label>
                      {ticketDetails.due_date ? (
                        <span className="border-2 border-red-500 w-full text-red-500 p-1 rounded">
                          <FontAwesomeIcon icon={faTriangleExclamation} />{" "}
                          {formattedDate(ticketDetails.due_date)}
                        </span>
                      ) : (
                        "NONE"
                      )}
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="capitalize">reporter</Label>
                      <span className="flex items-center gap-2 ">
                        <Avatar>
                          <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white ">
                            {ticketDetails.reporter_id}
                          </AvatarFallback>
                        </Avatar>

                        <span className="uppercase">
                          {ticketDetails.reporter_id}
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
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={(e) => handleKeydown(e, ticketDetails)}
                          />
                        </div>
                      </motion.div>
                    )}
                    <div className="w-full flex gap-2 flex-col">
                      {subtickets.map((tkt: TicketDetails) => {
                        return (
                          <Card className="p-0 rounded" key={tkt.id}>
                            <CardContent className="p-0">
                              <Textarea
                                className="resize-none border-0 outline-0 min-h-16 max-h-20 overflow-y-auto thin-scrollbar1 "
                                value={tkt.summary}
                                onChange={(e) =>
                                  setSubTickets((prev) =>
                                    prev.map((item: TicketDetails) =>
                                      item.id === tkt.id
                                        ? { ...item, summary: e.target.value }
                                        : item
                                    )
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    (e.target as HTMLInputElement).blur();
                                    handleEnter(tkt, "summary", tkt.summary);
                                  }
                                }}
                              />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
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
